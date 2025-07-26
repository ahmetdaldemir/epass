import { ref, computed } from 'vue'

export const useCurrencyStore = () => {
  const currencies = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch currencies from API
  const fetchCurrencies = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('https://searchyourtour.com/api/currencies?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1')
      if (!response.ok) {
        throw new Error('Failed to fetch currencies')
      }
      
      const data = await response.json()
      currencies.value = data || []
    } catch (err) {
      error.value = 'Failed to load currencies'
      console.error('Error fetching currencies:', err)
    } finally {
      loading.value = false
    }
  }

  // Get current currency from localStorage
  const getCurrentCurrency = () => {
    return localStorage.getItem('selectedCurrency') || 'EUR'
  }

  // Get currency by code
  const getCurrencyByCode = (code) => {
    return currencies.value.find(c => c.currency === code)
  }

  // Get currency by ID
  const getCurrencyById = (id) => {
    return currencies.value.find(c => c.id === id)
  }

  // Convert price from EUR to target currency
  const convertPrice = (priceInEUR, targetCurrencyCode) => {
    if (!priceInEUR || !targetCurrencyCode) return priceInEUR
    
    const targetCurrency = getCurrencyByCode(targetCurrencyCode)
    if (!targetCurrency) return priceInEUR
    
    // EUR is base currency (price = 37.4671), so we multiply by target currency price and divide by EUR price
    const eurCurrency = getCurrencyByCode('EUR')
    if (!eurCurrency) return priceInEUR
    
    const convertedPrice = (parseFloat(priceInEUR) * parseFloat(targetCurrency.price)) / parseFloat(eurCurrency.price)
    return convertedPrice.toFixed(2)
  }

  // Convert price from any currency to TRY
  const convertToTRY = (price, fromCurrencyCode) => {
    if (!price || !fromCurrencyCode) return price
    
    const fromCurrency = getCurrencyByCode(fromCurrencyCode)
    if (!fromCurrency) return price
    
    // Multiply by the currency price to get TRY value
    return (parseFloat(price) * parseFloat(fromCurrency.price)).toFixed(2)
  }

  // Format price with currency symbol
  const formatPrice = (price, currencyCode) => {
    if (!price) return ''
    
    const currency = getCurrencyByCode(currencyCode)
    if (!currency) return `${price}`
    
    return `${currency.icon}${price}`
  }

  // Get current currency info
  const currentCurrency = computed(() => {
    const code = getCurrentCurrency()
    return getCurrencyByCode(code)
  })

  return {
    currencies,
    loading,
    error,
    fetchCurrencies,
    getCurrentCurrency,
    getCurrencyByCode,
    getCurrencyById,
    convertPrice,
    convertToTRY,
    formatPrice,
    currentCurrency
  }
} 