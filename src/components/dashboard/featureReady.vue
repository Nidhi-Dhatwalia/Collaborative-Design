<template>
  <div class="features-container">
    <div class="content-wrapper">
    
      
      <div class="text-section"> 
        <h2 class="title">Schedule and share your Designs instantly</h2>
        <p class="description">
          Design and print your own posters, invites, cards and more.
          Everything you design in Canva is ready to send to the printer, or to print from home.
        </p> 
      </div>
        
      <v-img
        :src="featureImage"
        alt="Team Collaboration"
        max-height="400"
        contain
        class="feature-image"
      ></v-img>
    </div>
  </div>
</template>

<script setup>
import featureImage from '@/assets/feature-image.jpeg'
</script>

<style scoped>
.features-container {
  padding: 0px 150px;
  background-color: #fefefe;
}

.content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center; 
  gap: 50px;
}

.feature-image {
  width: 40%;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.text-section {
  margin-top: 20px;
  padding: 2rem;
  border-radius: 8px;
  max-width: 700px;
  
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.description {
  font-size: 1.125rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.btn {
  font-size: 16px;
  text-transform: uppercase;
  border-radius: 10px;
  min-width: 140px;
}

/* Responsive styles */

@media (max-width: 960px) {
  .features-container {
    padding: 40px 20px;
  }
  
  .content-wrapper {
    flex-direction: column;
    gap: 40px;
  }

  .feature-image {
    width: 100%;
    max-height: 300px;
  }

  .text-section {
    padding: 1rem;
    max-width: 100%;
    text-align: center;
  }

  .title {
    font-size: 1.75rem;
  }

  .description {
    font-size: 1rem;
  }

  .button-group {
    justify-content: center;
  }

  .btn {
    min-width: 120px;
  }
}

@media (max-width: 600px) {
  .features-container {
    padding: 20px 15px;
  }

  .title {
    font-size: 1.5rem;
  }

  .description {
    font-size: 0.9rem;
  }

  .btn {
    font-size: 14px;
    min-width: 100px;
    padding: 10px 0;
  }
}
</style>