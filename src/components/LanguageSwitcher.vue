<template>
  <div class="lang-switch">
    <span class="active-lang" @click="toggleDropdown">
      <i :class="getLanguageIcon(currentLanguage)" :data-active-language="currentLanguage"></i>
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
          <i :class="getLanguageIcon(lang.code)"></i>
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
  
  // RTL desteğini güncelle
  const rtlLanguages = ['ar']
  const isRTL = rtlLanguages.includes(langCode)
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  document.documentElement.lang = langCode
  
  // Call the original doGTranslate function if it exists
  if (typeof window.doGTranslate === 'function') {
    const lang = languages.value.find(l => l && l.code === langCode)
    window.doGTranslate({ dataset: { lang: langCode, value: lang ? lang.name : langCode } })
  }
}

const getLanguageIcon = (langCode) => {
  const lang = languages.value.find(l => l && l.code === langCode)
  if (!lang) return 'fi fi-gb'
  return lang.flag ? `fi fi-${lang.flag}` : 'fi fi-gb'
}

const getLanguageCode = (langCode) => {
  const lang = languages.value.find(l => l && l.code === langCode)
  return lang ? lang.name : langCode.toUpperCase()
}

const getLanguageName = (langCode) => {
  const lang = languages.value.find(l => l && l.code === langCode)
  return lang ? lang.name : 'English'
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
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Initialize language store
  languageStore.initializeLanguage()
  
  // Initialize languages
  fetchLanguages()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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
  font-size: 16px;
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
