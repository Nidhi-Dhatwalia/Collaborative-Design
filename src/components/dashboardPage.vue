<template>
  <v-app>
    <v-container fluid class="container">
      <v-app-bar flat color="white" class="app-bar">
        <v-toolbar-title class="title">Collabie</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn class="custom-btn">Features</v-btn>
        <v-btn class="custom-btn">Our partners</v-btn>
        <v-btn class="custom-btn">Pricing</v-btn>
        <v-btn class="custom-btn">About us</v-btn>

        <v-btn class="custom-btn" color="black">Log in</v-btn>
        <v-btn class="get-started-btn">Get started</v-btn>
      </v-app-bar>

      <v-container class="inner-container">
        <v-sheet height="100vh" color="white" class="custom-sheet">
          <v-img
            src="src/assets/remote-collaboration.jpg"
            alt="Image description"
            max-height="300"
            width="100%"
            contain
          ></v-img>

          <h1 class="custom-heading">
            Where heart meets <span class="gradient-text">art</span>.
          </h1>
          <p class="custom-subtitle">
            Collabie makes it easy to create and share professional designs.
          </p>
          <router-link to="/canvas">
            <v-btn class="btn-large" color="deep-purple-accent-2" rounded>
              Start designing
            </v-btn>
          </router-link>
        </v-sheet>
      </v-container>
    </v-container>
  </v-app>
</template>

<style scoped>
.container {
  padding: 0 !important;
}

.app-bar {
  padding: 8px 24px;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}

.custom-btn {
  padding: 8px 16px;
  font-size: 1rem;
}

.get-started-btn {
  margin-left: 16px;
  padding: 8px 16px;
}

.inner-container {
  padding-top: 10px;
}

.custom-sheet {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
}

.custom-heading {
  font-size: 2.5rem;
  line-height: 1.4;
  font-weight: bold;
  margin-bottom: 1rem;
}

.custom-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.custom-btn-large {
  padding: 8px 30px;
  font-size: 20px;
}
</style>
