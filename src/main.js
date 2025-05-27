import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css'  
import router from './router'
import Vue3ExcelEditor  from 'vue3-excel-editor'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();

let appInitialized = false;

onAuthStateChanged(auth, () => {
  if (!appInitialized) {
    appInitialized = true;
     
  }
});

createApp(App).use(vuetify).use(router).use(Vue3ExcelEditor ).mount('#app')
