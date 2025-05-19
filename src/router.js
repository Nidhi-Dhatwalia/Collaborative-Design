 
import { createRouter, createWebHistory } from 'vue-router'
import dashboardPage from './components/dashboard/dashboardPage.vue';
import canvasPage from './components/canvas/canvasPage.vue';
import savedDesign from './components/canvas/savedDesign.vue';
import resumeTemplate from './components/resumeTemplate/resumeTemplate.vue';
import ModernResume from './components/resumeTemplate/ModernResume.vue';
import ProfessionalResume from './components/resumeTemplate/ProfessionalResume.vue';
import MinimalistResume from  './components/resumeTemplate/MinimalistResume.vue';
import excelSheet from './components/canvas/excelSheet.vue';
import loginPage from './components/login/loginPage.vue';
 

//Dashboard Router-Links 
import plans from './components/dashboard/plans.vue';
import features from './components/dashboard/features.vue';
import featureReadyToPrint from './components/dashboard/featureReadyToPrint.vue';
import getStarted from './components/dashboard/getStarted.vue';


const routes = [
  {
    path: '/dashboard',
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
  {
    path: '/',
    name: 'loginPage',
    component: loginPage,
  }, 


  
  //dashboard Paths 
  
  {
    path: '/plans',
    name: 'plans',
    component: plans,
  },
  {
    path: '/features',
    name: 'features',
    component: features,
  },
  {
    path: '/feature',
    name: 'featureReadyToPrint',
    component: featureReadyToPrint,
  },
  {
    path: '/getStarted',
    name: 'getStarted',
    component: getStarted,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
