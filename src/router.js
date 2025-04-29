 
import { createRouter, createWebHistory } from 'vue-router'
import dashboardPage from './components/dashboardPage.vue';
import canvasPage from './components/canvasPage.vue';
import savedDesign from './components/savedDesign.vue';
import resumeTemplate from './components/resumeTemplate.vue';
import ModernResume from './components/resumeTemplate/ModernResume.vue';
import ProfessionalResume from './components/resumeTemplate/ProfessionalResume.vue';
import MinimalistResume from  './components/resumeTemplate/MinimalistResume.vue';
import excelSheet from './components/excelSheet.vue';


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
  {
    path: '/resume',
    name: 'resumeTemplate',
    component: resumeTemplate,
  },
  {
    path: '/sheet',
    name: 'excelSheet',
    component:  excelSheet,
  },
  {
    path: '/modernResume',
    name: 'ModernResume',
    component: ModernResume,
  },
  {
    path: '/professional',
    name: 'professional',
    component: ProfessionalResume,
  },
  {
    path: '/minimalist',
    name: 'minimalist',
    component: MinimalistResume,
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
