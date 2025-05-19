<template>
  <div class="container">
    <!-- Sidebar Navbar -->
    <div class="sidebar">
      <div class="nav-links">
         
        <router-link to="/dashboard" class="nav-link">
          <v-btn class="template-btn" elevation="2" rounded size="large">
            <v-icon left>mdi-home</v-icon>  
          </v-btn>
        </router-link>
        
      <div class="logo">
        <h2>Select a Template</h2>
      </div>
       
        <router-link to="/modernResume" class="nav-link">
          <v-btn class="template-btn" elevation="2" rounded size="large"> Modern
          </v-btn>
        </router-link>
        <router-link to="/professional" class="nav-link">
          <v-btn class="template-btn" elevation="2" rounded size="large">  Professional
          </v-btn>
        </router-link>
        <router-link to="/minimalist" class="nav-link">
          <v-btn class="template-btn" elevation="2" rounded size="large">  Minimalist
          </v-btn>
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="resume-editor">
        <h1>My Resume</h1>
        <div class="template-images">
          <img src="@/assets/resume_template_1.jpg" alt="Template 1" class="template-image"/>
          <img src="@/assets/resume_template_2.jpg" alt="Template 2" class="template-image"/>
          <img src="@/assets/resume_template_3.jpg" alt="Template 3" class="template-image"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.sidebar {
  background-color: #2c3e50;
  color: white;
  width: 250px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
}

.logo h2 {
  font-size: 24px;
  margin-bottom: 30px;
  color: #ecf0f1;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin-top: 20px;
}

.nav-link {
  width: 100%;
}

.template-btn {
  font-size: 18px;
  margin: 0;
  transition: background-color 0.3s ease;
  border-radius: 25px; 
  width: 100%;
}

.template-btn:hover {
  background-color: #45a049;
}

.template-btn .v-btn__content {
  font-size: 18px;
}

 
.main-content {
  margin-left: 250px; 
  width: 100%;
  padding: 50px;
  background-color: #f4f7fc;
  overflow: auto;  
  height: 100vh;
}

.resume-editor { 
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f4f7fc;
  border-radius: 15px;
  padding: 30px;
  height: 90%;
}

h1 {
  text-align: center;
  font-size: 30px;
  color: #34495e;
  margin-bottom: 30px;
}

.template-images {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 30px;
  margin-top: 30px;  
  justify-content: center;  
}

.template-image {
  width: 280px;
  height: 380px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 30px;  
}

.template-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
</style>
