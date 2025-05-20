<template>
  <div class="features-container">
   
    <div class="content-wrapper">
 
      <div class="text-section">
        <h2 class="title">Ready-to-print designs</h2>
        <p class="description">
        Design and print your own posters, invites, cards and more.
         Everything you design in Canva is ready to send to the printer, or to print from home.
        </p>
        <div class="button-group">
          <v-btn color="primary" class="btn">Start Designing</v-btn>
          <v-btn color="secondary" class="btn">Browse Printables </v-btn>
        </div>
      </div>
      
      <v-img
        src="@/assets/ready-to-print.jpg"
        alt="Team Collaboration"
        max-height="400"
         
        contain
        class="feature-image" 
      ></v-img>
    </div>

    
  </div>
</template>

<style scoped>
.features-container { 
  padding: 80px ;
}

.content-wrapper {
  display: flex; 
  align-items: center;  
  justify-content:space-between;
  gap: 90px;  
}

.feature-image {
  width: 60%;   
}

.text-section { 
  margin-top: 20px;
  padding: 2rem; 
  border-radius: 8px; 
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
}

.btn {
  font-size: 16px;
  text-transform: uppercase; 
  border-radius: 10px;
}
 
 
</style>
