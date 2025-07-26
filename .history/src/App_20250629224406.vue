<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const tenantId = 'ad5257a5-efdd-4314-9e5e-b56aabe321f1'
// Lifecycle
onMounted(() => {
  // Load external scripts in a Vue 3 compatible way
  loadExternalScripts()
  
  // Initialize any global functionality
  initializeGlobalFeatures()
})

// Methods
const loadExternalScripts = () => {
  // Load Font Awesome
  const fontAwesome = document.createElement('link')
  fontAwesome.rel = 'stylesheet'
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
  document.head.appendChild(fontAwesome)
  
  // Load Flag Icons
  const flagIcons = document.createElement('link')
  flagIcons.rel = 'stylesheet'
  flagIcons.href = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/css/flag-icons.min.css'
  document.head.appendChild(flagIcons)
  
  // Load jQuery and other dependencies if needed
  loadScript('https://code.jquery.com/jquery-3.6.0.min.js').then(() => {
    // Load other jQuery plugins after jQuery is loaded
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js')
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js')
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.umd.js')
  })
}

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initializeGlobalFeatures = () => {
  // Initialize any global features that were in the original script
  console.log('Initializing global features')
  
  // Add global functions that might be called from components
  window.doGTranslate = function(element) {
    const lang = element.dataset.lang
    const value = element.dataset.value
    
    // Implement translation logic here
    console.log(`Translating to ${lang}: ${value}`)
    
    // Update the active language display
    const activeLang = document.querySelector('.active-lang')
    if (activeLang) {
      activeLang.innerHTML = element.innerHTML.trim()
        .replaceAll('\t', '')
        .replaceAll('\n', '')
    }
    
    // Store language preference
    localStorage.setItem('selectedLanguage', lang)
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Utility classes */
.container {
  max-width: 1510px;
  margin: 0 auto;
  padding: 0 15px;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #fc6421;
  color: white;
}

.btn-primary:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: #fc6421;
  border: 2px solid #fc6421;
}

.btn-secondary:hover {
  background: #fc6421;
  color: white;
}

/* Responsive utilities */
@media (max-width: 768px) {
  .d-none-xs {
    display: none;
  }
  
  .d-block-xs {
    display: block;
  }
}

@media (min-width: 769px) {
  .d-block-xs {
    display: none;
  }
  
  .d-none-xs {
    display: block;
  }
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style> 