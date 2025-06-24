<template>
  <div class="lang-switch">
    <span class="active-lang" @click="toggleDropdown">
      <i :class="getLanguageIcon(currentLanguage)" :data-active-language="currentLanguage"></i>
      {{ getLanguageCode(currentLanguage) }}
    </span>
    <ul class="lang-dropdown" v-show="isDropdownOpen">
      <li v-for="lang in languages" :key="lang.code">
        <a 
          :data-lang="lang.code" 
          :data-value="lang.name" 
          href="#" 
          @click.prevent="changeLanguage(lang.code)"
          :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }"
        >
          <i :class="lang.icon"></i>
          {{ lang.code.toUpperCase() }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive data
const currentLanguage = ref('jp')
const isDropdownOpen = ref(false)

// Language data
const languages = ref([
  { code: 'ar', name: 'Arabic', icon: 'fi fi-arab' },
  { code: 'bg', name: 'Bulgarian', icon: 'fi fi-bg' },
  { code: 'zh-cn', name: 'Chinese', icon: 'fi fi-cn' },
  { code: 'hr', name: 'Croatian', icon: 'fi fi-hr' },
  { code: 'en', name: 'English', icon: 'fi fi-gb' },
  { code: 'fr', name: 'French', icon: 'fi fi-fr' },
  { code: 'de', name: 'German', icon: 'fi fi-de' },
  { code: 'el', name: 'Greek', icon: 'fi fi-gr' },
  { code: 'iw', name: 'Hebrew', icon: 'fi fi-il' },
  { code: 'hu', name: 'Hungarian', icon: 'fi fi-hu' },
  { code: 'hi', name: 'Indian', icon: 'fi fi-in' },
  { code: 'id', name: 'Indonesian', icon: 'fi fi-id' },
  { code: 'it', name: 'Italian', icon: 'fi fi-it' },
  { code: 'ja', name: 'Japanese', icon: 'fi fi-jp' },
  { code: 'ko', name: 'Korean', icon: 'fi fi-kr' },
  { code: 'mk', name: 'Macedonian', icon: 'fi fi-mk' },
  { code: 'fa', name: 'Persian', icon: 'fi fi-ir' },
  { code: 'pl', name: 'Polish', icon: 'fi fi-pl' },
  { code: 'pt', name: 'Portuguese', icon: 'fi fi-pt' },
  { code: 'ro', name: 'Romanian', icon: 'fi fi-ro' },
  { code: 'ru', name: 'Russian', icon: 'fi fi-ru' },
  { code: 'es', name: 'Spanish', icon: 'fi fi-es' },
  { code: 'zh-tw', name: 'Taiwanese', icon: 'fi fi-tw' },
  { code: 'ur', name: 'Urdu', icon: 'fi fi-pk' },
  { code: 'tr', name: 'Turkish', icon: 'fi fi-tr' }
])

// Methods
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const changeLanguage = (langCode) => {
  currentLanguage.value = langCode
  isDropdownOpen.value = false
  
  // Emit event for parent components
  emit('language-changed', langCode)
  
  // Call the original doGTranslate function if it exists
  if (typeof window.doGTranslate === 'function') {
    window.doGTranslate({ dataset: { lang: langCode, value: getLanguageName(langCode) } })
  }
}

const getLanguageIcon = (langCode) => {
  const lang = languages.value.find(l => l.code === langCode)
  return lang ? lang.icon : 'fi fi-gb'
}

const getLanguageCode = (langCode) => {
  return langCode.toUpperCase()
}

const getLanguageName = (langCode) => {
  const lang = languages.value.find(l => l.code === langCode)
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
}

.active-lang:hover {
  background: #e9ecef;
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
  justify-content: left;
  gap: 10px;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 12px 16px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.3s ease;
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
