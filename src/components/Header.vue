<template>
  <header class="main-header mobile">
    <div class="container">
      <div class="header">
        <div class="logo">
          <router-link class="d-block d-none-xs" to="/">
            <img alt="logo" src="https://static.istanbultouristpass.com/images/itp-logo.svg?v5.0.16"/>
            <span class="header-tursab">Cityberry Tourism is a member of TURSAB 11745</span>
          </router-link>
  
        </div>
        
        <div class="mobile-flex">
    
          
          <div class="header-right">
            <div class="top-links">
              <ul>
                <li><router-link to="/become-partner">Become a Partner</router-link></li>
                <li><router-link to="/guidebook">Tips & Guides</router-link></li>
                <li><router-link to="/faqs">FAQs</router-link></li>
                <li><router-link to="/contact">Contact Us</router-link></li>
                <li><a href="https://myistanbul.istanbultouristpass.com/" target="_blank">Manage Your Pass</a></li>
                <li>
                  <div class="hidden-mobile">
                    <LanguageSwitcher />
                  </div>
                </li>
                <li class="btn btn-red buy-btn menu-btn">
                  <router-link class="price-btn buy-btn" to="/istanbul-pass">
                    <span>Buy Now</span>
                  </router-link>
                </li>
              </ul>
            </div>
            
            <nav class="main-menu">
              <ul>
            
                <li><router-link to="/attractions">Attractions</router-link></li>
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
import { ref, onMounted } from 'vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

// Reactive data
const isMobileMenuOpen = ref(false)

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Lifecycle
onMounted(() => {
  // Initialize any header-specific functionality
  console.log('Header component mounted')
})
</script>

<style scoped>
.main-header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo img {
  height: 40px;
  width: auto;
}

.header-tursab {
  font-size: 7px;
  color: #666;
  margin-left: 10px;
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
  color: #e74c3c;
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
  color: #e74c3c;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-red {
  background: #e74c3c;
  color: white;
}

.btn-red:hover {
  background: #c0392b;
  color: white;
}

@media (max-width: 768px) {
  .hidden-mobile {
    display: none;
  }
  
  .mobile-flex {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .top-links ul {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .main-menu ul {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
