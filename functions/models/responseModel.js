const admin = require('../config/firebase');
const db = admin.firestore();
const responsesCollection = db.collection('responses');
const evaluationsCollection = db.collection('evaluations');
const enrollmentsCollection = db.collection('enrollments');

/**
 * Modelo para manejar operaciones relacionadas con respuestas de evaluaciones en Firestore
 */
class ResponseModel {
  /**
   * Obtiene una respuesta por su ID
   * @param {string} responseId - ID de la respuesta
   * @returns {Promise<Object|null>} Datos de la respuesta o null si no existe
   */
  static async findById(responseId) {
    try {
      const responseDoc = await responsesCollection.doc(responseId).get();
      if (!responseDoc.exists) return null;
      
      return {
        id: responseDoc.id,
        ...responseDoc.data()
      };
    } catch (error) {
      console.error('Error en findById:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene respuestas por usuario y/o evaluación
   * @param {string} userId - ID del usuario (opcional)
   * @param {string} evaluationId - ID de la evaluación (opcional)
   * @returns {Promise<Array>} Lista de respuestas
   */
  static async findByUserAndEvaluation(userId = null, evaluationId = null) {
    try {
      let query = responsesCollection;
      
      if (userId) {
        query = query.where('userId', '==', userId);
      }
      
      if (evaluationId) {
        query = query.where('evaluationId', '==', evaluationId);
      }
      
      const snapshot = await query.get();
      
      if (snapshot.empty) return [];
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error en findByUserAndEvaluation:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las respuestas de una evaluación específica
   * @param {string} evaluationId - ID de la evaluación
   * @returns {Promise<Array>} Lista de respuestas
   */
  static async findByEvaluationId(evaluationId) {
    try {
      const snapshot = await responsesCollection
        .where('evaluationId', '==', evaluationId)
        .orderBy('submittedAt', 'desc')
        .get();
      
      if (snapshot.empty) return [];
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error en findByEvaluationId:', error);
      throw error;
    }
  }
  
  /**
   * Envía una respuesta a una evaluación
   * @param {Object} responseData - Datos completos de la respuesta
   * @returns {Promise<Object>} La respuesta creada
   */
  static async submitResponse(responseData) {
    try {
      // Verificar que la evaluación existe
      const evaluationDoc = await evaluationsCollection.doc(responseData.evaluationId).get();
      if (!evaluationDoc.exists) {
        throw new Error('La evaluación no existe');
      }
      
      // Verificar si ya existe una respuesta para esta evaluación
      const existingResponseSnapshot = await responsesCollection
        .where('userId', '==', responseData.userId)
        .where('evaluationId', '==', responseData.evaluationId)
        .limit(1)
        .get();
        
      if (!existingResponseSnapshot.empty) {
        const evaluation = evaluationDoc.data();
        
        // Verificar si se permiten múltiples intentos
        if (!evaluation.allowRetakes) {
          throw new Error('Ya has respondido esta evaluación');
        }
        
        // Verificar límite de intentos
        if (evaluation.maxAttempts && evaluation.maxAttempts > 0) {
          const userResponses = await responsesCollection
            .where('userId', '==', responseData.userId)
            .where('evaluationId', '==', responseData.evaluationId)
            .get();
          
          if (userResponses.size >= evaluation.maxAttempts) {
            throw new Error(`Has alcanzado el límite de ${evaluation.maxAttempts} intentos`);
          }
        }
        
        // Agregar número de intento
        responseData.attemptNumber = userResponses.size + 1;
      } else {
        responseData.attemptNumber = 1;
      }
      
      // Crear la respuesta
      const responseRef = await responsesCollection.add(responseData);
      
      // Actualizar progreso del curso
      await this.updateCourseProgress(responseData.userId, evaluationDoc.data().courseId, responseData.evaluationId);
      
      return {
        id: responseRef.id,
        ...responseData
      };
    } catch (error) {
      console.error('Error en submitResponse:', error);
      throw error;
    }
  }

  /**
   * Actualiza la calificación de una respuesta (calificación manual)
   * @param {string} responseId - ID de la respuesta
   * @param {Object} gradeData - Datos de la calificación
   * @returns {Promise<Object>} La respuesta actualizada
   */
  static async updateGrade(responseId, gradeData) {
    try {
      const responseRef = responsesCollection.doc(responseId);
      const responseDoc = await responseRef.get();
      
      if (!responseDoc.exists) {
        throw new Error('Respuesta no encontrada');
      }
      
      await responseRef.update({
        ...gradeData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      const updatedDoc = await responseRef.get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error('Error en updateGrade:', error);
      throw error;
    }
  }

  /**
   * Actualiza el progreso del curso basado en evaluaciones completadas
   * @param {string} userId - ID del usuario
   * @param {string} courseId - ID del curso
   * @param {string} evaluationId - ID de la evaluación completada
   */
  static async updateCourseProgress(userId, courseId, evaluationId) {
    try {
      const enrollmentsSnapshot = await enrollmentsCollection
        .where('userId', '==', userId)
        .where('courseId', '==', courseId)
        .limit(1)
        .get();
      
      if (!enrollmentsSnapshot.empty) {
        const enrollmentDoc = enrollmentsSnapshot.docs[0];
        const enrollmentData = enrollmentDoc.data();
        
        // Añadir esta evaluación a completedEvaluations si no existe ya
        const completedEvaluations = enrollmentData.completedEvaluations || [];
        if (!completedEvaluations.includes(evaluationId)) {
          completedEvaluations.push(evaluationId);
          
          // Actualizar el progreso basado en evaluaciones completadas
          const courseEvaluationsSnapshot = await evaluationsCollection
            .where('courseId', '==', courseId)
            .get();
            
          const progress = courseEvaluationsSnapshot.size > 0 
            ? (completedEvaluations.length / courseEvaluationsSnapshot.size) * 100 
            : 0;
          
          await enrollmentDoc.ref.update({
            completedEvaluations,
            progress: Math.min(progress, 100), // No exceder el 100%
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error actualizando progreso del curso:', error);
      // No lanzar error para no afectar el flujo principal
    }
  }

  /**
   * Obtiene el historial de evaluaciones completadas por un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} Lista de evaluaciones completadas con sus puntajes
   */
  static async getCompletedEvaluations(userId) {
    try {
      const responsesSnapshot = await responsesCollection
        .where('userId', '==', userId)
        .orderBy('submittedAt', 'desc')
        .get();
      
      if (responsesSnapshot.empty) return [];
      
      const responses = responsesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Obtener datos de las evaluaciones
      const evaluationIds = [...new Set(responses.map(r => r.evaluationId))];
      const evaluationsData = {};
      
      for (const evalId of evaluationIds) {
        const evalDoc = await evaluationsCollection.doc(evalId).get();
        if (evalDoc.exists) {
          evaluationsData[evalId] = evalDoc.data();
        }
      }
      
      // Combinar respuestas con datos de evaluaciones
      return responses.map(response => ({
        ...response,
        evaluation: evaluationsData[response.evaluationId] || null
      }));
      
    } catch (error) {
      console.error('Error en getCompletedEvaluations:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de respuestas para una evaluación
   * @param {string} evaluationId - ID de la evaluación
   * @returns {Promise<Object>} Estadísticas de la evaluación
   */
  static async getEvaluationStatistics(evaluationId) {
    try {
      const responsesSnapshot = await responsesCollection
        .where('evaluationId', '==', evaluationId)
        .get();
      
      if (responsesSnapshot.empty) {
        return {
          totalResponses: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          passRate: 0
        };
      }
      
      const responses = responsesSnapshot.docs.map(doc => doc.data());
      const scores = responses.map(r => r.percentage || 0);
      
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const highestScore = Math.max(...scores);
      const lowestScore = Math.min(...scores);
      const passRate = (scores.filter(score => score >= 60).length / scores.length) * 100;
      
      return {
        totalResponses: responses.length,
        averageScore: Math.round(averageScore),
        highestScore,
        lowestScore,
        passRate: Math.round(passRate),
        scoreDistribution: {
          excellent: scores.filter(s => s >= 90).length,
          good: scores.filter(s => s >= 70 && s < 90).length,
          average: scores.filter(s => s >= 60 && s < 70).length,
          poor: scores.filter(s => s < 60).length
        }
      };
    } catch (error) {
      console.error('Error en getEvaluationStatistics:', error);
      throw error;
    }
  }

  /**
   * Elimina una respuesta
   * @param {string} responseId - ID de la respuesta a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  static async deleteResponse(responseId) {
    try {
      await responsesCollection.doc(responseId).delete();
      return true;
    } catch (error) {
      console.error('Error en deleteResponse:', error);
      throw error;
    }
  }
}

module.exports = ResponseModel;
