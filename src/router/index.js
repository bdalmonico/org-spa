import { createRouter, createWebHistory } from 'vue-router';
import Projetos from '../views/ProyectosView.vue';
import ProjetoDetalhes from '../views/ProyectoDetail.vue';
import Clientes from '../views/Clientes.vue';
import Empleados from '../views/Empleados.vue';
import Tareas from '../views/Tareas.vue';
import TareaDetail from '../views/TareaDetail.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    redirect: '/login', // Redireciona a raiz para /login
  },
  { path: '/home', name: 'Home', component: () => import('../views/HomeView.vue'),meta: { requiresAuth: true }, },
  { path: '/projetos', name: 'Projetos', component: Projetos, meta: { requiresAuth: true },},
  { path: '/projetos/:id', name: 'ProjetoDetalhes', component: ProjetoDetalhes,meta: { requiresAuth: true }, },
  { path: '/clientes', name: 'Clientes', component: Clientes,meta: { requiresAuth: true }, },
  { path: '/empleados', name: 'Empleados', component: Empleados,meta: { requiresAuth: true }, },
  { path: '/tareas', name: 'Tareas', component: Tareas,meta: { requiresAuth: true }, },
  { path: '/tareas/:id', name: 'TareaDetalhes', component: TareaDetail,meta: { requiresAuth: true }, },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = document.cookie.includes('userId') && document.cookie.includes('userEmail');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;