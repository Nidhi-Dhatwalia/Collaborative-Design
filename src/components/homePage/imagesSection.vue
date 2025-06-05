<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <h2 class="heading">
          Teamwork & Canvas Gallery
        </h2>

        <v-sheet class="gallery-container">
          <v-carousel
            cycle
            height="500"
            hide-delimiters
            show-arrows-on-hover
            class="carousel"
          >
            <v-carousel-item
              v-for="(img, i) in images"
              :key="i"
            >
              <v-img
                :src="img"
                alt="Image"
                cover
                class="carousel-img"
              />
            </v-carousel-item>
          </v-carousel>
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
  new URL('@/assets/images/image5.jpg', import.meta.url).href,
];
</script>

<style scoped>

.heading {
  text-align: center;
  margin: 2rem 0 1.5rem;
  color: #246a99; 
  font-weight: bold;
  font-size: 32px;
}

 
.carousel {
  overflow: hidden;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
