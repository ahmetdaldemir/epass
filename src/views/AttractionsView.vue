<template>
  <div class="attractions">
    <section class="hero-section">
      <div class="container">
        <h1>Istanbul Attractions</h1>
        <p>Discover the most popular attractions and tours included in your pass</p>
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
          <div class="attraction-card" v-for="attraction in attractions" :key="attraction.id">
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
                <router-link :to="`/tour/${attraction.id}`" class="btn btn-primary">View Details</router-link>
                <button @click="addToWishlist(attraction.id)" class="btn btn-secondary">
                  <i class="fas fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
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
import { ref, onMounted, watch } from 'vue'

const attractions = ref([])
const loading = ref(false)
const error = ref(null)
const currentLanguage = ref('en')
const currentCurrency = ref(5) // USD

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
    'en': 1,
    'tr': 2,
    'de': 6,
    'ru': 9
  }
  return languageMap[langCode] || 1
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
  if (!price) return 'FREE with Pass'
  
  const currency = price.currency_icon || '$'
  return `${currency}${price.price}`
}

const getAttractionDuration = (attraction) => {
  const duration = attraction.tour_duraction
  const type = attraction.tour_duraction_type || 'hour'
  
  if (!duration) return 'Duration not specified'
  
  if (type === 'hour') {
    return `${duration} ${duration === 1 ? 'Hour' : 'Hours'}`
  } else if (type === 'day') {
    return `${duration} ${duration === 1 ? 'Day' : 'Days'}`
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

// Lifecycle
onMounted(() => {
  // Get language from localStorage or default to English
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'
  currentLanguage.value = savedLanguage
  
  fetchAttractions()
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  border-top: 4px solid #e74c3c;
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
  color: #e74c3c;
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
  color: #e74c3c;
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
  background: #e74c3c;
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
  color: #e74c3c;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .attractions-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .attraction-meta {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .attraction-actions {
    flex-direction: column;
  }
  
  .btn-secondary {
    align-self: flex-end;
  }
}
</style> 