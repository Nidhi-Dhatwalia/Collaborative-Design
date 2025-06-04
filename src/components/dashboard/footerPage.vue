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
              class="footer-list-item"
            >
              {{ item }}
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <v-divider class="my-4" />
      
      <v-row class="footer-bottom" justify="center">
        <v-col class="text-center" cols="12">
          <p>English (India) | © 2025 All Rights Reserved, Canva®</p>
          <v-row justify="center" class="social-links"> 
            <v-icon size="x-large"    href="#">mdi-facebook</v-icon> 
            <v-icon  size="x-large"   href="#"> mdi-twitter</v-icon> 
            <v-icon  size="x-large"   href="#"> mdi-pinterest</v-icon> 
            <v-icon  size="x-large"    href="#"> mdi-instagram</v-icon> 
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'footerPage',
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
  padding: 3rem 1rem;
}

.sub-header {
  font-weight: bold;
  font-size: 1.5rem;
}

.footer-list-item {
  padding: 0.2rem 0;
  font-size: 1rem;
  color: #333;
}

/* Footer bottom */
.footer-bottom {
  font-size: 0.9rem;
  line-height: 4.5;
  margin-top: 1rem;
}

.footer-bottom p {
  margin-bottom: 0.5rem;
  color: #555;
}

.footer-bottom .v-btn {
  color: #000000;
  min-width: 100px;
  margin: 0 0.25rem;
  font-weight: 500;
  white-space: nowrap;
}

.footer-bottom .v-btn:hover {
  text-decoration: underline;
}

/* Social icons */
.social-links .v-btn { 
  margin: 0 0.1rem;
}

/* Responsive */

@media (max-width: 960px) {
  .footer {
    padding: 2rem 1rem;
  }

  .sub-header {
    font-size: 1.3rem;
  }

  .footer-list-item {
    font-size: 0.95rem;
  }

  .footer-bottom {
    line-height: 2.5;
  }

  .footer-bottom p {
    font-size: 0.85rem;
  }

  .footer-bottom .v-btn {
    min-width: 90px;
    font-size: 0.85rem;
    margin: 0 0.2rem;
  }

  .social-links {
    margin-top: 0.5rem;
  }
}

@media (max-width: 600px) {
  .footer {
    padding: 1.5rem 0.5rem;
  }

  .content-wrapper {
    flex-direction: column;
  }

  .sub-header {
    font-size: 1.1rem;
    text-align: center;
  }

  .v-row > .v-col {
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .footer-list-item {
    font-size: 0.9rem;
  }

  .footer-bottom {
    font-size: 0.8rem;
    line-height: 2;
  }

  .footer-bottom p {
    margin-bottom: 0.3rem;
  }

  .footer-bottom .v-btn {
    min-width: 80px;
    font-size: 0.8rem;
    margin: 0 0.15rem;
  }

  .social-links .v-btn {
    min-width: 36px;
    margin: 0 0.05rem;
  }
}
</style>
