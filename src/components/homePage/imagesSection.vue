<template>
  <v-app>
    <v-main>
      <v-container   fluid>
        
        <h2 class="text-center mb-8 text-primary font-weight-bold">
          Teamwork & Canvas Gallery
        </h2>
 
        <v-sheet class="pa-4 rounded-lg gallery-bg mb-0 ">
          <v-row
            justify="center"
            align="center"
            dense
            style="gap: 22px;"
          >
            <v-col
              v-for="(img, i) in images"
              :key="i"
              cols="auto"
              style="max-width: 260px;"
            >
              <v-img
                :src="img"
                alt="Image"
                height="160"
                width="220"
                class="rounded"
                contain
              />
            </v-col>
          </v-row>
        </v-sheet>

      </v-container>
    </v-main>
  </v-app>
</template>


<script setup>
const images = [
  new URL('@/assets/images/image1.jpg', import.meta.url).href,
  new URL('@/assets/images/image2.jpg', import.meta.url).href,
  new URL('@/assets/images/image3.jpg', import.meta.url).href,
  new URL('@/assets/images/image4.jpg', import.meta.url).href,
  new URL('@/assets/images/image5.jpg', import.meta.url).href,
  new URL('@/assets/images/image6.jpg', import.meta.url).href, 
];
</script>

<style scoped>
.text-center {
  text-align: center;
}
.mb-8 {
  margin-bottom: 1rem;
}
.mb-12 {
  margin-bottom: 1rem;
}
.rounded {
  border-radius: 12px;
  transition: transform 0.3s ease;
}
.rounded:hover {
  transform: scale(1.1);
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
.gallery-bg { 
  background-color: #f5f7fa;  
}
</style>

