import { createRouter, createWebHistory } from 'vue-router'
import {auth, redirectIfAuthenticated} from "@/router/guard";
import { useAuth } from "@/store/auth";


const routes = [
  {
    path: '/login',
    component: () => import('@/layouts/Login.vue'),
    beforeEnter: redirectIfAuthenticated,
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/views/Login.vue')
      }
    ],
  },
  {
    path: '/cadastrar',
    component: () => import('@/layouts/Login.vue'),
    children: [
      {
        path: '',
        name: 'cadastrar',
        component: () => import('@/views/Registro.vue'),
      },
    ],
  },
  {
    path: '/verificar-email',
    component: () => import('@/layouts/Login.vue'),
    children: [
      {
        path: '',
        name: 'verificarEmail',
        component: () => import('@/views/VerificarEmail.vue'),
      },
    ],
  },
  {
    path: '/esqueci-senha',
    component: () => import('@/layouts/Login.vue'),
    children: [
      {
        path: '',
        name: 'esqueciSenha',
        component: () => import('@/views/EsqueciSenha.vue'),
      },
    ],
  },

  {
    path: '/cliente',
    component: () => import('@/layouts/Dashboard.vue'),
    beforeEnter: auth,
    children: [
      { path: '/cliente', name: 'cadastrarCliente', component: () => import('@/views/Cliente.vue') },
      { path: '/cliente', name: 'listaClientes', component: () => import('@/views/Cliente.vue') },
      { path: '/cliente', name: 'editarCliente', component: () => import('@/views/Cliente.vue') },
      { path: '/cliente', name: 'excluirCliente', component: () => import('@/views/Cliente.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/Dashboard.vue'),
    beforeEnter: auth,
    children: [
      { path: '/', name: 'dashboard', component: () => import('@/views/Dashboard.vue') },
    ],
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) =>{
  const authStore = useAuth()
  authStore.sanctum();
  next()
})
export default router
