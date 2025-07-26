<template>
  <header class="main-header">
    <div class="container">
      <div class="header">
        <div class="logo">
          <router-link class="d-block d-none-xs" to="/">
            <img alt="logo" :src="logo"/>
          </router-link>
        </div>
        <!-- Hamburger Menü Butonu (Mobil) -->
        <button class="mobile-menu-toggle" @click="openMobileMenu">
          <i class="fas fa-bars"></i>
        </button>
        <!-- Mobil Menü ve Overlay -->
        <div v-if="showMobileMenu" class="mobile-menu-overlay" @click.self="closeMobileMenu">
          <nav class="mobile-menu" @click.stop>
            <div class="mobile-menu-header">
              <router-link to="/" class="mobile-menu-logo" @click="closeMobileMenu">
                <img alt="logo" :src="logo"/>
              </router-link>
              <button class="mobile-menu-close" @click="closeMobileMenu" aria-label="Close menu">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="mobile-menu-links">
              <router-link to="/become-partner" @click="closeMobileMenu">Become a Partner</router-link>
              <router-link to="/faqs" @click="closeMobileMenu">FAQs</router-link>
              <router-link to="/contact" @click="closeMobileMenu">Contact Us</router-link>
              <router-link to="/my-pass" @click="closeMobileMenu">Manage Your Pass</router-link>
              <router-link to="/my-listing" @click="closeMobileMenu">Manage Your Listing</router-link>
              <router-link to="/attractions" @click="closeMobileMenu">İstanbul Attractions</router-link>
              <router-link to="/things-to-do-in-istanbul" @click="closeMobileMenu">Things to Do in Istanbul</router-link>
              <router-link to="/tours" @click="closeMobileMenu">Tours</router-link>
              <router-link to="/about" @click="closeMobileMenu">About</router-link>
              <router-link to="/istanbul-pass" class="mobile-buy-btn" @click="closeMobileMenu">Buy Now</router-link>
            </div>
          </nav>
        </div>
        <!-- Masaüstü Menü -->
        <div class="mobile-flex">
          <div class="header-right">
            <div class="top-links">
              <ul>
                <li><router-link to="/become-partner">Become a Partner</router-link></li>
                <li><router-link to="/faqs">FAQs</router-link></li>
                <li><router-link to="/contact">Contact Us</router-link></li>
                <li><router-link to="/my-pass">Manage Your Pass</router-link></li>
                <li><router-link to="/my-listing">Manage Your Listing</router-link></li>
                <li>
                  <div class="hidden-mobile">
                    <LanguageSwitcher />
                  </div>
                </li>
                <li>
                  <div class="currency-wrap">
                    <select class="currency-select">
                      <option>Turkish Lira (₺)</option>
                      <option>Euro (€)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                </li>
              </ul>
            </div>
            <nav class="main-menu">
              <ul>
                <li><router-link to="/attractions">İstanbul Attractions</router-link></li>
                <li><router-link to="/tours">Tours</router-link></li>
                <li><router-link to="/about">About</router-link></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import logo from '../assets/logo.png'

const showMobileMenu = ref(false)

function openMobileMenu() {
  showMobileMenu.value = true
  document.body.style.overflow = 'hidden'
}
function closeMobileMenu() {
  showMobileMenu.value = false
  document.body.style.overflow = ''
}
// Escape tuşu ile menüyü kapat
onMounted(() => {
  window.addEventListener('keydown', escClose)
})
function escClose(e) {
  if (showMobileMenu.value && (e.key === 'Escape' || e.key === 'Esc')) {
    closeMobileMenu()
  }
}
// Temizlik
watch(showMobileMenu, (val) => {
  if (!val) document.body.style.overflow = ''
})
</script>

<style scoped>
.main-header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: top 0.3s ease;
}

/* Top banner varsa header'ı aşağı kaydır */
.has-top-banner .main-header {
  top: 60px; /* Top banner yüksekliği */
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}
.logo img {
  height: 70px;
  width: auto;
}
.header-tursab {
  font-size: 10px;
  color: #666;
}
.logo a {
  display: flex;
    flex-direction: column;
    align-items: center;
}
.mobile-flex {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.header-right .top-links ul {
  display: flex;
  align-items: center;
}
.top-links ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  align-items: center;
}
.top-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 12px;
  transition: color 0.3s ease;
}
.top-links a:hover {
  color: #FC6421;
}
.main-menu ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  align-items: center;
}
.main-menu a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
}
.main-menu a:hover {
  color: #FC6421;
}
.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}
.btn-red {
  background: #FC6421;
  color: white;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  margin-top: 7px;
}
.btn-red:hover {
  background: #FC6421;
  color: white;
}
.mobile-menu-toggle {
  display: none;
}
.price-btn.buy-btn span {
  color: #fff !important;
}
.header .currency-wrap {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0;
  margin: 0;
}
.header .currency-select {
  height: 40px;
  min-width: 140px;
  max-width: 180px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  background: #fff;
  padding: 0 18px;
  margin-left: 12px;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  margin: 0;
  align-self: center;
}
@media (max-width: 700px) {
  .main-header, header, .container {
    width: 100vw !important;
    min-width: 0 !important;
    max-width: 100vw !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  /* Mobilde top banner varsa header'ı daha aşağı kaydır */
  .has-top-banner .main-header {
    top: 50px; /* Mobilde top banner daha küçük */
  }
  .header {
    flex-direction: column;
    align-items: stretch;
    padding: 0 0 8px 0;
    position: relative;
  }
  .logo {
    justify-content: center;
    margin: 12px 0;
    text-align: center;
  }
  .main-menu, .top-links, .header-right, .mobile-flex {
    display: none !important;
  }
  .mobile-menu-toggle {
    display: block;
    position: absolute;
    right: 16px;
    top: 16px;
    font-size: 2rem;
    background: none;
    border: none;
    color: #FC6421;
    z-index: 200;
  }
  .mobile-menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(44,62,80,0.65);
    z-index: 9999;
    display: flex;
    justify-content: flex-end;
    animation: fadeIn 0.2s;
  }
  .mobile-menu {
    background: #fff;
    width: 90vw;
    max-width: 340px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0;
    box-shadow: -2px 0 32px #0002;
    animation: slideInRight 0.2s;
    position: relative;
  }
  .mobile-menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2rem 1.2rem 0.5rem 1.2rem;
    border-bottom: 1px solid #f0f0f0;
  }
  .mobile-menu-logo img {
    height: 36px;
  }
  .mobile-menu-close {
    background: none;
    border: none;
    font-size: 2rem;
    color: #FC6421;
    cursor: pointer;
    margin-left: 8px;
  }
  .mobile-menu-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.2rem;
  }
  .mobile-menu-links a {
    font-size: 1.1rem;
    color: #2c3e50;
    padding: 0.9rem 0.7rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.18s, color 0.18s;
  }
  .mobile-menu-links a:hover {
    background: #f7f7f7;
    color: #FC6421;
  }
  .mobile-buy-btn {
    background: #FC6421;
    color: #fff !important;
    text-align: center;
    margin-top: 1.2rem;
    font-size: 1.15rem;
    border-radius: 8px;
    padding: 1rem 0;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(0,0,0,0.09);
  }
  .mobile-buy-btn:hover {
    background: #FC6421;
    color: #fff !important;
  }
}
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
