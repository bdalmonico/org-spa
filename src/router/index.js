// import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '../views/HomeView.vue';
// import ProyectosView from "../views/ProyectosView.vue";
// import ProyectoView from "../views/ProyectoView.vue";
// import TestView from "../views/TestView.vue";
// // import EmpleadosView from "../views/EmpleadosView.vue";
// // import ClientesView from "../views/ClientesView.vue";

// const routes = [
//   { path: '/', component: HomeView },
//   { path: '/proyecto', component: ProyectoView },
//   { path: "/proyectos", component: ProyectosView },
//   { path: "/testview", component: TestView }
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// });

// export default router;


import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProyectosView from '../views/ProyectosView.vue';
import ProyectoView from '../views/ProyectoView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/home', component: HomeView },
  { path: '/proyectos', component: ProyectosView },
  { path: '/proyecto/:id', component: ProyectoView, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;