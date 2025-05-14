<template>  


  <v-footer color="white" class="footer">
    <v-container>
      <v-row>
        <v-col
          v-for="(items, section) in footerSections"
          :key="section"
          cols="12"
          md="3"
        >
          <h3 class="sub-header">{{ section }}</h3>
          <v-divider class="my-2" />
          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
            >
              {{ item }}
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <v-divider class="my-4" />
      
      <v-row class="footer-bottom">
        <v-col class="text-center" cols="12">
          <p>English (India) | © 2025 All Rights Reserved, Canva®</p>
          <v-row justify="center">
            <v-btn text href="#">Privacy policy</v-btn>
            <v-btn text href="#">Terms</v-btn>
            <v-btn text href="#"><v-icon>mdi-facebook</v-icon></v-btn>
            <v-btn text href="#"><v-icon>mdi-twitter</v-icon></v-btn>
            <v-btn text href="#"><v-icon>mdi-pinterest</v-icon></v-btn>
            <v-btn text href="#"><v-icon>mdi-instagram</v-icon></v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  data() {
    return {
      footerSections: {
        Features: [
          'Curved text generator',
          'Photo effects',
          'Image enhancer',
          'Add frames to photos',
          'Add text to photos',
          'Online video recorder',
          'Video trimmer',
          'Convert videos to MP4',
          'See more features',
        ],
        Explore: [
          'Design ideas',
          'Custom prints',
          'Font pairing',
          'Colours',
          'Colour wheel',
          'Colour palette generator',
          'Blog',
          'Apps',
        ],
        Community: [
          'Online communities',
          'Creators',
          'Canva Represents Fund',
          'Developers',
          'Partnerships',
          'Affiliates program',
        ],
        Download: ['iOS', 'Android', 'Windows', 'Mac'],
      },
    };
  },
};
</script>

<style scoped>
.footer {
  padding: 3rem 0;
}
.sub-header {
  font-weight: bold;
  font-size: 1.5rem;
}
.footer-bottom {
  font-size: 0.9rem;
  line-height: 4.5;
}
.footer-bottom .v-btn {
  color: #000000;
}
.footer-bottom .v-btn:hover {
  text-decoration: underline;
}
</style>