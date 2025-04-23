 
import { createRouter, createWebHistory } from 'vue-router'
import dashboardPage from './components/dashboardPage.vue';
import canvasPage from './components/canvasPage.vue';
import savedDesign from './components/savedDesign.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: dashboardPage,
  },
  {
    path: '/canvas',
    name: 'canvasPage',
    component: canvasPage,
  },
  {
    path: '/save',
    name: 'savedDesign',
    component: savedDesign,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
