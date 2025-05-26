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
  background: linear-gradient(to right, #5dc8d6, #6a57e7, #8444dd);
  color: white;
  height: 70vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  margin-top: 10px;
  box-sizing: border-box;
}

.content-wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
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
  padding: 0.75rem 2.5rem;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

 
@media (max-width: 768px) {
  .custom-container {
    height: 60vh;
    padding: 0 1.5rem;
  }

  .title {
    font-size: 2.2rem;
  }

  .start-btn {
    font-size: 1rem;
    padding: 0.6rem 2rem;
  }
}

@media (max-width: 480px) {
  .custom-container {
    height: 50vh;
    padding: 0 1rem;
  }

  .title {
    font-size: 1.8rem;
  }

  .start-btn {
    font-size: 0.9rem;
    padding: 0.5rem 1.5rem;
  }
}
</style>
