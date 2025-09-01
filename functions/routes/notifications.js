const express = require('express');
const router = express.Router();
const admin = require('../config/firebase');
const { verifyToken } = require('../middlewares/authMiddleware');

const db = admin.firestore();

// Obtener notificaciones del usuario
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;
    
    // Verificar que el usuario solicita sus propias notificaciones o es admin
    if (req.user.uid !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para ver estas notificaciones' });
    }

    const notificationsQuery = db.collection('notifications')
      .where('userId', 'in', [userId, 'all'])
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit));

    const snapshot = await notificationsQuery.get();
    const notifications = [];

    snapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      });
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener conteo de notificaciones no leídas
router.get('/unread/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verificar que el usuario solicita su propio conteo o es admin
    if (req.user.uid !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const unreadQuery = db.collection('notifications')
      .where('userId', 'in', [userId, 'all'])
      .where('read', '==', false);

    const snapshot = await unreadQuery.get();
    res.json({ count: snapshot.size });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear una nueva notificación
router.post('/', verifyToken, async (req, res) => {
  try {
    // Solo admins y sistema pueden crear notificaciones
    if (req.user.role !== 'admin' && req.user.role !== 'system') {
      return res.status(403).json({ error: 'No autorizado para crear notificaciones' });
    }

    const { title, message, type, priority, userId, category } = req.body;

    if (!title || !message || !userId) {
      return res.status(400).json({ error: 'Faltan campos requeridos: title, message, userId' });
    }

    const notification = {
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      userId,
      category: category || 'general',
      timestamp: admin.firestore.Timestamp.now(),
      read: false,
      createdBy: req.user.uid
    };

    const docRef = await db.collection('notifications').add(notification);
    
    res.status(201).json({
      id: docRef.id,
      ...notification,
      timestamp: notification.timestamp.toDate()
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Marcar notificación como leída
router.patch('/:notificationId/read', verifyToken, async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notificationRef = db.collection('notifications').doc(notificationId);
    const notificationDoc = await notificationRef.get();

    if (!notificationDoc.exists) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    const notification = notificationDoc.data();
    
    // Verificar que el usuario puede marcar esta notificación
    if (notification.userId !== req.user.uid && 
        notification.userId !== 'all' && 
        req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await notificationRef.update({ read: true });
    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Marcar todas las notificaciones como leídas
router.patch('/read-all/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verificar que el usuario puede marcar sus notificaciones
    if (req.user.uid !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const unreadQuery = db.collection('notifications')
      .where('userId', 'in', [userId, 'all'])
      .where('read', '==', false);

    const snapshot = await unreadQuery.get();
    const batch = db.batch();

    snapshot.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
    res.json({ message: `${snapshot.size} notificaciones marcadas como leídas` });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar notificación
router.delete('/:notificationId', verifyToken, async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notificationRef = db.collection('notifications').doc(notificationId);
    const notificationDoc = await notificationRef.get();

    if (!notificationDoc.exists) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    const notification = notificationDoc.data();
    
    // Verificar que el usuario puede eliminar esta notificación
    if (notification.userId !== req.user.uid && 
        notification.userId !== 'all' && 
        req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await notificationRef.delete();
    res.json({ message: 'Notificación eliminada' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear notificación automática del sistema
router.post('/system', async (req, res) => {
  try {
    const { title, message, type, priority, userId, category, triggerType } = req.body;

    if (!title || !message || !userId) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const notification = {
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      userId,
      category: category || 'system',
      timestamp: admin.firestore.Timestamp.now(),
      read: false,
      createdBy: 'system',
      triggerType: triggerType || 'manual'
    };

    const docRef = await db.collection('notifications').add(notification);
    
    res.status(201).json({
      id: docRef.id,
      ...notification,
      timestamp: notification.timestamp.toDate()
    });
  } catch (error) {
    console.error('Error creating system notification:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener notificaciones para admin (todas)
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    // Verificar que el usuario es admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { limit = 50 } = req.query;

    const notificationsQuery = db.collection('notifications')
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit));

    const snapshot = await notificationsQuery.get();
    const notifications = [];

    snapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      });
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
