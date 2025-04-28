<template>
    <h2> A perfect fit for everyone </h2>
  <div class="container">
    <div class="main-container"> 
      <p class="header">For One Person</p>
      <h4 class="title">Canva Free</h4>
      <p class="description">For designing or working on anything.</p> <br>
      <v-btn class="cta-button">Get Canva Free</v-btn>
    </div>
    <div class="main-container"> 
      <p class="header">For One Person</p>
      <h4 class="title">Canva Pro</h4>
      <p class="description">For growing your brand or passion project with premium features.</p>
      <v-btn class="cta-button">Start Free Pro trial</v-btn>
    </div>
    <div class="main-container"> 
      <p class="header">For your team</p>
      <h4 class="title">Canva Teams</h4>
      <p class="description">For teams to create together with premium workplace tools and workflows.</p>
      <v-btn class="cta-button">Start Free Teams trial</v-btn>
    </div>
    <div class="main-container"> 
      <p class="header">For your organisation</p>
      <h4 class="title">Canva Enterprise</h4>
      <p class="description">For organisations to unite and manage their teams, brands, and designs</p>
      <v-btn class="cta-button">Contact Sales</v-btn>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex; 
  justify-content: space-between;
  gap: 20px;
  padding: 30px;
  margin: 20px auto;
}

.main-container {
  width: 100vw;
  max-width: 280px;
  padding: 25px;
  background-color: rgb(221, 203, 231);
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
}

 

.header {
  font-size: 18px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 10px;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: rgb(123, 68, 168);
  margin-bottom: 15px;
}

.description {
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
}

.cta-button { 
  background-color: rgb(123, 68, 168);
  color: white;
  border-radius: 8px; 
  width: 100%;
  font-size: 16px;
  text-align: center; 
  text-transform: none;   
}

.cta-button:hover {
  background-color: #a484af;
 
}

 
</style>
