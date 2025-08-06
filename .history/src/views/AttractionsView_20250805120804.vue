<template>
  <div class="attractions">
    <section class="hero-section">
      <div class="container">
        <h1>Istanbul Attractions & Tours - Discover Top Cultural Sites</h1>
        <h2>Explore Hagia Sophia, Topkapi Palace, Basilica Cistern & More</h2>
        <p>Discover the most popular attractions and guided tours included in your Istanbul Tourist Pass. Visit iconic landmarks and hidden gems with expert guides.</p>
      </div>
    </section>

    <section class="attractions-list">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading Istanbul attractions...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="fetchAttractions" class="btn btn-primary">Try Again</button>
        </div>

        <!-- Attractions Grid -->
        <div v-else class="attractions-grid">
          <router-link
            v-for="attraction in attractions"
            :key="attraction.id"
            :to="`/tour/${attraction.id}`"
            class="attraction-card"
            style="text-decoration: none; color: inherit; display: block; height: 100%;"
          >
            <div class="attraction-image">
              <img :src="getAttractionImage(attraction)" :alt="getAttractionName(attraction)">
            </div>
            <div class="attraction-content">
              <h3>{{ getAttractionName(attraction) }}</h3>
              <p>{{ getAttractionDescription(attraction) }}</p>
              <div class="attraction-meta">
                <span class="price">{{ getAttractionPrice(attraction) }}</span>
                <span class="duration">
                  <i class="fas fa-clock"></i>
                  {{ getAttractionDuration(attraction) }}
                </span>
              </div>
              <div class="attraction-actions">
                <router-link @click.stop :to="`/tour/${attraction.id}`" class="btn btn-primary">View</router-link>
                <button @click.stop="addToWishlist(attraction.id)" class="btn btn-secondary">
                  <i class="fas fa-heart"></i>
                </button>
              </div>
            </div>
          </router-link>
        </div>

        <!-- No Results -->
        <div v-if="!loading && !error && attractions.length === 0" class="no-results">
          <p>No Istanbul attractions found at the moment.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'

const attractions = ref([])
const loading = ref(false)
const error = ref(null)
const currentLanguage = ref('en')
const currentCurrency = computed(() => {
  const savedCurrency = localStorage.getItem('selectedCurrency') || 'EUR'
  return getCurrencyId(savedCurrency)
})

// Fetch Istanbul attractions from API with language and currency parameters
const fetchAttractions = async () => {
  loading.value = true
  error.value = null
  
  try {
    const url = `https://searchyourtour.com/api/tours?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1&language_id=${getLanguageId(currentLanguage.value)}&currency_id=${currentCurrency.value}&limit=200&IpAdrress=78.177.166.135`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch attractions')
    }
    
    const data = await response.json()
    
    // Filter for Istanbul tours (destination_id: 404) and active tours with content
    const istanbulTours = (data || []).filter(tour => {
      return tour.destination?.id === 404 && 
             tour.is_active === true
    })
    console.log(istanbulTours)
    attractions.value = istanbulTours
  } catch (err) {
    error.value = 'Failed to load attractions. Please try again later.'
    console.error('Error fetching attractions:', err)
  } finally {
    loading.value = false
  }
}

// Helper function to get language ID from language code
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

// Helper function to get currency ID from currency code
const getCurrencyId = (currencyCode) => {
  const currencyMap = {
    'EUR': 4,
    'USD': 5,
    'GBP': 6,
    'TRY': 7
  }
  return currencyMap[currencyCode] || 4
}

// Helper functions to extract data from API response
const getAttractionName = (attraction) => {
  return attraction.content?.[0]?.name || 'Unnamed Attraction'
}

const getAttractionDescription = (attraction) => {
  const metaContent = attraction.content?.[0]?.meta_content
  if (!metaContent) return 'No description available'
  
  // Remove HTML tags and extract plain text
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = metaContent
  const text = tempDiv.textContent || tempDiv.innerText || ''
  return text.length > 120 ? text.substring(0, 120) + '...' : text
}

const getAttractionImage = (attraction) => {
  return attraction.files?.[0]?.url || 'https://via.placeholder.com/300x200?text=Istanbul+Attraction'
}

const getAttractionPrice = (attraction) => {
  const price = attraction.tour_price?.[0]
  if (!price) return 'CALL'
  
  const currency = price.currency_icon || '$'
  return `${currency}${price.price}`
}

const getAttractionDuration = (attraction) => {
  const duration = attraction.tour_duraction
  const type = attraction.tour_duraction_type
  
  if (!duration) return 'Duration not specified'
  
  if (type === 'hour') {
    return `${duration} ${duration === 1 ? 'Hr' : 'Hr'}`
  } else if (type === 'day') {
    return `${duration} ${duration === 1 ? 'Day' : 'Day'}`
  } else if (type === 'week') {
    return `${duration} ${duration === 1 ? 'Week' : 'Week'}`
  } else if (type === 'month') {
    return `${duration} ${duration === 1 ? 'Month' : 'Month'}`
  } else if (type === 'minutes' || type === 'minute' || type === 'min') {
    return `${duration} Min`
  }
  
  return `${duration} ${type}s`
}

// Methods
const addToWishlist = (attractionId) => {
  console.log('Adding attraction to wishlist:', attractionId)
  // Implement wishlist functionality
}

// Watch for language changes
const updateLanguage = (newLanguage) => {
  currentLanguage.value = newLanguage
  fetchAttractions() // Refetch attractions with new language
}

// Expose method for parent components
defineExpose({
  updateLanguage
})

// Listen for currency change events
const handleCurrencyChange = (event) => {
  if (event.detail && event.detail.currency) {
    console.log('AttractionsView: Currency changed to:', event.detail.currency, 'ID:', event.detail.currencyId)
    fetchAttractions() // Refetch attractions with new currency
  }
}

// Lifecycle
onMounted(() => {
  // Add event listener for currency changes
  window.addEventListener('currency-changed', handleCurrencyChange)
  // Get language from localStorage or default to English
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'
  currentLanguage.value = savedLanguage
  
  fetchAttractions()
})

onBeforeUnmount(() => {
  // Remove event listener
  window.removeEventListener('currency-changed', handleCurrencyChange)
})

// Watch for language changes in localStorage
watch(() => localStorage.getItem('selectedLanguage'), (newLanguage) => {
  if (newLanguage && newLanguage !== currentLanguage.value) {
    currentLanguage.value = newLanguage
    fetchAttractions()
  }
})
</script>

<style scoped>
.attractions {
  min-height: 100vh;
}

.hero-section {
  background: #FC6421;
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.attractions-list {
  padding: 4rem 0;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #fc6421;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 4rem 0;
  color: #fc6421;
}

.error-state p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 0;
  color: #666;
}

.attractions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.attraction-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.attraction-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.attraction-image img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.attraction-content {
  padding: 1.5rem;
}

.attraction-content h3 {
  margin-bottom: 0.75rem;
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
}

.attraction-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.attraction-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.75rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.price {
  color: #fc6421;
  font-weight: 600;
  font-size: 1.1rem;
}

.duration {
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.attraction-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #fc6421;
  color: white;
  flex: 1;
}

.btn-primary:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  padding: 0.75rem;
  min-width: 44px;
}

.btn-secondary:hover {
  background: #e9ecef;
  color: #fc6421;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  .attractions-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 0.5rem;
  }
  .attraction-card {
    width: auto;
    max-width: 100%;
    height: auto;
    border-radius: 20px;
    box-shadow: 0 4px 18px rgba(44,62,80,0.10);
    margin: 0.5rem 0.1rem 1rem 0.1rem;
    padding: 0.7rem 0.5rem 0.7rem 0.5rem;
    background: #fff;
    border: 1.5px solid #f2f2f2;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .attraction-image img {
    width: 100%;
    height: 90px;
    object-fit: cover;
    border-radius: 16px 16px 0 0;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 8px rgba(44,62,80,0.07);
  }
  .attraction-content {
    padding: 0.1rem 0.1rem 0 0.1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .attraction-content h3 {
    font-size: 1.09rem;
    font-weight: 800;
    margin-bottom: 0.18rem;
    color: #222;
    line-height: 1.18;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 2.2em;
  }
  .attraction-content p {
    color: #8a8a8a;
    font-size: 0.91rem;
    line-height: 1.3;
    margin-bottom: 0.35rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 2.3em;
  }
  .attraction-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.4rem;
    padding: 0.2rem 0;
    border: none;
    font-size: 0.97rem;
    gap: 0.5rem;
  }
  .price {
    color: #FC6421;
    font-weight: 800;
    font-size: 1.04rem;
    letter-spacing: 0.01em;
  }
  .duration {
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.97rem;
    font-weight: 500;
  }
  .attraction-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: auto;
  }
  .attraction-actions .btn-primary {
    width: 100%;
    font-size: 1.08rem;
    border-radius: 12px;
    margin-top: 0.2rem;
    font-weight: 700;
    letter-spacing: 0.01em;
  }
  .attraction-actions .btn-secondary {
    width: 100%;
    font-size: 1.08rem;
    padding: 0.8rem 0;
    border-radius: 12px;
    margin-top: 0.2rem;
    background: #f7f7f7;
    color: #FC6421;
    font-weight: 700;
  }
  /* Kart altı buton ve favori hizası */
  .attraction-actions {
    display: grid;
    grid-template-columns: 3fr 1fr;
    flex-direction: row;
    gap: 0.7rem;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.7rem;
  }
  .attraction-actions .btn-primary, .attraction-actions .btn-secondary {
    flex: 1 1 60%;
    min-width: 0;
  }
}
</style> 