import { ref, computed } from 'vue'

export const useCurrencyStore = () => {
  const currencies = ref([])
  const loading = ref(false)
  const error = ref(null)
  // Reaktif current currency
  const currentCurrencyCode = ref(localStorage.getItem('selectedCurrency') || 'EUR')

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

  // Get current currency from reactive ref
  const getCurrentCurrency = () => {
    return currentCurrencyCode.value
  }

  // Set current currency in localStorage and reactive ref
  const setCurrentCurrency = (currencyCode) => {
    localStorage.setItem('selectedCurrency', currencyCode)
    currentCurrencyCode.value = currencyCode
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
    
    // Eğer hedef para birimi EUR ise, direkt döndür
    if (targetCurrencyCode === 'EUR') {
      return parseFloat(priceInEUR).toString()
    }
    
    // API'den gelen currency oranları TRY bazında
    // EUR=37.4671, USD=35.125, GBP=41.135, TRY=1
    // Bu oranlar 1 TRY = X USD/EUR/GBP şeklinde
    // Yani 1 EUR = 37.4671 TRY, 1 USD = 35.125 TRY
    
    const eurCurrency = getCurrencyByCode('EUR')
    if (!eurCurrency) return priceInEUR
    
    // EUR'dan TRY'ye çevir: 1 EUR = 37.4671 TRY
    const priceInTRY = parseFloat(priceInEUR) * parseFloat(eurCurrency.price)
    
    // TRY'den hedef para birimine çevir
    const convertedPrice = priceInTRY / parseFloat(targetCurrency.price)
    
    console.log(`Currency conversion: ${priceInEUR} EUR = ${priceInTRY} TRY = ${convertedPrice} ${targetCurrencyCode}`)
    
    return convertedPrice.toString()
  }

  // Convert price from any currency to EUR
  const convertToEUR = (price, fromCurrencyCode) => {
    if (!price || !fromCurrencyCode) return price
    
    const fromCurrency = getCurrencyByCode(fromCurrencyCode)
    if (!fromCurrency) return price
    
    // Convert to EUR using currency rates
    const eurCurrency = getCurrencyByCode('EUR')
    if (!eurCurrency) return price
    
    // Önce TRY'ye çevir, sonra EUR'ya çevir
    const priceInTRY = parseFloat(price) * parseFloat(fromCurrency.price)
    const convertedPrice = priceInTRY / parseFloat(eurCurrency.price)
    // Tam hassasiyet döndür
    return convertedPrice.toString()
  }

  // Format price with currency symbol for display (2 decimal places)
  const formatPrice = (price, currencyCode) => {
    if (!price) return ''
    
    const currency = getCurrencyByCode(currencyCode)
    if (!currency) return `${price}`
    
    // Önyüzde gösterim için 2 basamak
    const displayPrice = parseFloat(price).toFixed(2)
    return `${currency.icon}${displayPrice}`
  }

  // Format price with full precision for payment processing
  const formatPriceForPayment = (price, currencyCode) => {
    if (!price) return ''
    
    const currency = getCurrencyByCode(currencyCode)
    if (!currency) return `${price}`
    
    // Ödeme için tam hassasiyet
    return `${currency.icon}${price}`
  }

  // Get current currency info
  const currentCurrency = computed(() => {
    return getCurrencyByCode(currentCurrencyCode.value)
  })

  return {
    currencies,
    loading,
    error,
    fetchCurrencies,
    getCurrentCurrency,
    setCurrentCurrency,
    getCurrencyByCode,
    getCurrencyById,
    convertPrice,
    convertToEUR,
    formatPrice,
    formatPriceForPayment,
    currentCurrency
  }
} 