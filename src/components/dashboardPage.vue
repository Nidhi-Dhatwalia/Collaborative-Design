<template>
  <v-app>
    <v-container fluid class="container">
      <v-app-bar flat color="white" class="app-bar">
        <v-toolbar-title class="title">Collabie</v-toolbar-title>
        <v-spacer></v-spacer>
        
        <v-btn class="custom-btn">Pricing</v-btn>
        <v-btn class="custom-btn">Features</v-btn>
        <v-btn class="custom-btn">Our partners</v-btn>
        <v-btn class="custom-btn">About us</v-btn>
        
        <v-btn class="custom-btn" color="black">Log in</v-btn>
        <router-link to="/canvas">
          <v-btn class="get-started-btn">Get started</v-btn>
        </router-link>
      </v-app-bar>

       <v-container fluid class="inner-container">
        <v-sheet height="70vh" color="white" class="custom-sheet">
          <v-img
            src="src/assets/remote-collaboration.jpg"
            alt="Image description"
            max-height="300"
            width="100%"
            contain
            class="image-with-margin"
          ></v-img>

          <h1 class="custom-heading">
            Where heart meets <span class="gradient-text">art</span>.
          </h1>
          <p class="custom-subtitle">
            Collabie makes it easy to create and share professional designs.
          </p>
            <br>
          <router-link to="/canvas">
            <v-btn class="btn-large" color="deep-purple-accent-2" rounded>
              Start designing
            </v-btn>
          </router-link>
        </v-sheet>
      </v-container>

      
        <plans /> 
        
        <features />
     
     <featureReadyToPrint />
     <getStarted />
     <footerPage />
    </v-container>
  </v-app>
</template>

<script setup>
import plans from '../components/dashboard/plans.vue';
import features from '../components/dashboard/features.vue';
import featureReadyToPrint from '../components/dashboard/featureReadyToPrint.vue';
import getStarted from '../components/dashboard/getStarted.vue';
import footerPage from './dashboard/footerPage.vue';

</script>

<style scoped>
.container {
  width: 100vw;
  padding: 15px ;
}

.inner-container{
  padding: 20px;
  margin: 20px; 
}
.image-with-margin {
  margin-top: 30px;
}

.custom-heading {
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}

.custom-subtitle {
  font-size: 1.25rem;
  text-align: center;
  margin-top: 10px;
  color: #555;
}

.plans-container,
.features-container {
  margin-top: 20px;
}

.btn-large {
  font-size: 1.25rem; 
}

.get-started-btn {
  background-color: #6200ea;
  color: white;
}

.v-container {
  padding-left: 0;
  padding-right: 0;
}
</style>
