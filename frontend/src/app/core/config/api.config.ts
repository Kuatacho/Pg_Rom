export const API_CONFIG = {
  baseUrl: 'http://localhost:5000/api',
  auth:{
    login: '/auth/login',
    register: '/auth/registerres',
    //todo: corregir ruta forgot
    //forgotPassword: '/auth/forgotPassword'

  },
} as const;
