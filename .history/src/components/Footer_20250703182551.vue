<template>
  <footer class="modern-footer">
    <div class="footer-main">
      <div class="footer-col lang-currency">
        <label>Dil</label>
        <select>
          <option>Türkçe</option>
          <option>English</option>
        </select>
        <label>Para birimi</label>
        <select>
          <option>Türk Lirası (₺)</option>
          <option>Euro (€)</option>
        </select>
      </div>
      <div class="footer-col mobile-apps">
        <label>Mobil</label>
        <a href="#" class="app-btn google-play">
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
        </a>
        <a href="#" class="app-btn app-store">
          <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" />
        </a>
      </div>
      <div class="footer-col support-links">
        <label>Destek</label>
        <ul>
          <li><router-link to="/contact">İletişim</router-link></li>
          <li><router-link to="/security/terms-conditions">Yasal Bildirim</router-link></li>
          <li><router-link to="/security/privacy-policy">Gizlilik Politikası</router-link></li>
          <li><router-link to="/security/cookie-policy">Çerezler ve Pazarlama Tercihleri</router-link></li>
          <li><router-link to="/security/terms-conditions">Genel Şartlar ve Koşullar</router-link></li>
          <li><a href="#">Dijital Hizmetler Yasasına göre bilgiler</a></li>
          <li><a href="#">Site Haritası</a></li>
          <li><a href="#">Kişisel Bilgilerimi Satmayın veya Paylaşmayın</a></li>
        </ul>
        <label>Şirket</label>
        <ul>
          <li><router-link to="/about">Hakkımızda</router-link></li>
          <li><a href="#">Kariyer</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Basın</a></li>
          <li><a href="#">Hediye Kartları</a></li>
          <li><a href="#">Explorer</a></li>
        </ul>
      </div>
      <div class="footer-col business-pay">
        <label>Bizimle çalış</label>
        <ul>
          <li><a href="#">Tedarik ortağı olarak</a></li>
          <li><a href="#">İçerik Üreticisi Olarak</a></li>
          <li><a href="#">Satış ortağı olarak</a></li>
        </ul>
        <label>Ödeme Seçenekleri</label>
        <div class="payment-icons">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/PayPal_logo.svg" alt="PayPal" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Apple_Pay_logo.svg" alt="Apple Pay" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Google_Pay_Logo.svg" alt="Google Pay" />
        </div>
      </div>
    </div>
    <div class="footer-bottom-modern">
      <div class="copyright">
        © 2008 — {{ currentYear }} SearchYourTour. Tüm hakları saklıdır.
      </div>
      <div class="footer-socials">
        <a href="#"><i class="fab fa-facebook"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-x-twitter"></i></a>
        <a href="#"><i class="fab fa-pinterest"></i></a>
        <a href="#"><i class="fab fa-linkedin"></i></a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.modern-footer {
  background: #1a2b43;
  color: #fff;
  padding: 0;
  font-size: 1rem;
  margin-top: 0;
}
.footer-main {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 2vw 1.5rem 2vw;
}
.footer-col label {
  font-weight: 700;
  font-size: 1.08rem;
  margin-bottom: 0.7rem;
  display: block;
  color: #fff;
}
.lang-currency select {
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  border: none;
  margin-bottom: 1.2rem;
  font-size: 1rem;
}
.mobile-apps .app-btn {
  display: block;
  margin-bottom: 1rem;
  max-width: 180px;
}
.mobile-apps img {
  width: 100%;
  height: 44px;
  object-fit: contain;
  background: #fff;
  border-radius: 8px;
  padding: 2px 0;
}
.footer-col ul {
  list-style: none;
  padding: 0;
  margin-bottom: 1.2rem;
}
.footer-col ul li {
  margin-bottom: 0.5rem;
}
.footer-col ul li a, .footer-col ul li router-link {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
}
.footer-col ul li a:hover, .footer-col ul li router-link:hover {
  color: #ffe600;
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
.footer-bottom-modern {
  border-top: 1px solid #2c3e50;
  padding: 1.1rem 2vw 0.7rem 2vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 1rem;
}
.copyright {
  color: #fff;
  font-size: 0.98rem;
}
.footer-socials {
  display: flex;
  gap: 1.2rem;
}
.footer-socials a {
  color: #fff;
  font-size: 1.5rem;
  transition: color 0.2s;
}
.footer-socials a:hover {
  color: #ffe600;
}
@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}
@media (max-width: 700px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 2rem 4vw 1rem 4vw;
  }
  .footer-bottom-modern {
    flex-direction: column;
    text-align: center;
    gap: 0.7rem;
  }
}
</style>
