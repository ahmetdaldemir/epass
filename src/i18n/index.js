import { createI18n } from 'vue-i18n'
import en from '../locales/en.js'
import tr from '../locales/tr.js'
import de from '../locales/de.js'
import ar from '../locales/ar.js'

const messages = {
  en,
  tr,
  de,
  ar
}

// RTL diller için
const rtlLanguages = ['ar']

export default createI18n({
  legacy: false, // Vue 3 Composition API için
  locale: localStorage.getItem('selectedLanguage') || 'en',
  fallbackLocale: 'en',
  messages,
  
  // RTL desteği
  globalProperties: {
    $isRTL: (locale) => rtlLanguages.includes(locale)
  }
})

// RTL kontrolü için yardımcı fonksiyon
export const isRTL = (locale) => rtlLanguages.includes(locale)

// Dil değişikliği için yardımcı fonksiyon
export const setLanguage = (i18n, locale) => {
  i18n.global.locale.value = locale
  localStorage.setItem('selectedLanguage', locale)
  
  // RTL desteği
  document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr'
  document.documentElement.lang = locale
  
  // Global event dispatch
  window.dispatchEvent(new CustomEvent('language-changed', {
    detail: { language: locale }
  }))
}
