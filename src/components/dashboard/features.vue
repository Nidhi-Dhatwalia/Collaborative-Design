<template>
  <div class="support__section">
    <v-container>
      <v-row>
        <!-- Left Side: Image -->
        <v-col cols="12" md="6">
          <v-img
            :src="supportImage"
            alt="support-hero"
            height="582"
            width="1000"
            class="support__image"
            contain
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
          class="support__detail d-flex flex-column justify-center align-center"
        >
          <div class="text-center px-4">
            <v-rating :model-value="5" color="yellow-darken-3"></v-rating>
            <h3 class="support__title">
              Our Support Heroes Are Here For You 24/7/365 Via Email
            </h3>
            <p class="support__description">
              24/7 support, because creativity doesn’t wait.
               Whether it’s syncing issues or tool confusion, 
               we’re one email away—every single day of the year.
            </p>
            <a class="btn-link" href="#">
              Send us an email
              <i class="bi bi-arrow-right right-arrow-icon"></i>
            </a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import supportImage from "@/assets/images/support_image.jpeg";
</script>

<style scoped>
.support__section{
  padding: 0px 100px;
}
.rating__star {
  color: var(--yellow);
  font-size: 32px;
  margin-bottom: 15px;
  list-style: none;
  padding: 0;
}

.rating__star li {
  margin-right: 6px;
}

.support__title {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 15px;
}

.support__description {
  font-size: 18px; 
  margin-bottom: 20px;
}

.btn-link {
  font-weight: 600;
  font-size: 16px;
  color: #2b65f0;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-link:hover {
  color: #102768;
}

.support__image {
  border-radius: 10px;
}
</style>