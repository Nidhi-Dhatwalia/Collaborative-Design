<template>
  <div class="features-container">
   
    <div class="content-wrapper">
 
      <v-img
        src="src/assets/team_collaboration.jpg"
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
