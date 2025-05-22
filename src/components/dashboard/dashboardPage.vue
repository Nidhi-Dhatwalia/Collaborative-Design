<template>
  <v-app>
    <v-container fluid class="home-container pa-0">
      <v-app-bar flat color="white" class="app-bar" app>
        <v-toolbar-title class="title">Collabie</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-row dense class="d-flex align-center" no-gutters>
          <v-col
            v-for="(button, index) in buttons"
            :key="index"
            cols="auto"
            class="px-1"
          >
            <router-link :to="button.route" class="no-decoration">
              <v-btn :class="button.class" small>
                {{ button.label }}
              </v-btn>
            </router-link>
          </v-col>
        </v-row>
      </v-app-bar>

      <v-container fluid class="inner-container pa-0">
        <v-sheet height="100vh" color="white" class="custom-sheet pa-4 d-flex flex-column align-center justify-center">
          <v-responsive max-width="600" aspect-ratio="16/9" class="mb-6 w-100">
            <v-img
              :src="remoteCollaboration"
              alt="Remote Collaboration"
              contain
              class="image-with-margin"
            />
          </v-responsive>

          <h1 class="custom-heading">
            Where heart meets <span class="gradient-text">art</span>.
          </h1>
          <p class="custom-subtitle mb-6">
            Collabie makes it easy to create and share professional designs.
          </p>

          <router-link to="/canvas" class="mb-6">
            <v-btn class="btn-large" color="deep-purple-accent-2" rounded>
              Start designing
            </v-btn>
          </router-link>

          <v-row justify="center" class="button-wrapper" dense>
            <v-col
              v-for="(iconButton, index) in iconButtons"
              :key="index"
              cols="6" sm="3" md="2"
              class="d-flex justify-center px-2"
            >
              <router-link :to="iconButton.route" class="button-link w-100">
                <v-btn :class="iconButton.class" :color="iconButton.color" rounded block>
                  <div class="icon-content">
                    <v-icon :class="iconButton.icon" class="icon"></v-icon>
                    <span class="label-text">{{ iconButton.label }}</span>
                  </div>
                </v-btn>
              </router-link>
            </v-col>
          </v-row>
        </v-sheet>
      </v-container>

      <plans class="mt-24" />
      <features />
      <featureReadyToPrint />
      <getStarted />
      <footerPage />
    </v-container>
  </v-app>
</template>

<script setup>
import remoteCollaboration from '@/assets/remote-collaboration.jpg'

import plans from '../dashboard/plans.vue';
import features from  '../dashboard/features.vue';
import featureReadyToPrint from  '../dashboard/featureReadyToPrint.vue';
import getStarted from '../dashboard/getStarted.vue';
import footerPage from '../dashboard/footerPage.vue';

const buttons = [
  { label: "Pricing", route: "/plans", class: "custom-btn" },
  { label: "Features", route: "/features", class: "custom-btn" },
  { label: "Our partners", route: "/feature", class: "custom-btn" },
  { label: "About us", route: "/getStarted", class: "custom-btn" },
   { label: "Sign In ", route: "/signin", class: "custom-btn" },
  { label: "Log In ", route: "/ ", class: "login-btn" }
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
  width: 100%;
  min-height: 100vh;
}

.image-with-margin {
  margin-top: 0;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.custom-heading {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin: 0 auto 1rem;
  max-width: 700px;
}


.custom-subtitle {
  font-size: 1.25rem;
  text-align: center;
  margin: 0 auto 2rem;
  max-width: 600px;
  color: #555;
}

.btn-large {
  font-size: 1.25rem;
  min-width: 200px;
}

.login-btn {
  background-color: #6200ea !important;
  color: white !important;
}

.button-wrapper {
  margin-top: 20px;
  flex-wrap: wrap;
}

.button-link {
  text-decoration: none;
}

.icon-button {
  height: 130px;
  width: 160px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; 
  color: white !important;
  font-weight: 700;
  font-size: 16px;  
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

/* Responsive */
@media (max-width: 960px) {
  .custom-heading {
    font-size: 2.25rem;
    padding: 0 12px;
  }
  .custom-subtitle {
    font-size: 1rem;
    padding: 0 12px;
  }
  .btn-large {
    min-width: 100%;
    font-size: 1.1rem;
  }
  .icon-button {
    height: 100px;
    font-size: 14px;
  }
  .icon {
    font-size: 28px;
  }
  .label-text {
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .custom-heading {
    font-size: 1.75rem;
  }
  .custom-subtitle {
    font-size: 0.9rem;
  }
  .icon-button {
    height: 90px;
    font-size: 13px;
  }
  .icon {
    font-size: 24px;
  }
  .label-text {
    font-size: 11px;
  }
}
</style>
