<template>
  <v-app>  
    <v-container class="home-container" fluid> 
      <v-app-bar flat color="white" class="app-bar">
        <v-toolbar-title class="title">Collabie</v-toolbar-title>
        <v-spacer></v-spacer>
        
        <template v-for="(button, index) in buttons" :key="index">
          <router-link :to="button.route">
            <v-btn :class="button.class">{{ button.label }}</v-btn>
          </router-link>
        </template>
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
          <router-link to="/canvas">
            <v-btn class="btn-large" color="deep-purple-accent-2" rounded>
              Start designing
            </v-btn>
          </router-link>

          <div class="button-wrapper">
            <template v-for="(iconButton, index) in iconButtons" :key="index">
              <router-link :to="iconButton.route" class="button-link">
                <v-btn :class="iconButton.class" :color="iconButton.color" rounded>
                  <div class="icon-content">
                    <v-icon :class="iconButton.icon" class="icon"></v-icon>
                    <span class="label-text">{{ iconButton.label }}</span>
                  </div>
                </v-btn>
              </router-link>
            </template>
          </div>
        </v-sheet>
      </v-container>

      <plans style="margin-top: 250px;" />
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

const buttons = [
  { label: "Pricing", route: "/plans", class: "custom-btn" },
  { label: "Features", route: "/features", class: "custom-btn" },
  { label: "Our partners", route: "/feature", class: "custom-btn" },
  { label: "About us", route: "/getStarted", class: "custom-btn" },
  { label: "Get started", route: "/canvas", class: "get-started-btn" }
];

const iconButtons = [
  { label: "Resume", route: "/resume", class: "icon-button", icon: "mdi-file-document", color: "deep-purple-accent-4" },
  { label: "Whiteboard", route: "/canvas", class: "icon-button", icon: "mdi-clipboard-outline", color: "indigo darken-3" },
  { label: "Sheet", route: "/sheet", class: "icon-button", icon: "mdi-table", color: "pink darken-2" },
  { label: "More", route: "/", class: "icon-button", icon: "mdi-dots-horizontal", color: "pink darken-2" }
];
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
  flex-wrap: nowrap;
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

.custom-btn {
  color: black;
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
