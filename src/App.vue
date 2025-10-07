<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
    <WhatsAppBubble />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import WhatsAppBubble from './components/WhatsAppBubble.vue'

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
  // Load Flag Icons with error handling and fallback (original working version)
  const flagIcons = document.createElement('link')
  flagIcons.rel = 'stylesheet'
  flagIcons.href = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/css/flag-icons.min.css'
  flagIcons.onload = () => {
    console.log('Flag Icons CSS loaded successfully from primary CDN')
    window.dispatchEvent(new Event('flag-icons-loaded'))
  }
  flagIcons.onerror = () => {
    console.warn('Flag Icons CSS failed to load from primary CDN, trying alternative source')
    // Fallback to alternative CDN
    const fallbackFlagIcons = document.createElement('link')
    fallbackFlagIcons.rel = 'stylesheet'
    fallbackFlagIcons.href = 'https://cdnjs.cloudflare.com/ajax/libs/flag-icons/6.6.6/css/flag-icons.min.css'
    fallbackFlagIcons.onload = () => {
      console.log('Flag Icons CSS loaded successfully from fallback CDN')
      window.dispatchEvent(new Event('flag-icons-loaded'))
    }
    fallbackFlagIcons.onerror = () => {
      console.error('Both Flag Icons CDNs failed to load')
      window.dispatchEvent(new Event('flag-icons-failed'))
    }
    document.head.appendChild(fallbackFlagIcons)
  }
  document.head.appendChild(flagIcons)
  
  // Also load Font Awesome for additional icons if needed
  const fontAwesome = document.createElement('link')
  fontAwesome.rel = 'stylesheet'
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
  document.head.appendChild(fontAwesome)
  
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
  
  // Wait for flag icons CSS to load before initializing
  const waitForFlagIcons = () => {
    const testElement = document.createElement('span')
    testElement.className = 'fi fi-gb'
    testElement.style.display = 'none'
    document.body.appendChild(testElement)
    
    // Check if flag icons CSS is loaded by testing computed styles
    const computedStyle = window.getComputedStyle(testElement)
    const isLoaded = computedStyle.backgroundImage && 
                    computedStyle.backgroundImage !== 'none' && 
                    computedStyle.backgroundImage !== 'initial'
    
    document.body.removeChild(testElement)
    
    if (isLoaded) {
      console.log('Flag Icons CSS is ready')
      return true
    }
    return false
  }
  
  // Check every 100ms for flag icons CSS to load
  const checkFlagIcons = setInterval(() => {
    if (waitForFlagIcons()) {
      clearInterval(checkFlagIcons)
      console.log('Flag Icons CSS loaded successfully')
      // Dispatch event to notify components
      window.dispatchEvent(new Event('flag-icons-ready'))
    }
  }, 100)
  
  // Add global functions that might be called from components
  window.doGTranslate = function(element) {
    // Safety check for element and its properties
    if (!element || !element.dataset) {
      console.warn('doGTranslate: Invalid element parameter')
      return
    }
    
    const lang = element.dataset.lang
    const value = element.dataset.value
    
    // Implement translation logic here
    console.log(`Translating to ${lang}: ${value}`)
    
    // Update the active language display
    const activeLang = document.querySelector('.active-lang')
    if (activeLang && element.innerHTML) {
      activeLang.innerHTML = element.innerHTML.trim()
        .replaceAll('\t', '')
        .replaceAll('\n', '')
    }
    
    // Store language preference
    if (lang) {
      localStorage.setItem('selectedLanguage', lang)
      
      // Update RTL support
      updateRTLSupport(lang)
    }
  }
  
  // RTL support function
  const updateRTLSupport = (lang) => {
    const rtlLanguages = ['ar']
    const isRTL = rtlLanguages.includes(lang)
    
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }
  
  // Initialize RTL support on page load
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'
  updateRTLSupport(savedLanguage)
}
</script>

<style>
#app {
  min-height: 100vh;
}

body {
  margin: 0;
  padding: 0;
  overflow: visible;
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  color: #333;
}

router-view {
  /* flex: 1; display: flex; flex-direction: column; kaldırıldı */
}

/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'GT-Eesti', sans-serif;
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