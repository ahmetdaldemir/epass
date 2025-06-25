<template>
  <div class="tours">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Discover Istanbul with Our Guided Tours</h1>
          <p class="hero-subtitle">Explore the city's rich history and culture with our expert guides</p>
        </div>
      </div>
    </section>

    <!-- Tours Grid -->
    <section class="tours-section">
      <div class="container">
        <div class="tours-header">
          <h2>Available Tours</h2>
          <div class="filters">
            <select v-model="selectedDestination" class="filter-select">
              <option value="">All Destinations</option>
              <option v-for="destination in uniqueDestinations" :key="destination" :value="destination">
                {{ destination }}
              </option>
            </select>
            <select v-model="selectedDuration" class="filter-select">
              <option value="">All Durations</option>
              <option value="1-3">1-3 Hours</option>
              <option value="4-6">4-6 Hours</option>
              <option value="7+">7+ Hours</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading tours...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="fetchTours" class="btn btn-primary">Try Again</button>
        </div>

        <!-- Tours Grid -->
        <div v-else class="tours-grid">
          <div class="tour-card" v-for="tour in filteredTours" :key="tour.id">
            <div class="tour-image">
              <img :src="getTourImage(tour)" :alt="getTourName(tour)">
              <div class="tour-overlay">
                <button @click="addToWishlist(tour.id)" class="wishlist-btn">
                  <i class="fas fa-heart"></i>
                </button>
              </div>
            </div>
            <div class="tour-content">
              <h3>{{ getTourName(tour) }}</h3>
              <p>{{ getTourDescription(tour) }}</p>
              <div class="tour-meta">
                <span class="destination">
                  <i class="fas fa-map-marker-alt"></i>
                  {{ getDestinationName(tour) }}
                </span>
                <span class="duration">
                  <i class="fas fa-clock"></i>
                  {{ getTourDuration(tour) }}
                </span>
              </div>
              <div class="tour-footer">
                <div class="tour-price">{{ getTourPrice(tour) }}</div>
                <router-link :to="`/tour/${tour.id}`" class="btn btn-primary">View Details</router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="!loading && !error && filteredTours.length === 0" class="no-results">
          <p>No tours found matching your criteria.</p>
          <button @click="clearFilters" class="btn btn-primary">Clear Filters</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const selectedDestination = ref('')
const selectedDuration = ref('')
const tours = ref([])
const loading = ref(false)
const error = ref(null)
const currentLanguage = ref('en')
const currentCurrency = ref(5) // USD

// Fetch tours from API with language and currency parameters
const fetchTours = async () => {
  loading.value = true
  error.value = null
  
  try {
    const url = `https://searchyourtour.com/api/tours?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1&language_id=${getLanguageId(currentLanguage.value)}&currency_id=${currentCurrency.value}&limit=100&IpAdrress=78.177.166.135`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch tours')
    }
    
    const data = await response.json()
    tours.value = data || []
  } catch (err) {
    error.value = 'Failed to load tours. Please try again later.'
    console.error('Error fetching tours:', err)
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
const getTourName = (tour) => {
  return tour.content?.[0]?.name || 'Unnamed Tour'
}

const getTourDescription = (tour) => {
  const metaContent = tour.content?.[0]?.meta_content
  if (!metaContent) return 'No description available'
  
  // Remove HTML tags and extract plain text
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = metaContent
  const text = tempDiv.textContent || tempDiv.innerText || ''
  return text.length > 150 ? text.substring(0, 150) + '...' : text
}

const getTourImage = (tour) => {
  return tour.files?.[0]?.url || 'https://via.placeholder.com/400x250?text=No+Image'
}

const getDestinationName = (tour) => {
  return tour.destination?.name || 'Unknown Destination'
}

const getTourPrice = (tour) => {
  const price = tour.tour_price?.[0]
  if (!price) return 'Price on request'
  
  const currency = price.currency_icon || '$'
  return `${currency}${price.price}`
}

const getTourDuration = (tour) => {
  const duration = tour.tour_duraction
  const type = tour.tour_duraction_type || 'hour'
  
  if (!duration) return 'Duration not specified'
  
  if (type === 'hour') {
    return `${duration} ${duration === 1 ? 'Hour' : 'Hours'}`
  } else if (type === 'day') {
    return `${duration} ${duration === 1 ? 'Day' : 'Days'}`
  }
  
  return `${duration} ${type}s`
}

// Computed properties
const uniqueDestinations = computed(() => {
  const destinations = tours.value.map(tour => tour.destination?.name).filter(Boolean)
  return [...new Set(destinations)]
})

const filteredTours = computed(() => {
  return tours.value.filter(tour => {
    const destinationMatch = !selectedDestination.value || 
      tour.destination?.name === selectedDestination.value
    
    const durationMatch = !selectedDuration.value || 
      (() => {
        const duration = tour.tour_duraction
        switch (selectedDuration.value) {
          case '1-3': return duration >= 1 && duration <= 3
          case '4-6': return duration >= 4 && duration <= 6
          case '7+': return duration >= 7
          default: return true
        }
      })()
    
    return destinationMatch && durationMatch
  })
})

// Methods
const addToWishlist = (tourId) => {
  console.log('Adding tour to wishlist:', tourId)
  // Implement wishlist functionality
}

const clearFilters = () => {
  selectedDestination.value = ''
  selectedDuration.value = ''
}

// Watch for language changes
const updateLanguage = (newLanguage) => {
  currentLanguage.value = newLanguage
  fetchTours() // Refetch tours with new language
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
  
  fetchTours()
})

// Watch for language changes in localStorage
watch(() => localStorage.getItem('selectedLanguage'), (newLanguage) => {
  if (newLanguage && newLanguage !== currentLanguage.value) {
    currentLanguage.value = newLanguage
    fetchTours()
  }
})
</script>

<style scoped>
.tours {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Tours Section */
.tours-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.tours-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.tours-header h2 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 1rem;
  min-width: 150px;
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

/* Tours Grid */
.tours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.tour-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tour-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.tour-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.tour-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.tour-card:hover .tour-image img {
  transform: scale(1.05);
}

.tour-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.wishlist-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.wishlist-btn:hover {
  background: white;
  transform: scale(1.1);
}

.tour-content {
  padding: 1.5rem;
}

.tour-content h3 {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  color: #2c3e50;
  font-weight: 600;
}

.tour-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.tour-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.tour-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tour-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.tour-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e74c3c;
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
}

.btn-primary:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 0;
  color: #666;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .tours-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters {
    justify-content: center;
  }
  
  .tours-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .tour-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .tour-price {
    text-align: center;
  }
}
</style> 