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
          :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }"
        >
          <i :class="`fi fi-${lang.flag}`"></i>
          {{ lang.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive data
const currentLanguage = ref('en')
const isDropdownOpen = ref(false)
const languages = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch languages from API
const fetchLanguages = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('https://searchyourtour.com/api/languages?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1')
    if (!response.ok) {
      throw new Error('Failed to fetch languages')
    }
    
    const data = await response.json()
    if (data && Array.isArray(data)) {
      languages.value = data
      
      // Set default language to first available language if none is set
      if (languages.value.length > 0 && !currentLanguage.value) {
        const defaultLang = languages.value.find(lang => lang && lang.status) || languages.value[0]
        if (defaultLang) {
          currentLanguage.value = defaultLang.code
        }
      }
    }
  } catch (err) {
    error.value = 'Failed to load languages'
    console.error('Error fetching languages:', err)
    // Keep the default languages if API fails
  } finally {
    loading.value = false
  }
}

// Methods
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const changeLanguage = (langCode) => {
  currentLanguage.value = langCode
  isDropdownOpen.value = false
  
  // Save to localStorage
  localStorage.setItem('selectedLanguage', langCode)
  
  // Emit event for parent components
  emit('language-changed', langCode)
  
  // Call the original doGTranslate function if it exists
  if (typeof window.doGTranslate === 'function') {
    const lang = languages.value.find(l => l && l.code === langCode)
    window.doGTranslate({ dataset: { lang: langCode, value: lang ? lang.name : langCode } })
  }
}

const getLanguageIcon = (langCode) => {
  const lang = languages.value.find(l => l && l.code === langCode)
  if (!lang) return 'fi fi-gb'
  if (lang.code === 'en') return 'fi fi-gb'
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
  
  // Initialize language from meta tag or localStorage
  const metaLanguage = document.querySelector("meta[name='language']")?.getAttribute('content')
  if (metaLanguage) {
    currentLanguage.value = metaLanguage
  }
  
  const savedLanguage = localStorage.getItem('selectedLanguage')
  if (savedLanguage) {
    currentLanguage.value = savedLanguage
  }
  
  // Fetch languages from API
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
  padding: 8px 12px;
  border-radius: 4px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: flex-start;
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

.lang-dropdown i {
  font-size: 20px;
  min-width: 32px;
  min-height: 20px;
  width: 32px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
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
}

.lang-dropdown a:hover {
  background-color: #f8f9fa;
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
