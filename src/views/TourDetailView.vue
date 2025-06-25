<template>
  <div class="tour-detail">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading tour details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchTourData" class="btn btn-primary">Try Again</button>
    </div>

    <!-- Tour Content -->
    <div v-else-if="tour">
      <!-- Hero Section -->
      <section class="tour-hero">
        <div class="container">
          <div class="tour-hero-content">
            <div class="tour-images">
              <div class="main-image">
                <img :src="getTourImage(tour)" :alt="getTourName(tour)">
              </div>
              <div class="image-gallery" v-if="tour.files && tour.files.length > 1">
                <div class="gallery-item" v-for="(file, index) in tour.files.slice(1, 5)" :key="file.id">
                  <img :src="file.url" :alt="`${getTourName(tour)} - Image ${index + 2}`">
                </div>
              </div>
            </div>
            <div class="tour-info">
              <nav class="breadcrumb">
                <router-link to="/">Home</router-link>
                <span>/</span>
                <router-link to="/tours">Tours</router-link>
                <span>/</span>
                <span>{{ getTourName(tour) }}</span>
              </nav>
              <h1 class="tour-title">{{ getTourName(tour) }}</h1>
              <div class="tour-meta">
                <div class="rating">
                  <i class="fas fa-star"></i>
                  <span>4.5</span>
                  <span class="review-count">(New)</span>
                </div>
                <div class="duration">
                  <i class="fas fa-clock"></i>
                  <span>{{ tour.tour_duraction }} {{ tour.tour_duraction_type }}{{ tour.tour_duraction > 1 ? 's' : '' }}</span>
                </div>
                <div class="destination">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ getDestinationName(tour) }}</span>
                </div>
              </div>
              <div class="tour-description">
                <p>{{ getTourDescription(tour) }}</p>
              </div>
              <div class="tour-highlights" v-if="tour.tour_include_service && tour.tour_include_service.length > 0">
                <h3>Highlights</h3>
                <ul>
                  <li v-for="service in tour.tour_include_service.slice(0, 5)" :key="service.id">
                    {{ service.include_service }}
                  </li>
                </ul>
              </div>
              <div class="tour-price-section">
                <div class="price-info">
                  <div class="price">
                    <span class="current-price">{{ getTourPrice(tour) }}</span>
                  </div>
                  <div class="price-per-person">per person</div>
                </div>
                <div class="tour-actions">
                  <button class="btn btn-primary book-btn" @click="bookTour">
                    <i class="fas fa-calendar-check"></i>
                    Book Now
                  </button>
                  <button class="btn btn-secondary" @click="addToWishlist">
                    <i class="fas fa-heart"></i>
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tour Details Tabs -->
      <section class="tour-details">
        <div class="container">
          <div class="tabs">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'overview' }"
              @click="activeTab = 'overview'"
            >
              Overview
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'inclusions' }"
              @click="activeTab = 'inclusions'"
            >
              What's Included
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'additional' }"
              @click="activeTab = 'additional'"
            >
              Additional Info
            </button>
          </div>

          <div class="tab-content">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="tab-panel">
              <div class="overview-content">
                <div class="overview-text">
                  <h3>About This Tour</h3>
                  <div v-html="getTourFullDescription(tour)"></div>
                </div>
                
                <div class="overview-sidebar">
                  <div class="info-card">
                    <h4>Tour Information</h4>
                    <div class="info-item">
                      <i class="fas fa-map-marker-alt"></i>
                      <span>Destination: {{ getDestinationName(tour) }}</span>
                    </div>
                    <div class="info-item">
                      <i class="fas fa-clock"></i>
                      <span>Duration: {{ tour.tour_duraction }} {{ tour.tour_duraction_type }}{{ tour.tour_duraction > 1 ? 's' : '' }}</span>
                    </div>
                    <div class="info-item">
                      <i class="fas fa-users"></i>
                      <span>Max Group Size: {{ tour.pax || 'Not specified' }}</span>
                    </div>
                    <div class="info-item">
                      <i class="fas fa-calendar"></i>
                      <span>Available Days: {{ getAvailableDays(tour) }}</span>
                    </div>
                    <div class="info-item" v-if="tour.min_age">
                      <i class="fas fa-child"></i>
                      <span>Minimum Age: {{ tour.min_age }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Inclusions Tab -->
            <div v-if="activeTab === 'inclusions'" class="tab-panel">
              <div class="inclusions-grid">
                <div class="inclusions-section" v-if="tour.tour_include_service && tour.tour_include_service.length > 0">
                  <h3>What's Included</h3>
                  <ul class="inclusions-list">
                    <li v-for="service in tour.tour_include_service" :key="service.id">
                      <i class="fas fa-check"></i>
                      {{ service.include_service }}
                    </li>
                  </ul>
                </div>
                <div class="inclusions-section" v-if="tour.tour_outside_service && tour.tour_outside_service.length > 0">
                  <h3>Not Included</h3>
                  <ul class="exclusions-list">
                    <li v-for="service in tour.tour_outside_service" :key="service.id">
                      <i class="fas fa-times"></i>
                      {{ service.outside_service }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Additional Info Tab -->
            <div v-if="activeTab === 'additional'" class="tab-panel">
              <div class="additional-info">
                <div class="info-section">
                  <h3>Tour Details</h3>
                  <div class="detail-item">
                    <strong>Tour Code:</strong> {{ tour.code }}
                  </div>
                  <div class="detail-item">
                    <strong>Duration Type:</strong> {{ tour.tour_duraction_type }}
                  </div>
                  <div class="detail-item">
                    <strong>Status:</strong> 
                    <span :class="tour.is_active ? 'status-active' : 'status-inactive'">
                      {{ tour.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <div class="detail-item" v-if="tour.ask_for_price">
                    <strong>Pricing:</strong> Price on request
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref('overview')
const tour = ref(null)
const loading = ref(false)
const error = ref(null)

// Fetch tour data from API
const fetchTourData = async () => {
  const tourId = route.params.id
  if (!tourId) {
    error.value = 'Tour ID not found'
    return
  }

  loading.value = true
  error.value = null
  
  try {
    const response = await fetch(`https://searchyourtour.com/api/allTours`)
    if (!response.ok) {
      throw new Error('Failed to fetch tour data')
    }
    
    const data = await response.json()
    const foundTour = data.data?.find(t => t.id.toString() === tourId)
    
    if (!foundTour) {
      throw new Error('Tour not found')
    }
    
    tour.value = foundTour
  } catch (err) {
    error.value = 'Failed to load tour details. Please try again later.'
    console.error('Error fetching tour:', err)
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
  return text.length > 200 ? text.substring(0, 200) + '...' : text
}

const getTourFullDescription = (tour) => {
  return tour.content?.[0]?.description || 'No detailed description available'
}

const getTourImage = (tour) => {
  return tour.files?.[0]?.url || 'https://via.placeholder.com/800x500?text=No+Image'
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

const getAvailableDays = (tour) => {
  if (!tour.days || tour.days.length === 0) return 'Not specified'
  
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return tour.days.map(day => dayNames[day - 1]).join(', ')
}

// Methods
const bookTour = () => {
  console.log('Booking tour:', tour.value.id)
  // Implement booking logic
}

const addToWishlist = () => {
  console.log('Adding to wishlist:', tour.value.id)
  // Implement wishlist logic
}

// Lifecycle
onMounted(() => {
  fetchTourData()
})
</script>

<style scoped>
.tour-detail {
  min-height: 100vh;
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

/* Hero Section */
.tour-hero {
  background: #f8f9fa;
  padding: 2rem 0;
}

.tour-hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.tour-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.gallery-item img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.gallery-item img:hover {
  opacity: 0.8;
}

.tour-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.breadcrumb a {
  color: #e74c3c;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.tour-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.tour-meta {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.tour-meta > div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.rating {
  color: #f39c12;
  font-weight: 600;
}

.review-count {
  color: #666;
  font-weight: normal;
}

.tour-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
}

.tour-highlights h3 {
  margin-bottom: 1rem;
  color: #333;
}

.tour-highlights ul {
  list-style: none;
  padding: 0;
}

.tour-highlights li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.tour-highlights li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #27ae60;
  font-weight: bold;
}

.tour-price-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.price-info {
  margin-bottom: 1.5rem;
}

.price {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #e74c3c;
}

.price-per-person {
  color: #666;
  font-size: 0.9rem;
}

.tour-actions {
  display: flex;
  gap: 1rem;
}

.book-btn {
  flex: 1;
  padding: 1rem;
  font-size: 1.1rem;
}

/* Tabs */
.tour-details {
  padding: 3rem 0;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #eee;
  margin-bottom: 2rem;
}

.tab-btn {
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: #e74c3c;
}

.tab-btn.active {
  color: #e74c3c;
  border-bottom-color: #e74c3c;
}

.tab-panel {
  min-height: 400px;
}

/* Overview Tab */
.overview-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.overview-text h3 {
  margin-bottom: 1rem;
  color: #333;
}

.overview-text :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #555;
}

.overview-text :deep(h2) {
  margin: 2rem 0 1rem;
  color: #333;
  font-size: 1.5rem;
}

.overview-text :deep(h3) {
  margin: 1.5rem 0 1rem;
  color: #333;
  font-size: 1.2rem;
}

.overview-text :deep(ul) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.overview-text :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.overview-sidebar {
  position: sticky;
  top: 2rem;
}

.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.info-card h4 {
  margin-bottom: 1rem;
  color: #333;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: #666;
}

.info-item i {
  color: #e74c3c;
  width: 20px;
}

/* Inclusions Tab */
.inclusions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.inclusions-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.inclusions-list,
.exclusions-list {
  list-style: none;
  padding: 0;
}

.inclusions-list li,
.exclusions-list li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.inclusions-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #27ae60;
  font-weight: bold;
}

.exclusions-list li::before {
  content: '✗';
  position: absolute;
  left: 0;
  color: #e74c3c;
  font-weight: bold;
}

/* Additional Info Tab */
.additional-info {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.info-section h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.detail-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item strong {
  color: #333;
}

.status-active {
  color: #27ae60;
  font-weight: 600;
}

.status-inactive {
  color: #e74c3c;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tour-hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .tour-title {
    font-size: 2rem;
  }
  
  .tour-meta {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .tour-actions {
    flex-direction: column;
  }
  
  .tabs {
    flex-wrap: wrap;
  }
  
  .tab-btn {
    flex: 1;
    min-width: 120px;
  }
  
  .overview-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .inclusions-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .image-gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
