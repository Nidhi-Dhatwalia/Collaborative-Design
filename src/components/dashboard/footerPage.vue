<template>
  <v-footer color="white" class="footer">
    <v-container>
      <v-row> 
        <v-col cols="12" md="3">
          <v-subheader class="sub-header">Features</v-subheader>
            <v-divider> </v-divider>
          <v-list>
            <v-list-item>Curved text generator</v-list-item>
            <v-list-item>Photo effects</v-list-item>
            <v-list-item>Image enhancer</v-list-item>
            <v-list-item>Add frames to photos</v-list-item>
            <v-list-item>Add text to photos</v-list-item>
            <v-list-item>Online video recorder</v-list-item>
            <v-list-item>Video trimmer</v-list-item>
            <v-list-item>Convert videos to MP4</v-list-item>
            <v-list-item>See more features</v-list-item>
          </v-list>
        </v-col>

        <!-- Explore Section -->
        <v-col cols="12" md="3">
          <v-subheader class="sub-header">Explore</v-subheader>
            <v-divider> </v-divider>
          <v-list>
            <v-list-item>Design ideas</v-list-item>
            <v-list-item>Custom prints</v-list-item>
            <v-list-item>Font pairing</v-list-item>
            <v-list-item>Colours</v-list-item>
            <v-list-item>Colour wheel</v-list-item>
            <v-list-item>Colour palette generator</v-list-item>
            <v-list-item>Blog</v-list-item>
            <v-list-item>Apps</v-list-item>
          </v-list>
        </v-col>

        <!-- Community Section -->
        <v-col cols="12" md="3">
          <v-subheader class="sub-header">Community</v-subheader>
            <v-divider> </v-divider>
          <v-list>
            <v-list-item>Online communities</v-list-item>
            <v-list-item>Creators</v-list-item>
            <v-list-item>Canva Represents Fund</v-list-item>
            <v-list-item>Developers</v-list-item>
            <v-list-item>Partnerships</v-list-item>
            <v-list-item>Affiliates program</v-list-item>
          </v-list>
        </v-col>

        <!-- Download Section -->
        <v-col cols="12" md="3">
          <v-subheader class="sub-header">Download</v-subheader>
          <v-divider> </v-divider>
          <v-list>
            <v-list-item>iOS</v-list-item>
            <v-list-item>Android</v-list-item>
            <v-list-item>Windows</v-list-item>
            <v-list-item>Mac</v-list-item>
          </v-list>
        </v-col>
      </v-row>

 
      <v-divider></v-divider>
      <v-row class="footer-bottom">
        <v-col class="text-center" cols="12">
          <p>English (India) | © 2025 All Rights Reserved, Canva®</p>
          <v-row justify="center">
            <v-btn text href="#">Privacy policy</v-btn>
            <v-btn text href="#">Terms</v-btn>
            <v-btn text href="#"><v-icon>mdi-facebook </v-icon></v-btn>
            <v-btn text href="#"><v-icon>mdi-twitter </v-icon></v-btn>
            <v-btn text href="#"><v-icon>mdi-pinterest </v-icon></v-btn>
            <v-btn text href="#"><v-icon>mdi-instagram </v-icon></v-btn>
          </v-row> 
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'FooterComponent',
}
</script>

<style scoped>
.footer {
  padding: 3rem 0;
}
.sub-header{
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
