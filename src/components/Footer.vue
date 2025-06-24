<template>
  <footer class="main-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Istanbul Tourist Pass</h3>
          <p>Discover Istanbul's most iconic attractions with our comprehensive tourist pass. Save time and money while exploring the city's rich history and culture.</p>
        </div>
        
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><router-link to="/istanbul-pass">Istanbul Pass</router-link></li>
            <li><router-link to="/attractions">Attractions</router-link></li>
            <li><router-link to="/tours">Tours</router-link></li>
            <li><router-link to="/faqs">FAQs</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Support</h3>
          <ul>
            <li><router-link to="/contact">Contact Us</router-link></li>
            <li><a href="https://myistanbul.istanbultouristpass.com/" target="_blank">Manage Your Pass</a></li>
            <li><router-link to="/become-partner">Become a Partner</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Connect With Us</h3>
          <div class="social-links">
            <a href="#" class="social-link">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; {{ currentYear }} Istanbul Tourist Pass. All rights reserved.</p>
          <div class="footer-links">
            <router-link to="/privacy">Privacy Policy</router-link>
            <router-link to="/terms">Terms of Service</router-link>
            <router-link to="/cookies">Cookie Policy</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

// Computed properties
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.main-footer {
  background: #2c3e50;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: #ecf0f1;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.footer-section p {
  color: #bdc3c7;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #3498db;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #34495e;
  color: white;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #3498db;
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 1rem;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-bottom p {
  color: #bdc3c7;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #3498db;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-links {
    justify-content: center;
  }
}
</style>
