<template>
  <v-app class="gradient-bg">
 
    <v-app-bar color="white" flat >
      <v-toolbar-title class="text-primary font-weight-bold "> 
        Team<span class="font-weight-regular">work</span>
      </v-toolbar-title>

      <v-spacer />

      <v-row dense class="d-flex align-center">
        <v-col
          v-for="(button, index) in buttons"
          :key="index"
          cols="auto" 
        >
          <router-link :to="button.route" class="no-underline">
            <v-btn :class="button.class" small text>
              {{ button.label }}
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-app-bar>

 
  <v-container class="py-12 mt-13" >
  <v-row align="center" justify="center" style="min-height: 250px;">
    <v-col cols="12" md="6" class="text-center">
      <h2>
        <span class="text-primary font-weight-bold mt-8">Teamwork</span> – the best way to work together.
      </h2>
      <p class="mt-4 gradient-text" >
        What Will you design today?
      </p>
    </v-col>
  </v-row>
</v-container>

  
    <v-container class="mt-6">
      <v-row dense justify="center" align="center" class="gap-4">
        <v-col
          v-for="(iconBtn, index) in iconButtons"
          :key="index"
          cols="auto"
          class="text-center icon-col"
        >
          <router-link :to="iconBtn.route" class="no-underline">
            <v-btn
              class="icon-button"
              :color="iconBtn.color"
              icon
              dark
              elevation="6"
              size="64"
              rounded
            >
              <v-icon size="32">{{ iconBtn.icon }}</v-icon>
            </v-btn>
            <div class="mt-2 font-weight-medium text-body-2 text-center icon-label">
              {{ iconBtn.label }}
            </div>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </v-app>

  <imageSection />
  <getStarted />
</template>



<script setup>
import imageSection from "@/components/homePage/imagesSection.vue";
import getStarted from "@/components/dashboard/getStarted.vue";

const buttons = [
  { label: "Features", route: "/features", class: "custom-btn" },
  { label: "Our partners", route: "/feature", class: "custom-btn" },
  { label: "About us", route: "/getStarted", class: "custom-btn" },
  { label: "Log Out", route: "/", class: "login-btn", action:logoutUser },
];

const iconButtons = [
  { label: "Resume", route: "/resume", class: "icon-button", icon: "mdi-account-box", color: "deep-purple accent-4" },
  { label: "Whiteboard", route: "/canvas", class: "icon-button", icon: "mdi-clipboard-outline", color: "indigo darken-3" },
  { label: "Sheet", route: "/sheet", class: "icon-button", icon: "mdi-file-excel", color: "pink darken-2" },
  { label: "Canvas Data ", route: "/save", class: "icon-button", icon: "mdi-note-text", color: "secondary" },
   { label: "Excel Data ", route: "/excel", class: "icon-button", icon: "mdi-table-edit", color: "secondary" },
  { label: "More", route: "/", class: "icon-button", icon: "mdi-dots-horizontal", color: "pink darken-2" }
];


function logoutUser() { 
  localStorage.removeItem('isLoggedIn'); 
  router.push({ name: 'loginPage' });
}
</script>



<style scoped> 
 
.custom-btn {
  text-transform: none;
  font-weight: 600;
  color: #2d7cc7;
  transition: color 0.3s ease, text-decoration 0.3s ease;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
}

.custom-btn:hover {
  color: #1a237e;
  text-decoration: underline;
}

.login-btn {
  text-transform: none;
  font-weight: 600;
  background-color: #2d7cc7;
  color: #ffffff;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #303f9f;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(48, 63, 159, 0.4);
}

 
.icon-col {
  margin: 0 12px; 
  display: flex;
  flex-direction: column;
  align-items: center;
}

 
.icon-button {
  background-color: transparent;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer; 
  border: 2px solid transparent;
}

.icon-button:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: #1a237e;  
}

 
.v-icon {
  transition: color 0.3s ease;
}

  .icon-label {
  color: #424242;
  text-transform: capitalize;
  font-weight: 500;
  margin-top: 8px;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  user-select: none;
}

.icon-button:hover + .icon-label {
  color: #1a237e;
}

 
h2 {
  font-weight: 700;
  font-size: 2.25rem;
  line-height: 1.2;
  color: #212121;
  margin-bottom: 12px;
}

h2 .text-primary {
  color: #3f51b5;
}

.gradient-text { 
   font-weight: 600; 
  font-size: 28px;
  color: #2d7cc7;
}

 
p {
  font-size: 1.125rem;
  color: #616161;
  line-height: 1.6;
  margin-top: 12px;
}

 
.v-container.py-12 {
  padding-top: 3rem !important;
  padding-bottom: 3rem !important;
}
 
.mt-13 {
  margin-top: 52px;
}

 
@media (max-width: 960px) {
  h2 {
    font-size: 1.75rem;
  }
  p {
    font-size: 1rem;
  }
  .icon-button {
    width: 56px;
    height: 56px;
  }
  .icon-label {
    font-size: 0.8rem;
  }
}

</style>
