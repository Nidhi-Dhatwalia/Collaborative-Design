 
import { createRouter, createWebHistory } from 'vue-router' 

 

const requireNoAuth = (to, from, next) => {
  const storedEmail = sessionStorage.getItem('userEmail');
  if (storedEmail) {
    next({ name: 'homePage' }); // If already logged in, redirect to home page
  } else {
    next();
  }
};



import dashboardPage from './components/dashboard/dashboardPage.vue';
import homePage from './components/homePage/homePage.vue';

//Resume Router-Links
import resumeTemplate from './components/resumeTemplate/resumeTemplate.vue';
import ModernResume from './components/resumeTemplate/ModernResume.vue';
import ProfessionalResume from './components/resumeTemplate/ProfessionalResume.vue';
import MinimalistResume from  './components/resumeTemplate/MinimalistResume.vue';

//Excel Router-Links
import excelSheet from './components/canvas/excelSheet.vue';
import excelData from './components/canvas/excelData.vue';

//Authentication Router-Links
import loginPage from './components/login/loginPage.vue';
import signUpPage from './components/login/signUpPage.vue'; 

//Dashboard Router-Links 
import topSection from './components/dashboard/topSection.vue';
import features from './components/dashboard/features.vue';
import featureReady from './components/dashboard/featureReady.vue';
import getStarted from './components/dashboard/getStarted.vue';


//Canvas Roter-Links
import canvasPage from './components/canvas/canvasPage.vue'; 
import savedDesign from './components/canvas/savedDesign.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: dashboardPage,
    beforeEnter: requireNoAuth,
  },
 {
    path: '/home',
    name: 'homePage',
    component: homePage, 
  },

//canvas Paths 
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
  

  //Resume Paths 
  {
    path: '/resume',
    name: 'resumeTemplate',
    component: resumeTemplate,
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

  // Excel-Sheet Paths
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
  

  //Authentication Paths 
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
    name: 'featureReady',
    component: featureReady,
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
