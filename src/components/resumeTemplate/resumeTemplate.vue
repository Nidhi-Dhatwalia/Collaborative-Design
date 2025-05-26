<template>
  <div class="container">
 
    <div class="sidebar">
      <div class="nav-links">
        <router-link to="/home" class="nav-link">
          <v-btn class="template-btn" elevation="2" rounded size="large">
            <v-icon left>mdi-home</v-icon>
            Home
          </v-btn>
        </router-link>

        <div class="logo">
          <h2>Select a Template</h2>
        </div>

        <router-link to="/modernResume" class="nav-link">
          <v-btn class="template-btn" elevation="2" rounded size="large">
            Modern
          </v-btn>
        </router-link>
        <router-link to="/professional" class="nav-link">
          <v-btn class="template-btn" elevation="2" rounded size="large">
            Professional
          </v-btn>
        </router-link>
        <router-link to="/minimalist" class="nav-link">
          <v-btn class="template-btn" elevation="2" rounded size="large">
            Minimalist
          </v-btn>
        </router-link>
      </div>
    </div>

 
    <div class="main-content">
      <div class="resume-editor">
        <h1>My Resume</h1>
        <div class="template-images">
          <img src="@/assets/resume_template_1.jpg" alt="Template 1" class="template-image" />
          <img src="@/assets/resume_template_2.jpg" alt="Template 2" class="template-image" />
          <img src="@/assets/resume_template_3.jpg" alt="Template 3" class="template-image" />
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
  flex-direction: row;
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
  z-index: 100;
}

.logo h2 {
  font-size: 22px;
  margin-bottom: 30px;
  color: #ecf0f1;
  text-align: center;
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
  font-size: 16px;
  width: 100%;
  border-radius: 25px;
  text-transform: none;
  transition: background-color 0.3s ease;
}

.template-btn:hover {
  background-color: #45a049;
}

.main-content {
  margin-left: 250px;
  flex: 1;
  padding: 40px 20px;
  background-color: #f4f7fc;
  height: 100vh;
  overflow-y: auto;
}

.resume-editor {
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f4f7fc;
  border-radius: 15px;
  padding: 30px;
}

h1 {
  text-align: center;
  font-size: 30px;
  color: #34495e;
  margin-bottom: 30px;
}

.template-images {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.template-image {
  width: 280px;
  height: 380px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.template-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
 
@media (max-width: 1024px) {
  .sidebar {
    width: 200px;
    padding: 20px;
  }

  .main-content {
    margin-left: 200px;
    padding: 30px 15px;
  }

  .template-image {
    width: 220px;
    height: 320px;
  }
   .resume-editor {
    max-width: 900px;
    padding: 25px;
  }
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .main-content {
    margin-left: 0;
    padding: 20px 10px;
    height: auto;
  }

  .template-image {
    width: 180px;
    height: 260px;
  }

  .logo h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .nav-links {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 10px;
  }

  .template-btn {
    font-size: 14px;
    padding: 6px 12px;
  }

  .resume-editor {
    max-width: 100%;
    padding: 20px 15px;
  }
}

@media (max-width: 480px) {
  .template-image {
    width: 150px;
    height: 220px;
  }

  h1 {
    font-size: 24px;
  }

  .template-btn {
    font-size: 12px;
  }

  .logo h2 {
    font-size: 16px;
  }

   .resume-editor {
    padding: 15px 10px;
  }
}
</style>
