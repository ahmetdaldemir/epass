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
              <router-link to="/faqs" @click="closeMobileMenu">FAQs</router-link>
              <router-link to="/contact" @click="closeMobileMenu">Contact Us</router-link>
              <router-link to="/my-pass" @click="closeMobileMenu">Manage Your Pass</router-link>
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
                  <li><router-link to="/faqs">FAQs</router-link></li>
                  <li><router-link to="/contact">Contact Us</router-link></li>
                  <li><router-link to="/my-pass">Manage Your Pass</router-link></li>
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1100;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}
.logo img {
  height: 70px;
  width: auto;
}

@media (max-width: 1024px) {
  .logo img {
    height: 60px;
  }
}

@media (max-width: 768px) {
  .logo img {
    height: 50px;
  }
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
  flex-wrap: wrap;
}
.header-right .top-links ul {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.top-links ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}
.top-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 12px;
  transition: color 0.3s ease;
  white-space: nowrap;
}
.top-links a:hover {
  color: #FC6421;
}
.main-menu ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}
.main-menu a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
  white-space: nowrap;
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
/* Tablet ve orta boyutlu ekranlar için responsive düzenlemeler */
@media (max-width: 1024px) {
  .top-links ul {
    gap: 1rem;
  }
  .main-menu ul {
    gap: 1rem;
  }
  .top-links a {
    font-size: 11px;
  }
  .main-menu a {
    font-size: 14px;
  }
  .container {
    padding: 0 15px;
  }
}

/* iPad Mini ve benzeri küçük tablet'ler için */
@media (max-width: 768px) and (min-width: 701px) {
  .top-links ul {
    gap: 0.6rem;
  }
  .main-menu ul {
    gap: 0.6rem;
  }
  .top-links a {
    font-size: 9px;
  }
  .main-menu a {
    font-size: 12px;
  }
  .header-right {
    flex-direction: column;
    gap: 0.3rem;
  }
  .container {
    padding: 0 8px;
  }
}

@media (max-width: 900px) {
  .top-links ul {
    gap: 0.8rem;
  }
  .main-menu ul {
    gap: 0.8rem;
  }
  .top-links a {
    font-size: 10px;
  }
  .main-menu a {
    font-size: 13px;
  }
  .header-right {
    flex-direction: column;
    gap: 0.5rem;
  }
  .container {
    padding: 0 10px;
  }
}

@media (max-width: 700px) {
  .main-header, header, .container {
    width: 100vw !important;
    min-width: 0 !important;
    max-width: 100vw !important;
    padding: 0 !important;
    margin: 0 !important;
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
