<template>
  <footer class="main-footer">
    <div class="container">
      <div class="footer-content five-cols">
        <!-- 1. Sütun: Language, Currency, Connect With Us -->
        <div class="footer-section">
          <h3>Language</h3>
          <LanguageSwitcher />
          <h3 class="currency-label">Currency</h3>
          <div class="currency-wrap">
            <CurrencySwitcher />
          </div>
          <div class="footer-social-row left-align">
            <h3>Connect With Us</h3>
            <div class="social-links">
              <a href="https://www.facebook.com/searchyourtour" target="_blank" rel="noopener noreferrer" class="social-link"><i class="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com/searchyourtour" target="_blank" rel="noopener noreferrer" class="social-link"><i class="fab fa-twitter"></i></a>
              <a href="https://www.instagram.com/searchyourtour" target="_blank" rel="noopener noreferrer" class="social-link"><i class="fab fa-instagram"></i></a>
              <a href="https://www.youtube.com/searchyourtour" target="_blank" rel="noopener noreferrer" class="social-link"><i class="fab fa-youtube"></i></a>
              <a href="https://wa.me/905555555555" target="_blank" rel="noopener noreferrer" class="social-link"><i class="fab fa-whatsapp"></i></a>
              <a href="mailto:info@searchyourtour.com" class="social-link"><i class="fas fa-envelope"></i></a>
            </div>
          </div>
        </div>
        <!-- 2. Sütun: Mobile -->
        <div class="footer-section">
          <h3>Mobile</h3>
          <a href="#" class="app-btn google-play dark-bg">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
          </a>
          <a href="#" class="app-btn app-store dark-bg">
            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" />
          </a>
        </div>
        <!-- 3. Sütun: Support -->
        <div class="footer-section">
          <h3>Support</h3>
          <ul>
            <li><router-link to="/contact">Contact Us</router-link></li>
            <li><router-link to="/faqs">Frequently Asked Questions</router-link></li>
            <li><router-link to="/security/terms-conditions">General Terms and Conditions</router-link></li>
            <li><router-link to="/security/privacy-policy">Privacy Policy</router-link></li>
            <li><router-link to="/security/cookie-policy">Cookies and Marketing Preferences</router-link></li>
            <li><a href="https://myistanbul.istanbultouristpass.com/" target="_blank">Manage Your Pass</a></li>
            <li><router-link to="/become-partner">Become a Partner</router-link></li>
            <li><router-link to="/my-listing">Manage Your Listings</router-link></li>
            <li><a href="#">Information according to the Digital Services Act</a></li>
          </ul>
        </div>
        <!-- 4. Sütun: Company -->
        <div class="footer-section">
          <h3>Company</h3>
          <ul>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/attractions">Istanbul Attractions</router-link></li>
            <li><router-link to="/tours">Guided Tours</router-link></li>
            <li><router-link to="/istanbul-pass">SearchYourTour Pass</router-link></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Gift Cards</a></li>
            <li><a href="#">Explorer</a></li>
          </ul>
        </div>
        <!-- 5. Sütun: Work With Us & Payment -->
        <div class="footer-section right-section">
          <h3>Work With Us</h3>
          <ul>
            <li><a href="#">As a Supply Partner</a></li>
            <li><a href="#">As a Content Creator</a></li>
            <li><a href="#">As an Affiliate Partner</a></li>
          </ul>
          <h3>Ways You Can Pay</h3>
          <div class="payment-icons">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/PayPal_logo.svg" alt="PayPal" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
          </div>
        </div>
      </div>
      <!-- Copyright -->
      <div class="footer-bottom-content">
        <p>&copy; 2008 — {{ currentYear }} SearchYourTour. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.main-footer {
  background: #1a2b43;
  color: #fff;
  padding: 0;
  font-size: 1rem;
  margin-top: 0;
}
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 2vw 1.5rem 2vw;
}
.footer-content.five-cols {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2.2rem;
  margin-bottom: 2rem;
}
.footer-section h3 {
  color: #fff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: left;
}
.currency-label {
  margin-top: 1.2rem;
  margin-bottom: 0.5rem;
  font-size: 1.08rem;
  font-weight: 700;
}
.currency-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.currency-select {
  width: 100%;
  max-width: 220px;
  min-width: 160px;
  box-sizing: border-box;
  padding: 0 18px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  margin-bottom: 1.2rem;
  font-size: 16px;
  background: #f8f9fa;
  color: #222;
}
.footer-section ul {
  list-style: none;
  padding: 0;
  margin-bottom: 1.2rem;
}
.footer-section ul li {
  margin-bottom: 0.5rem;
}
.footer-section ul li a, .footer-section ul li router-link {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
}
.footer-section ul li a:hover, .footer-section ul li router-link:hover {
  color: #ffe600;
}
.footer-section {
  align-items: flex-start;
}
.app-btn {
  display: block;
  margin-bottom: 1rem;
  width: 160px;
  max-width: 100%;
  background: #1a2b43;
  border-radius: 8px;
  padding: 0;
  text-align: left;
  margin-left: 0;
}
.app-btn img {
  width: 100%;
  height: 56px;
  object-fit: contain;
  background: #1a2b43;
  border-radius: 8px;
  padding: 0;
  display: block;
}
.payment-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.7rem;
}
.payment-icons img {
  height: 28px;
  background: #fff;
  border-radius: 4px;
  padding: 2px 6px;
}
.footer-social-row {
  text-align: center;
  margin-bottom: 1.5rem;
}
.footer-social-row.left-align {
  text-align: left;
  margin-bottom: 0.5rem;
}
.footer-social-row h3 {
  color: #fff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}
.social-links {
  display: flex;
  justify-content: flex-start;
  gap: 1.2rem;
}
.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #34495e;
  color: white;
  border-radius: 50%;
  text-decoration: none;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}
.social-link:hover {
  background: #3498db;
  color: #fff;
  transform: translateY(-2px);
}
.footer-bottom-content {
  border-top: 1px solid #2c3e50;
  padding-top: 1rem;
  text-align: center;
  color: #bdc3c7;
  font-size: 0.98rem;
}
.right-section .work-pay-block {
  margin-top: 0;
}
@media (max-width: 1200px) {
  .footer-content.five-cols {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
@media (max-width: 1024px) {
  .footer-content.five-cols {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}
@media (max-width: 700px) {
  .footer-content.five-cols {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 2rem 4vw 1rem 4vw;
  }
  .footer-social-row.left-align {
    margin-bottom: 1rem;
  }
}
</style>

<!-- LanguageSwitcher'a özel stil -->
<style>
.lang-switch .active-lang,
.lang-switch .lang-dropdown a {
  color: #222 !important;
  background: #f8f9fa;
}

/* CurrencySwitcher'a özel stil */
.currency-switcher .currency-display {
  background: #f8f9fa !important;
  color: #222 !important;
  border: 1px solid #dee2e6 !important;
}

.currency-switcher .currency-options {
  background: #f8f9fa !important;
  border: 1px solid #dee2e6 !important;
}

.currency-switcher .currency-option {
  color: #222 !important;
}

.currency-switcher .currency-option:hover {
  background-color: #e9ecef !important;
}

.currency-switcher .currency-option.active {
  background-color: #fc6421 !important;
  color: white !important;
}
</style>
