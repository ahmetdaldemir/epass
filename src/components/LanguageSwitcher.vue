<template>
  <div class="lang-switch">
    <span class="active-lang" @click="toggleDropdown">
      <span :class="getLanguageIcon(currentLanguage)" :data-active-language="currentLanguage"></span>
      {{ getLanguageCode(currentLanguage) }}
    </span>
    <ul class="lang-dropdown" v-show="isDropdownOpen">
      <li v-for="lang in languages" :key="lang.id" >
        <a 
          :data-lang="lang.code" 
          :data-value="lang.name" 
          href="#" 
          @click.prevent="changeLanguage(lang.code)"
        >
          <span :class="getLanguageIcon(lang.code)"></span>
          {{ lang.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '../stores/language'

// Reactive data
const isDropdownOpen = ref(false)
const loading = ref(false)
const error = ref(null)

// Store ve i18n
const languageStore = useLanguageStore()
const { locale } = useI18n()

// Computed properties
const currentLanguage = computed(() => languageStore.getCurrentLanguage)
const languages = computed(() => languageStore.getAvailableLanguages)

// Check if flag icons CSS is loaded
const flagIconsLoaded = computed(() => {
  // Test if flag-icons CSS is loaded by checking if a flag element has background-image
  if (typeof window !== 'undefined' && document) {
    try {
      const testElement = document.createElement('span')
      testElement.className = 'fi fi-gb'
      testElement.style.display = 'none'
      document.body.appendChild(testElement)
      
      const computedStyle = window.getComputedStyle(testElement)
      const isLoaded = computedStyle.backgroundImage && 
                      computedStyle.backgroundImage !== 'none' && 
                      computedStyle.backgroundImage !== 'initial'
      
      document.body.removeChild(testElement)
      
      return isLoaded
    } catch (error) {
      console.warn('Error checking flag icons:', error)
      return false
    }
  }
  return false
})

// Static language list based on database IDs
const fetchLanguages = () => {
  // Languages are now managed by the store
  // This function is kept for compatibility but not needed
}

// Methods
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const changeLanguage = (langCode) => {
  // Store'da dili güncelle
  languageStore.setLanguage(langCode)
  
  // i18n locale'ini güncelle
  locale.value = langCode
  
  // Dropdown'ı kapat
  isDropdownOpen.value = false
  
  // Emit event for parent components
  emit('language-changed', langCode)
  
  // Global event dispatch for all components
  const languageId = getLanguageId(langCode)
  window.dispatchEvent(new CustomEvent('language-changed', {
    detail: {
      language: langCode,
      languageId: languageId
    }
  }))
  
  // RTL desteğini güncelle
  const rtlLanguages = ['ar']
  const isRTL = rtlLanguages.includes(langCode)
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  document.documentElement.lang = langCode
  
  // Call the original doGTranslate function if it exists
  if (typeof window.doGTranslate === 'function') {
    const lang = languages.value.find(l => l && l.code === langCode)
    // Create a mock element with the required dataset properties
    const mockElement = {
      dataset: { lang: langCode, value: lang ? lang.name : langCode },
      innerHTML: lang ? lang.name : langCode
    }
    window.doGTranslate(mockElement)
  }
}

const getLanguageIcon = (langCode) => {
  const lang = languages.value.find(l => l && l.code === langCode)
  if (!lang) return 'fi fi-gb'
  
  // Flag icons mapping - using flag-icons library
  const flagMapping = {
    'tr': 'fi fi-tr',
    'de': 'fi fi-de', 
    'en': 'fi fi-gb',
    'ar': 'fi fi-sa'
  }
  
  return flagMapping[langCode] || 'fi fi-gb'
}



const getLanguageCode = (langCode) => {
  const lang = languages.value.find(l => l && l.code === langCode)
  return lang ? lang.name : langCode.toUpperCase()
}

const getLanguageName = (langCode) => {
  const lang = languages.value.find(l => l && l.code === langCode)
  return lang ? lang.name : 'English'
}

const getLanguageId = (langCode) => {
  const languageMap = {
    'tr': 2,    // Türkçe
    'de': 6,    // Deutsch
    'en': 1,    // English
    'ar': 3,    // العربية
    'es': 4,    // Español
    'fr': 5,    // Français
    'it': 7,    // Italiano
    'pt': 8,    // Português
    'zh': 10,   // 中文
    'ja': 11,   // 日本語
    'ru': 9     // Русский
  }
  return languageMap[langCode] || 1
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.lang-switch')) {
    isDropdownOpen.value = false
  }
}

// Emit events
const emit = defineEmits(['language-changed'])

// Lifecycle
const handleFlagIconsLoaded = () => {
  console.log('Flag Icons CSS loaded event received')
  // Force re-computation of flagIconsLoaded
  // This will trigger a re-render with the updated computed value
}

const handleFlagIconsFailed = () => {
  console.log('Flag Icons CSS failed to load event received')
  // Force re-computation of flagIconsLoaded
  // This will trigger a re-render with the updated computed value
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Listen for flag icons CSS loading events
  window.addEventListener('flag-icons-loaded', handleFlagIconsLoaded)
  window.addEventListener('flag-icons-failed', handleFlagIconsFailed)
  
  // Initialize language store
  languageStore.initializeLanguage()
  
  // Initialize languages
  fetchLanguages()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  
  // Remove flag icons event listeners
  window.removeEventListener('flag-icons-loaded', handleFlagIconsLoaded)
  window.removeEventListener('flag-icons-failed', handleFlagIconsFailed)
})
</script>

<style scoped>
.lang-switch {
  position: relative;
  display: inline-block;
}

.active-lang {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0 18px;
  border-radius: 4px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: flex-start;
  height: 40px;
  font-size: 16px;
}

.active-lang:hover {
  background: #e9ecef;
}

.active-lang i {
  font-size: 20px;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 200px;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.lang-dropdown li {
  border-bottom: 1px solid #f1f3f4;
}

.lang-dropdown li:last-child {
  border-bottom: none;
}

.lang-dropdown a {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  padding: 12px 16px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.3s ease;
  min-width: 140px;
  width: 100%;
  box-sizing: border-box;
}

.lang-dropdown a:hover {
  background-color: #f8f9fa;
}

.lang-dropdown i {
  font-size: 20px;
  min-width: 32px;
  min-height: 20px;
  width: 32px;
  height: 20px;
  line-height: 20px;
  vertical-align: middle;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
}

.fi {
  display: inline-block;
  width: 24px;
  height: 16px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  vertical-align: middle;
  margin-right: 8px;
}

/* Ensure flag icons are visible */
.fi.fi-tr,
.fi.fi-de,
.fi.fi-gb,
.fi.fi-sa {
  display: inline-block;
  min-width: 24px;
  min-height: 16px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}



@media (max-width: 768px) {
  .lang-dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 300px;
    max-height: 80vh;
    overflow-y: auto;
  }
}
</style>
