<template>
  <v-container class="custom-container" fluid>
    <div class="content-wrapper">
      <h1 class="title">Start Designing with Canvas</h1>

      <router-link to="/canvas">
        <v-btn class="start-btn">Get started for Free</v-btn>
      </router-link>
    </div>
  </v-container>
</template>

<style scoped>
.custom-container {
  background: linear-gradient(to right, #07b9d0, #543cf7, #7a2bea);
  color: white;
  height: 70vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;  
}

.title {
  font-family: 'Cursive', sans-serif;
  font-size: 3rem;
  margin: 0;  
}

.start-btn {
  border-radius: 30px; 
  font-size: 1.2rem; 
  text-transform: none;  
}
</style>
