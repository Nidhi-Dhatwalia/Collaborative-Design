<template>
  <v-container class="custom-container" fluid>
    <div class="content-wrapper">
      <h1 class="title">
        Bring your ideas to life with an easy-to-use digital canvas. Sketch, design, 
        and collaborate seamlessly—all in one place. Start creating your masterpiece today!
      </h1>
  

      <router-link to="/login" class="router-link-btn">
        <v-btn class="start-btn" elevation="2">Get started for Free</v-btn>
      </router-link>
    </div>
  </v-container>
</template>

<script setup>
function onSubmit() {
  alert("Thanks for signing up! We'll be in touch.");
}
</script>

<style scoped>
.custom-container {
  background-color: #f0f5f9; 
  min-height: 75vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 3rem 3.5rem;
  margin-top: 60px; 
  border-radius: 18px; 
  text-rendering: optimizeLegibility; 
}

.content-wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  max-width: 700px;
  margin: 0 auto;
  padding: 0 2rem;
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: 600; 
  line-height: 1.3;
  max-width: 100%;
  color: #000000dd; 
}

 

.router-link-btn {
  max-width: 280px;
  margin: 0 auto;
  display: block;
}

.start-btn {
  color: #ffffff ;
  background-color: #2b65f0 ;
  font-weight: 700 !important;
  font-size: 1.35rem !important;
  text-transform: none !important;
  padding: 0.9rem 3.25rem !important; 
  border-radius: 30px !important; 
  cursor: pointer;
  display: flex;
  align-items: center;
}

.start-btn:hover {
  background-color: #ffffff ;
  color: #2b65f0 ; 
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .custom-container {
    min-height: auto;
    padding: 3rem 2rem 3rem;
    border-radius: 14px;
  }

  .title {
    font-size: 1.95rem;
  }

  .form__section {
    max-width: 100%;
  }

  .email__detail {
    flex-basis: 100%;
    margin-bottom: 0.8rem;
  }

  .btn-default {
    width: 100%;
    justify-content: center;
  }

  .start-btn {
    font-size: 1.25rem !important;
    padding: 0.8rem 2.75rem !important;
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .custom-container {
    min-height: auto;
    padding: 2rem 1.25rem 2.5rem;
    border-radius: 12px;
  }

  .title {
    font-size: 1.5rem;
    line-height: 1.3;
  }

  .start-btn {
    font-size: 1.15rem !important;
    padding: 0.7rem 2rem !important;
    min-width: 100%;
  }
}
</style>