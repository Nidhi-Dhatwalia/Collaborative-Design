<template>
  <v-app>
  <v-container class="home-container" fluid> 
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
        <v-sheet height="100vh" color="white" class="custom-sheet">
          <v-img
            src="src/assets/remote-collaboration.jpg"
            alt="Image description"
            max-height="400"
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

          <br />
            <router-link to="/canvas" >
            <v-btn class="btn-large" color="deep-purple-accent-2" rounded>
              Start designing
            </v-btn>
            </router-link>
           

        
          <div class="button-wrapper">
            <router-link to="/resume" class="button-link">
              <v-btn class="icon-button" color="deep-purple-accent-4" rounded>
                <div class="icon-content">
                  <v-icon class="icon">mdi-file-document</v-icon>
                  <span class="label-text">Resume</span>
                </div>
              </v-btn>
            </router-link>

            <router-link to="/canvas" class="button-link">
              <v-btn class="icon-button" color="indigo darken-3" rounded>
                <div class="icon-content">
                  <v-icon class="icon">mdi-clipboard-outline</v-icon>
                  <span class="label-text">Whiteboard</span>
                </div>
              </v-btn>
            </router-link>

              <router-link to="/sheet" class="button-link">
              <v-btn class="icon-button" color="pink darken-2" rounded>
                <div class="icon-content">
                  <v-icon class="icon">mdi-table</v-icon>
                  <span class="label-text">Sheet</span>
                </div>
              </v-btn>
              </router-link>

            <router-link to="/" class="button-link">
              <v-btn class="icon-button" color="pink darken-2" rounded>
                <div class="icon-content">
                  <v-icon class="icon">mdi-dots-horizontal</v-icon>
                  <span class="label-text">More</span>
                </div>
              </v-btn>
            </router-link>
          </div>
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
 
.home-container {
  padding: 15px;
  width: 100%;
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

 
.btn-large {
  font-size: 1.25rem;
}

.get-started-btn {
  background-color: #6200ea;
  color: white;
}

 
.button-wrapper {
  margin-top: 50px;
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.button-link {
  text-decoration: none;
}

 
.icon-button {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  color: white;
  font-weight: bold;
  text-transform: none;
  font-size: 16px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.icon-button:hover {
  transform: translateY(-5px);
}

 
.icon-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon {
  font-size: 32px;
  margin-bottom: 5px;
}

.label-text {
  font-size: 14px;
  font-weight: 500;
}
</style>  