 
import { createRouter, createWebHistory } from 'vue-router' 

const requireNoAuth = (to, from, next) => {
  const storedEmail = localStorage.getItem('userEmail');
  if (storedEmail) {
    next({ name: 'homePage' });
  } else {
    next();
  }
};



import dashboardPage from './components/dashboard/dashboardPage.vue';
import homePage from './components/homePage/homePage.vue';
import canvasPage from './components/canvas/canvasPage.vue';
import savedDesign from './components/canvas/savedDesign.vue';
import resumeTemplate from './components/resumeTemplate/resumeTemplate.vue';
import ModernResume from './components/resumeTemplate/ModernResume.vue';
import ProfessionalResume from './components/resumeTemplate/ProfessionalResume.vue';
import MinimalistResume from  './components/resumeTemplate/MinimalistResume.vue';
import excelSheet from './components/canvas/excelSheet.vue';
import excelData from './components/canvas/excelData.vue';
import loginPage from './components/login/loginPage.vue';
import signUpPage from './components/login/signUpPage.vue'; 

//Dashboard Router-Links 
import topSection from './components/dashboard/topSection.vue';
import features from './components/dashboard/features.vue';
import featureReadyToPrint from './components/dashboard/featureReadyToPrint.vue';
import getStarted from './components/dashboard/getStarted.vue';


const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: dashboardPage,
      
  },
 {
    path: '/home',
    name: 'homePage',
    component: homePage,
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
    path: '/excel',
    name: 'excelData',
    component:  excelData,
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
    path: '/login',
    name: 'loginPage',
    component: loginPage,
  beforeEnter: requireNoAuth,
  }, 
    {
    path: '/signup',
    name: 'signUpPage', 
    component: signUpPage,
  }, 


  
  //dashboard Paths 
  {
    path: '/topSection',
    name: 'topSection',
    component: topSection,
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
