<template>
  <v-app> 
      <top-section /> 
      <features />
      <featureReadyToPrint />
      <getStarted />
      <footerPage />
  
  </v-app>
</template>

<script setup> 
import topSection from '../dashboard/topSection.vue'; 
import features from  '../dashboard/features.vue';
import featureReadyToPrint from  './featureReady.vue';
import getStarted from '../dashboard/getStarted.vue';
import footerPage from '../dashboard/footerPage.vue';
  </script>