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
              <div class="tour-badge" v-if="tour.is_active">Active</div>
            </div>
            <div class="tour-content">
              <div class="tour-meta">
                <span class="category">{{ getDestinationName(tour) }}</span>
                <span class="duration">
                  <i class="fas fa-clock"></i>
                  {{ tour.tour_duraction }} {{ tour.tour_duraction_type }}{{ tour.tour_duraction > 1 ? 's' : '' }}
                </span>
              </div>
              <h3 class="tour-title">{{ getTourName(tour) }}</h3>
              <p class="tour-description">{{ getTourDescription(tour) }}</p>
              <div class="tour-features">
                <span v-for="service in tour.tour_include_service?.slice(0, 3)" :key="service.id" class="feature">
                  <i class="fas fa-check"></i>
                  {{ service.include_service }}
                </span>
              </div>
              <div class="tour-footer">
                <div class="tour-rating">
                  <i class="fas fa-star"></i>
                  <span>4.5</span>
                  <span class="review-count">(New)</span>
                </div>
                <div class="tour-price">
                  <span class="price">{{ getTourPrice(tour) }}</span>
                  <span class="price-note">per person</span>
                </div>
              </div>
              <div class="tour-actions">
                <router-link :to="`/tour/${tour.id}`" class="btn btn-primary">
                  View Details
                </router-link>
                <button class="btn btn-secondary" @click="addToWishlist(tour.id)">
                  <i class="fas fa-heart"></i>
                </button>
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
import { ref, computed, onMounted } from 'vue'

const selectedDestination = ref('')
const selectedDuration = ref('')
const tours = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch tours from API
const fetchTours = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('https://searchyourtour.com/api/allTours')
    if (!response.ok) {
      throw new Error('Failed to fetch tours')
    }
    
    const data = await response.json()
    tours.value = data.data || []
  } catch (err) {
    error.value = 'Failed to load tours. Please try again later.'
    console.error('Error fetching tours:', err)
  } finally {
    loading.value = false
  }
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
  
  const currency = price.currency?.icon || '€'
  return `${currency}${price.price}`
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

// Lifecycle
onMounted(() => {
  fetchTours()
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
  color: #333;
  margin: 0;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #e74c3c;
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

.no-results p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

/* Tours Grid */
.tours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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
  transform: translateY(-5px);
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

.tour-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #27ae60;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.tour-content {
  padding: 1.5rem;
}

.tour-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.category {
  background: #f8f9fa;
  color: #666;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.duration {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.tour-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.tour-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.tour-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  font-size: 0.9rem;
}

.feature i {
  color: #27ae60;
  font-size: 0.8rem;
}

.tour-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.tour-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f39c12;
  font-weight: 600;
}

.review-count {
  color: #666;
  font-weight: normal;
}

.tour-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e74c3c;
}

.price-note {
  font-size: 0.8rem;
  color: #999;
}

.tour-actions {
  display: flex;
  gap: 1rem;
}

.tour-actions .btn {
  flex: 1;
  text-align: center;
  padding: 0.75rem 1rem;
}

.tour-actions .btn-secondary {
  flex: 0 0 auto;
  width: 50px;
  padding: 0.75rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .tours-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filters {
    width: 100%;
    flex-direction: column;
  }
  
  .tours-grid {
    grid-template-columns: 1fr;
  }
  
  .tour-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .tour-actions {
    flex-direction: column;
  }
}
</style> 