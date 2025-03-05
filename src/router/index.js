import { createRouter, createWebHistory } from 'vue-router';
import Projetos from '../views/ProyectosView.vue';
import ProjetoDetalhes from '../views/ProyectoDetail.vue';
import Clientes from '../views/Clientes.vue';
import Empleados from '../views/Empleados.vue';
import Tareas from '../views/Tareas.vue';
import TareaDetail from '../views/TareaDetail.vue';

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
  { path: '/projetos', name: 'Projetos', component: Projetos },
  { path: '/projetos/:id', name: 'ProjetoDetalhes', component: ProjetoDetalhes },
  { path: '/clientes', name: 'Clientes', component: Clientes },
  { path: '/empleados', name: 'Empleados', component: Empleados },
  { path: '/tareas', name: 'Tareas', component: Tareas },
  { path: '/tareas/:id', name: 'TareaDetalhes', component: TareaDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;