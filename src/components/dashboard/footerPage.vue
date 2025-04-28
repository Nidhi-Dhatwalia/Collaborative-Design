<template>
  <footer class="footer" >
    <div class="footer-content">
      <div class="footer-section">
        <h3>Features</h3>
        <ul>
          <li>Curved text generator</li>
          <li>Photo effects</li>
          <li>Image enhancer</li>
          <li>Add frames to photos</li>
          <li>Add text to photos</li>
          <li>Online video recorder</li>
          <li>Video trimmer</li>
          <li>Convert videos to MP4</li>
          <li>See more features</li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Explore</h3>
        <ul>
          <li>Design ideas</li>
          <li>Custom prints</li>
          <li>Font pairing</li>
          <li>Colours</li>
          <li>Colour wheel</li>
          <li>Colour palette generator</li>
          <li>Blog</li>
          <li>Apps</li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Community</h3>
        <ul>
          <li>Online communities</li>
          <li>Creators</li>
          <li>Canva Represents Fund</li>
          <li>Developers</li>
          <li>Partnerships</li>
          <li>Affiliates program</li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Download</h3>
        <ul>
          <li>iOS</li>
          <li>Android</li>
          <li>Windows</li>
          <li>Mac</li>
        </ul>
      </div>
 
    </div>

    <div class="footer-bottom">
      <p>English (India) | © 2025 All Rights Reserved, Canva®</p>
      <p>
        <a href="#">Privacy policy</a> | 
        <a href="#">Terms</a> |
        <a href="#">Facebook</a> |
        <a href="#">Twitter</a> |
        <a href="#">Pinterest</a> |
        <a href="#">Instagram</a>
      </p>
      <p style="font-size: 12px;">
        Salesforce.com, inc. is a trademark, and is used here with permission. Quotes are taken from a recent case study.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #ffffff;
  color: #000000;
  padding: 3rem 2rem;
  font-family: Arial, sans-serif; 
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.footer-section {
  flex: 1 1 200px;
  margin: 1rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  border-bottom: 1px solid #555;
  padding-bottom: 5px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.footer-bottom {
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.5;
}

.footer-bottom a {
  color: #ccc;
  margin: 0 5px;
  text-decoration: none;
}

.footer-bottom a:hover {
  text-decoration: underline;
}
</style>
