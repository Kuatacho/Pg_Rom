export const API_CONFIG = {
  baseUrl: 'http://localhost:5000/api',

  admin:{
    list_users:'/list-usuarios',
    list_users_id:'/list-usuarios-by',
    update_users:'/update-usuario',
    get_notas:'/notas'

  },

  auth:{
    login: '/auth/login',
    register: '/auth/register',


    forgotPassword: '/auth/forgot'

  },


  learning:{
    lecciones:'/lecciones',
    create_nota:'/create-nota'
  }
} as const;
