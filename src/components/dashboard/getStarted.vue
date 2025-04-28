<template>
  <div class="container"> 
    <h1>Start Designing with Canvas</h1>
    <div claas="button"> 
    <router-link to="/canvas">
    <v-btn > Get started for Free </v-btn>
    </router-link>
    </div>
  </div>
</template>

<style scoped>
.container {
  background: linear-gradient(to right, #07b9d0, #543cf7, #7a2bea);
  color: white;
  height: 70vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.container h1 {
  font-family: 'Cursive' ;
  font-size: 3rem;
}

.button{
    border-radius: 5px; 
}
</style>
