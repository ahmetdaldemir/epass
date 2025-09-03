import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLanguageStore = defineStore('language', () => {
  // State
  const currentLanguage = ref('en')
  const languages = ref([
    { id: 2, code: 'tr', name: 'Türkçe', flag: 'tr', status: true },
    { id: 6, code: 'de', name: 'Deutsch', flag: 'de', status: true },
    { id: 1, code: 'en', name: 'English', flag: 'gb', status: true },
    { id: 3, code: 'ar', name: 'العربية', flag: 'sa', status: true }
  ])

  // Getters
  const getCurrentLanguage = computed(() => currentLanguage.value)
  const getCurrentLanguageId = computed(() => {
    const lang = languages.value.find(l => l.code === currentLanguage.value)
    return lang ? lang.id : 1
  })
  const getAvailableLanguages = computed(() => languages.value.filter(l => l.status))

  // Actions
  const setLanguage = (langCode) => {
    const lang = languages.value.find(l => l.code === langCode && l.status)
    if (lang) {
      currentLanguage.value = langCode
      localStorage.setItem('selectedLanguage', langCode)
      
      // Dispatch global event
      window.dispatchEvent(new CustomEvent('language-changed', {
        detail: { language: langCode }
      }))
      
      return true
    }
    return false
  }

  const initializeLanguage = () => {
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    } else {
      // Default to English
      currentLanguage.value = 'en'
    }
  }

  const getLanguageId = (langCode) => {
    const languageMap = {
      'tr': 2,    // Türkçe
      'de': 6,    // Deutsch
      'en': 1,    // English
      'ar': 3     // العربية
    }
    return languageMap[langCode] || 1
  }

  return {
    // State
    currentLanguage,
    languages,
    
    // Getters
    getCurrentLanguage,
    getCurrentLanguageId,
    getAvailableLanguages,
    
    // Actions
    setLanguage,
    initializeLanguage,
    getLanguageId
  }
})
