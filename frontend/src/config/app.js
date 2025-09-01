// Configuración del entorno para el frontend
export const CONFIG = {
  // Configuración del backend
  BACKEND: {
    BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://us-central1-academy-bd619.cloudfunctions.net/api'
      : 'http://localhost:5006',
    TIMEOUT: 10000,
    USE_BACKEND: true, // Cambiar a false para usar solo datos locales
  },

  // Configuración de Firebase
  FIREBASE: {
    PROJECT_ID: 'academy-bd619',
    USE_FIREBASE_AUTH: false, // Cambiar a true para usar autenticación Firebase real
  },

  // Configuración de la aplicación
  APP: {
    NAME: 'Academia Digital',
    VERSION: '2.0.0',
    DEMO_MODE: false, // Modo demostración para el examen
    AUTO_REFRESH_INTERVAL: 30000, // 30 segundos
  },

  // Configuración de desarrollo
  DEV: {
    ENABLE_LOGGING: true,
    MOCK_DATA: true,
    SIMULATE_LATENCY: false,
  },

  // URLs y endpoints
  ENDPOINTS: {
    METRICS: {
      STUDENT: '/metrics/student',
      TEACHER: '/metrics/teacher', 
      ADMIN: '/metrics/admin',
      BY_ROLE: '/metrics/role'
    },
    NOTIFICATIONS: {
      USER: '/notifications/user',
      UNREAD: '/notifications/unread',
      MARK_READ: '/notifications/:id/read',
      MARK_ALL_READ: '/notifications/read-all',
      CREATE: '/notifications',
      DELETE: '/notifications/:id'
    },
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VERIFY: '/auth/verify-token'
    }
  }
};

// Configuración específica para el Día 2 del examen
export const DAY2_CONFIG = {
  REAL_TIME_UPDATES: true,
  METRICS_REFRESH_RATE: 30000, // 30 segundos
  NOTIFICATIONS_REFRESH_RATE: 15000, // 15 segundos
  ENABLE_ANIMATIONS: true,
  SHOW_DEBUG_INFO: false, // Cambiar a true para ver información de debug
};

export default CONFIG;
