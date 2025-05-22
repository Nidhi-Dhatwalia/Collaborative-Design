<template>
  <div class="features-container">
    <div class="content-wrapper">
      <v-img
        :src="remoteCollaborationImg"
        alt="Team Collaboration"
        max-height="400"
        contain
        class="feature-image"
      ></v-img>

      <div class="text-section">
        <h2 class="title">Design with Others</h2>
        <p class="description">
          Invite friends and family to design with you, or set your whole team up to work together.
          Our collaboration features let you comment and work in real-time on Presentations, Whiteboards,
          Docs, Videos, or that birthday party planning.
        </p>

        <div class="button-group">
          <v-btn color="primary" class="btn">Start Designing</v-btn>
          <v-btn color="secondary" class="btn">Start Free Teams Trial</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import remoteCollaborationImg from '@/assets/remote-collaboration.jpg'
</script>

<style scoped>
.features-container { 
  padding: 80px;
}

.content-wrapper {
  display: flex; 
  align-items: center;  
  justify-content: space-between;
  gap: 40px;  
}

.feature-image {
  width: 60%;   
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.text-section { 
  margin-top: 20px;
  padding: 2rem; 
  border-radius: 8px; 
  max-width: 600px;
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

/* Responsive */

@media (max-width: 960px) {
  .features-container {
    padding: 40px 20px;
  }

  .content-wrapper {
    flex-direction: column;
    gap: 30px;
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
