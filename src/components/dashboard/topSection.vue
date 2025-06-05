<template>
  <v-app>
    <v-app-bar color="white" flat>
      <v-toolbar-title class="text-black font-weight-bold ">
        Colla<span class="font-weight-regular">bie</span>
      </v-toolbar-title>

      <v-spacer />
      <v-row dense class="d-flex align-center">
        <v-col
          v-for="(button, index) in buttons"
          :key="index"
          cols="auto"
        >
          <router-link :to="button.route">
            <v-btn :class="button.class" small>
              {{ button.label }}
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-container class="py-10 mt-14">
      <v-row align="center">
        <v-col cols="12" md="6">
          <h2>
            <span style="color: black; font-weight: bold;">Colllabie</span> – the best way to work together.
          </h2>
          <p class="mt-4">
            Get more and better results by working together. Explore Video Calls, Instant Messaging,
            Screensharing and much more. Teamwork was never easier!
          </p>
          <div class="mt-6">
            <v-btn class="btn-action" >Take a look to our Product Video</v-btn>
          <router-link to="/login">  <v-btn outlined class="start-btn">Start Designing</v-btn> </router-link>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <v-img
            :src="collaborationImage"
            alt="Collaboration Image"
            max-height="400"
            contain
          />
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid class="py-10" style="background-color: white;">
      <h2> What you can do  ?</h2> <br>
      <v-row justify="center" class="text-center text-black" no-gutters>
        <div class="feature-div">
          <v-icon size="40"  class="feature-icon">mdi-lock</v-icon>
          <h4 class="mt-3">End-To-End Encryption</h4>
          <p>Your safety is our first priority.</p>
        </div>
        <div class="feature-div">
          <v-icon size="40" class="feature-icon">mdi-earth</v-icon>
          <h4 class="mt-3">Worldwide Connection</h4>
          <p>You can join from anywhere you want no matter which country you live.</p>
        </div>
        <div class="feature-div">
          <v-icon size="40"  class="feature-icon">mdi-monitor-share</v-icon>
          <h4 class="mt-3">Screen Control</h4>
          <p>You can control the screen of the person who is sharing their screen.</p>
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import collaborationImage from '@/assets/teamwork-illustration.jpg';

const buttons = [ 
  { label: "Features", route: "/features", class: "custom-btn" },
  { label: "Our partners", route: "/feature", class: "custom-btn" },
  { label: "About us", route: "/getStarted", class: "custom-btn" },
  { label: "Sign Up ", route: "/signUp", class: "custom-btn" }, 
  { label: "Log In ", route: "/login", class: "login-btn" },
];
</script>

<style scoped>
.custom-btn {
  color: #000000;
}

.login-btn {
  border: 1px solid  #2b65f0;
  background-color: #ffffff;
  color: #2b65f0;
}

.login-btn:hover{
  background-color: #2b65f0;
  color:#ffffff;
}

.feature-div {
  flex: 0 0 30%;
  max-width: 30%;
  background-color: #f0f5f9;
  padding: 30px 24px;
  margin: 0 10px;
  border-radius: 12px; 
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 280px;
}

 

.feature-icon {
  margin-bottom: 16px;
  background-color: #2b65f0;
  color: #ffffff;
  padding:28px;
  border-radius: 12px;
}

.feature-div h4 {
  color: #000000;
  margin: 0 0 12px 0;
}

.feature-div p {
  color: #333333;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
}

h4 {
  font-weight: bold;
}

.btn-action {
  background-color: #2b65f0;
  color: #ffffff; 
  transition: color 0.3s ease;
  margin-right: 15px;
}

.btn-action:hover {
  background-color: white;
  color: #2b65f0;
  cursor: pointer;
}

.start-btn{
  background-color: white;
  color: #2b65f0; 
  transition: color 0.3s ease;
}

.start-btn:hover{
background-color: #2b65f0;
color: white;
}
</style>