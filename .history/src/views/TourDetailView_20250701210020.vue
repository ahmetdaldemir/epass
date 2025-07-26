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
      </section>

      <!-- Tour Details Tabs -->
      <section class="tour-details">
        <div class="container">
          <div class="content-row">
            <div class="content-row-tabs">
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
            <div class="content-row-booking">
                               <!-- Rezervasyon/Ödeme Kutusu Başlangıç -->
                               <div v-if="tour" class="pass-box">
                                <h2>Book this tour</h2>
                                <div class="pass-select-row">
                                  <div class="pass-select">{{ getTourName(tour) }}</div>
                                  <span class="pass-price">€{{ adultPrice }}<small> / adult</small></span>
                                  <span class="pass-price" style="margin-left:12px;">€{{ childPrice }}<small> / child</small></span>
                                </div>
                                <div class="quantity-row" style="display: flex; gap: 24px; align-items: center; justify-content: flex-start; margin-bottom: 8px;">
                                  <div style="display:flex;align-items:center;gap:8px; min-width: 120px;">
                                    <span style="width:48px;">Adult</span>
                                    <button @click="decrement('adult')" :disabled="adultQuantity <= 0">-</button>
                                    <span style="width:24px; text-align:center;">{{ adultQuantity }}</span>
                                    <button @click="increment('adult')">+</button>
                                  </div>
                                  <div style="display:flex;align-items:center;gap:8px; min-width: 120px;">
                                    <span style="width:48px;">Child</span>
                                    <button @click="decrement('child')" :disabled="childQuantity <= 0">-</button>
                                    <span style="width:24px; text-align:center;">{{ childQuantity }}</span>
                                    <button @click="increment('child')">+</button>
                                  </div>
                                </div>
                                <div class="price-summary">
                                  <div class="old-price" v-if="getOldTourPrice(tour)"><s>{{ getOldTourPrice(tour) }}</s></div>
                                  <div class="new-price">{{ getTourPrice(tour) }}</div>
                                  <div class="discount" v-if="getDiscount(tour)"><span>Sale Discount</span><span>-{{ getDiscount(tour) }}</span></div>
                                </div>
                                <hr />
                                <div class="fee-row">
                                  <span>Instant Access Fee <span class="info" title="You get your booking instantly after payment.">i</span></span>
                                  <span>{{ instantFee }}</span>
                                </div>
                                <div class="eco-row">
                                  <span class="eco-icon">🌱</span>
                                  <span>Eco-Friendly Green Technology</span>
                                </div>
                                <hr />
                                <div class="order-total-row">
                                  <span>Order Total</span>
                                  <span class="order-total">{{ orderTotal }}</span>
                                </div>
                                <div class="tax-note">All taxes and fees included</div>
                                <input type="email" placeholder="E-mail Address" class="input" v-model="email" />
                                <input type="date" placeholder="Tour Date" class="input" v-model="startDate" />
                                <button class="pay-btn" @click="proceedToBooking">Book Now</button>
                                <div class="save-note" v-if="getDiscount(tour)"><b>Save {{ getDiscount(tour) }}</b> on this tour versus original price.</div>
                              </div>
                              <!-- Rezervasyon/Ödeme Kutusu Son -->
            </div>
          </div>
       
        </div>
      </section>
    </div>

    <!-- Checkout Form Modal -->
    <div v-if="showCheckout" class="checkout-modal">
      <div class="checkout-content">
        <span class="close-btn-modal" @click="showCheckout = false">&times;</span>
        <h2>Checkout</h2>
        <CheckoutForm :tour="tour" :quantity="quantity" :email="email" :startDate="startDate" :instantFee="instantFee" :orderTotal="orderTotal" @close="showCheckout = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import CheckoutForm from '../components/CheckoutForm.vue'

const route = useRoute()
const activeTab = ref('overview')
const tour = ref(null)
const loading = ref(false)
const error = ref(null)

// Rezervasyon kutusu için state
const adultQuantity = ref(1)
const childQuantity = ref(0)
const adultPrice = computed(() => tour.value?.tour_price?.[0]?.price || 0)
const childPrice = computed(() => tour.value?.tour_price?.[0]?.child_price || 0)
const email = ref('')
const startDate = ref('')
const instantFee = '€10.00'
const showCheckout = ref(false)

// Fetch tour data from API
const fetchTourData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'en'
    const languageId = getLanguageId(currentLanguage)
    
    const url = `https://searchyourtour.com/api/tours?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1&language_id=${languageId}&currency_id=5&limit=100&IpAdrress=78.177.166.135`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch tour data')
    }
    
    const data = await response.json()
    const tourData = data.find(t => t.id.toString() === route.params.id)
    
    if (!tourData) {
      error.value = 'Tour not found'
      return
    }
    
    tour.value = tourData
  } catch (err) {
    error.value = 'Failed to load tour details. Please try again later.'
    console.error('Error fetching tour:', err)
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

const getOldTourPrice = (tour) => {
  const price = tour.tour_price?.[0]
  if (price && price.old_price && price.old_price > price.price) {
    const currency = price.currency?.icon || '€'
    return `${currency}${price.old_price}`
  }
  return null
}

const getDiscount = (tour) => {
  const price = tour.tour_price?.[0]
  if (price && price.old_price && price.old_price > price.price) {
    return `€${price.old_price - price.price}`
  }
  return null
}

const orderTotal = computed(() => {
  const total = (adultQuantity.value * adultPrice.value) + (childQuantity.value * childPrice.value) + 10
  return `€${total}.00`
})

const proceedToBooking = () => {
  showCheckout.value = true
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

const getAvailableDays = (tour) => {
  if (!tour.days || tour.days.length === 0) return 'Not specified'
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return tour.days.map(day => dayNames[day - 1]).join(', ')
}

function increment(type) {
  if (type === 'adult') adultQuantity.value++
  else if (type === 'child') childQuantity.value++
}

function decrement(type) {
  if (type === 'adult' && adultQuantity.value > 0) adultQuantity.value--
  else if (type === 'child' && childQuantity.value > 0) childQuantity.value--
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


.content-row {
  display: grid;
  grid-template-columns: 2.5fr 1.5fr;
  gap: 3rem;
  align-items: start;
}
.content-row-tabs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-row-booking {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  color: #fc6421;
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
  color: #fc6421;
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
  color: #fc6421;
}

.tab-btn.active {
  color: #fc6421;
  border-bottom-color: #fc6421;
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
  color: #fc6421;
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
  color: #fc6421;
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
  color: #fc6421;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tour-hero {
    padding: 1.2rem 0 0.5rem 0;
  }
  .tour-hero-content {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  .main-image img {
    height: 180px;
    border-radius: 16px;
  }
  .image-gallery {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.4rem;
  }
  .gallery-item img {
    height: 60px;
    border-radius: 10px;
  }
  .tour-title {
    font-size: 1.35rem;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
  .tour-meta {
    flex-direction: row;
    gap: 0.7rem;
    font-size: 0.98rem;
    margin-bottom: 0.7rem;
    flex-wrap: wrap;
  }
  .tour-meta > div {
    gap: 0.3rem;
  }
  .tour-description {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
  .info-card {
    padding: 1rem;
    border-radius: 12px;
    font-size: 0.98rem;
    margin-bottom: 1.2rem;
  }
  .tour-details {
    padding: 1.2rem 0 0.5rem 0;
  }
  .tabs {
    flex-wrap: wrap;
    border-bottom-width: 1.5px;
    margin-bottom: 1.2rem;
  }
  .tab-btn {
    flex: 1;
    min-width: 100px;
    font-size: 1rem;
    padding: 0.7rem 0.5rem;
  }
  .tab-panel {
    min-height: 200px;
    padding: 0.5rem 0;
  }
  .overview-content {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  .overview-text h3 {
    font-size: 1.1rem;
    margin-bottom: 0.7rem;
  }
  .inclusions-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  .inclusions-section h3 {
    font-size: 1.1rem;
    margin-bottom: 0.7rem;
  }
  .inclusions-list li, .exclusions-list li {
    font-size: 0.98rem;
    padding-left: 1.1rem;
  }
  .additional-info {
    padding: 1.1rem;
    border-radius: 12px;
    font-size: 0.98rem;
  }
  .info-section h3 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  .detail-item {
    font-size: 0.98rem;
    padding: 0.5rem 0;
  }
  .pass-box {
    padding: 18px 10px;
    border-radius: 14px;
    margin-top: 1.2rem;
    max-width: 100%;
    min-width: 0;
  }
  .pass-box h2 {
    font-size: 1.2rem;
    padding: 12px;
    height: auto;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }
  .pass-select-row, .fee-row, .eco-row, .order-total-row {
    font-size: 1rem;
    gap: 0.5rem;
  }
  .input {
    font-size: 1rem;
    padding: 8px 10px;
    border-radius: 7px;
  }
  .pay-btn {
    font-size: 1rem;
    padding: 10px 0;
    border-radius: 8px;
    margin: 10px 0;
  }
  .save-note {
    font-size: 0.98rem;
    padding: 6px 8px;
    border-radius: 7px;
  }
  .checkout-content {
    padding: 1rem;
    border-radius: 8px;
    max-width: 98vw;
  }
}

/* IstanbulPassView.vue ile uyumlu ödeme kutusu stilleri */
.pass-box {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 32px 24px;
  max-width: 100%;
  min-width: 100%;
  font-family: 'Inter', sans-serif;
  margin-top: 0.5rem;
  border: 1px solid #FC6421;
}
.pass-box h2 {
  font-size: 2rem;
  margin-bottom: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  color: #fff;
  background: #FC6421;
  padding: 20px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  font-size: 32px;
  font-weight: 700;
  height: 63px;
}
.pass-select-row {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.pass-select {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  font-size: 1rem;
  background: #f7f7f7;
}
.pass-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
}
.quantity-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.quantity-row button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f2f2f2;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
}
.quantity-row button:disabled {
  background: #eee;
  cursor: not-allowed;
}
.price-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}
.old-price {
  color: #aaa;
  font-size: 1rem;
}
.new-price {
  color: #FC6421;
  font-size: 1.3rem;
  font-weight: 700;
}
.discount {
  color: #FC6421;
  font-size: 1rem;
}
.fee-row, .eco-row, .order-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}
.eco-icon {
  font-size: 1.2rem;
}
.order-total {
  font-size: 1.4rem;
  font-weight: 700;
  color: #222;
}
.tax-note {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 10px;
}
.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  margin-bottom: 10px;
  font-size: 1rem;
}
.pay-btn {
  width: 100%;
  background: #FC6421;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  padding: 14px 0;
  margin: 12px 0;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(230,0,76,0.08);
}
.pay-btn:hover {
  background: #c4003c;
}
.save-note {
  background: #f7f7f7;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1rem;
  color: #222;
  margin-top: 8px;
  text-align: center;
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 12px 0;
}
.info {
  font-size: 0.9em;
  color: #888;
  cursor: pointer;
  margin-left: 4px;
}
@media (max-width: 900px) {
  .tour-hero-content { flex-direction: column; display: flex; }
  .pass-box { max-width: 100%; min-width: 0; }
}

/* Checkout Form Modal */
.checkout-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkout-content {
  position: relative;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 32px 24px;
  min-width: 1500px;
  max-width: 1000px;
  min-height: 800px;
  max-height: 400vh;
  overflow: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.close-btn-modal {
  position: absolute;
  top: 24px;
  right: 36px;
  font-size: 2.2rem;
  color: #888;
  cursor: pointer;
  z-index: 1001;
  background: none;
  border: none;
  transition: color 0.2s;
}

.close-btn-modal:hover {
  color: #e6004c;
}

.checkout-content h2 {
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 700;
}
</style>
