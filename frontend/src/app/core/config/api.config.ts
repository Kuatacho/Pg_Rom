export const API_CONFIG = {
  baseUrl: 'http://localhost:5000/api',

  admin:{
    list_users:'/list-usuarios',
    list_users_id:'/list-usuarios-by',
    update_users:'/update-usuario',
  },

  auth:{
    login: '/auth/login',
    register: '/auth/register',

    //todo: corregir ruta forgot
    //forgotPassword: '/auth/forgotPassword'

  },


  learning:{
    lecciones:'/lecciones',
    create_nota:'/create-nota'
  }
} as const;
