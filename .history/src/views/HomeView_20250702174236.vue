<template>
  <div class="home">
    <!-- Top Banner (Price & Buy Now) -->
    <div class="top-banner">
      <span>Starting from just €139</span>
      <router-link to="/istanbul-pass" class="buy-now-btn">Buy Now</router-link>
    </div>

    <!-- Hero Section with Main Visual and Badge -->
    <section class="hero-section">
      <div class="hero-img-wrap">
        <img class="hero-img" src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="Basilica Cistern" />
        <div class="hero-badge">NOW WITH <span>5GB</span> SIM FREE</div>
        <div class="hero-label">Basilica Cistern / Included with pass</div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="quick-stats">
            <div class="stat-box orange"><span>50%</span><small>HIGH SAVINGS</small></div>
            <div class="stat-box pink"><span>7</span><small>ICONIC LANDMARKS</small></div>
            <div class="stat-box blue"><span>100+</span><small>TOP ACTIVITIES</small></div>
          </div>
          <div class="mini-stats-row">
            <div class="mini-stat"><b>30 Years</b><br />Istanbul experts</div>
            <div class="mini-stat"><b>750K+ Passes</b><br />Sold since 2015</div>
            <div class="mini-stat"><b>150+ Countries</b><br />Nationalities served</div>
            <div class="mini-stat"><b>98.6%</b><br />Customer Satisfaction</div>
          </div>
          <h1 class="hero-title">All Istanbul.<br /><span>All Yours!</span></h1>
          <p class="hero-subtitle">
            <b>ALL Istanbul's magic in ONE pass!</b><br />
            <span class="highlight">FREE, FAST & EASY</span> entry to Istanbul's <b>top 7 iconic landmarks</b> and <b>100+ popular museums, attractions and activities</b> with skip the line <span class="highlight">instant e-tickets</span>.<br />
            Explore Istanbul hassle-free and save over <span class="highlight">€270</span>.<br />
            <span class="now-highlight">NOW! FREE entry to Hagia Sophia & Galata Tower!</span>
          </p>
          <router-link to="/istanbul-pass" class="cta-btn">Get Yours & Save Now</router-link>
        </div>
      </div>
    </section>

    <!-- Why Choose Section (Yellow Info Bar) -->
    <div class="why-choose-bar">
      <span>Beat the heat with cool discoveries!</span> Istanbul's culture is always in season—<b>Save 40% on Istanbul Tourist Pass® Ends today!</b>
    </div>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Why Choose Istanbul Tourist Pass?</h2>
        <div v-if="isMobile" class="features-slider">
          <swiper :slides-per-view="1.2" :space-between="16" :centered-slides="true" :pagination="{ clickable: true }">
            <swiper-slide v-for="feature in features" :key="feature.id">
              <div class="feature-card slider-card">
                <div class="feature-icon">
                  <i :class="feature.icon"></i>
                </div>
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div v-else class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Attractions Section -->
    <section id="attractions" class="attractions-section">
      <div class="container">
        <h2 class="section-title">Popular Attractions</h2>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">{{ error }}</div>
        <swiper
          v-else
          :slides-per-view="isMobile ? 1.1 : 3"
          :space-between="isMobile ? 12 : 32"
          :pagination="{ clickable: true }"
          style="padding-bottom: 32px;"
        >
          <swiper-slide v-for="attraction in attractions" :key="attraction.id">
            <router-link
              :to="`/tour/${attraction.id}`"
              class="attraction-card slider-card"
              style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;"
            >
              <div class="attraction-image">
                <img :src="getAttractionImage(attraction)" :alt="getAttractionName(attraction)" />
              </div>
              <div class="attraction-content">
                <h3>{{ getAttractionName(attraction) }}</h3>
                <p>{{ getAttractionDescription(attraction) }}</p>
                <div class="attraction-meta">
                  <span class="price">FREE with Pass</span>
                  <span class="rating">
                    <i class="fas fa-star"></i>
                    {{ attraction.rating || '4.5' }}
                  </span>
                </div>
              </div>
            </router-link>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </section>

    <!-- Pass Types Section -->
    <section class="pass-types-section">
      <div class="container">
        <h2 class="section-title">Choose Your Pass</h2>
        <div v-if="isMobile" class="pass-types-slider">
          <swiper
            class="pass-types-slider"
            :slides-per-view="1.1"
            :space-between="24"
            :centered-slides="true"
            :pagination="{ clickable: true }"
          >
            <swiper-slide v-for="pass in passTypes" :key="pass.id">
              <div class="pass-card">
                <div class="pass-header">
                  <h3>{{ pass.name }}</h3>
                  <div class="pass-price">{{ pass.price }}</div>
                </div>
                <div class="pass-features">
                  <ul>
                    <li v-for="feature in pass.features" :key="feature">{{ feature }}</li>
                  </ul>
                </div>
                <div class="pass-action">
                  <router-link :to="pass.link" class="btn btn-primary">Select Pass</router-link>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div v-else class="pass-types-grid">
          <div class="pass-card" v-for="pass in passTypes" :key="pass.id">
            <div class="pass-header">
              <h3>{{ pass.name }}</h3>
              <div class="pass-price">{{ pass.price }}</div>
            </div>
            <div class="pass-features">
              <ul>
                <li v-for="feature in pass.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>
            <div class="pass-action">
              <router-link :to="pass.link" class="btn btn-primary">Select Pass</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <h2 class="section-title">What Our Customers Say</h2>
        <div v-if="isMobile" class="testimonials-slider">
          <swiper :slides-per-view="1.2" :space-between="16" :centered-slides="true" :pagination="{ clickable: true }">
            <swiper-slide v-for="testimonial in testimonials" :key="testimonial.id">
              <div class="testimonial-card slider-card">
                <div class="testimonial-content">
                  <p>"{{ testimonial.text }}"</p>
                </div>
                <div class="testimonial-author">
                  <img :src="testimonial.avatar" :alt="testimonial.name">
                  <div>
                    <h4>{{ testimonial.name }}</h4>
                    <span>{{ testimonial.location }}</span>
                  </div>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div v-else class="testimonials-grid">
          <div class="testimonial-card" v-for="testimonial in testimonials" :key="testimonial.id">
            <div class="testimonial-content">
              <p>"{{ testimonial.text }}"</p>
            </div>
            <div class="testimonial-author">
              <img :src="testimonial.avatar" :alt="testimonial.name">
              <div>
                <h4>{{ testimonial.name }}</h4>
                <span>{{ testimonial.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'

// Reactive data
const features = ref([
  {
    id: 1,
    icon: 'fas fa-ticket-alt',
    title: 'Skip the Lines',
    description: 'Fast-track entry to popular attractions without waiting in long queues.'
  },
  {
    id: 2,
    icon: 'fas fa-save',
    title: 'Save Money',
    description: 'Get significant discounts compared to buying individual tickets.'
  },
  {
    id: 3,
    icon: 'fas fa-map-marked-alt',
    title: '100+ Attractions',
    description: 'Access to museums, palaces, tours, and experiences across Istanbul.'
  },
  {
    id: 4,
    icon: 'fas fa-clock',
    title: 'Flexible Duration',
    description: 'Choose from 1, 3, 5, or 7-day passes to suit your schedule.'
  }
])

const attractions = ref([])
const loading = ref(false)
const error = ref(null)
const currentLanguage = ref('en')
const currentCurrency = ref(5) // USD

const getLanguageId = (langCode) => {
  const languageMap = {
    'en': 1,
    'tr': 2,
    'de': 6,
    'ru': 9
  }
  return languageMap[langCode] || 1
}

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
    const istanbulTours = (data || []).filter(tour => tour.destination?.id === 404 && tour.is_active === true)
    attractions.value = istanbulTours
  } catch (err) {
    error.value = 'Failed to load attractions. Please try again later.'
    console.error('Error fetching attractions:', err)
  } finally {
    loading.value = false
  }
}

const getAttractionName = (attraction) => {
  return attraction.content?.[0]?.name || 'Unnamed Attraction'
}
const getAttractionDescription = (attraction) => {
  const metaContent = attraction.content?.[0]?.meta_content
  if (!metaContent) return 'No description available'
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = metaContent
  const text = tempDiv.textContent || tempDiv.innerText || ''
  return text.length > 120 ? text.substring(0, 120) + '...' : text
}
const getAttractionImage = (attraction) => {
  return attraction.files?.[0]?.url || 'https://via.placeholder.com/300x200?text=Istanbul+Attraction'
}

const passTypes = ref([
  {
    id: 1,
    name: '1 Day Pass',
    price: '€85',
    features: [
      'Access to 100+ attractions',
      'Skip-the-line entry',
      'Free guided tours',
      'Mobile ticket'
    ],
    link: '/istanbul-pass?duration=1'
  },
  {
    id: 2,
    name: '3 Day Pass',
    price: '€115',
    features: [
      'Access to 100+ attractions',
      'Skip-the-line entry',
      'Free guided tours',
      'Mobile ticket',
      'Best value option'
    ],
    link: '/istanbul-pass?duration=3'
  },
  {
    id: 3,
    name: '7 Day Pass',
    price: '€145',
    features: [
      'Access to 100+ attractions',
      'Skip-the-line entry',
      'Free guided tours',
      'Mobile ticket',
      'Maximum flexibility'
    ],
    link: '/istanbul-pass?duration=7'
  }
])

const testimonials = ref([
  {
    id: 1,
    text: 'The Istanbul Tourist Pass was absolutely worth it! We saved so much time and money.',
    name: 'Sarah Johnson',
    location: 'New York, USA',
    avatar: 'https://via.placeholder.com/60x60'
  },
  {
    id: 2,
    text: 'Amazing experience! The skip-the-line feature alone made it worth every penny.',
    name: 'Michael Chen',
    location: 'London, UK',
    avatar: 'https://via.placeholder.com/60x60'
  },
  {
    id: 3,
    text: 'Perfect for exploring Istanbul. Highly recommend the 3-day pass.',
    name: 'Emma Rodriguez',
    location: 'Madrid, Spain',
    avatar: 'https://via.placeholder.com/60x60'
  }
])

const isMobile = ref(false)
function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  // Get language from localStorage or default to English
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'
  currentLanguage.value = savedLanguage
  fetchAttractions()
})
</script>

<style scoped>
@import 'swiper/swiper-bundle.css';
.features-slider, .attractions-slider, .pass-types-slider, .testimonials-slider {
  width: 100%;
  padding-bottom: 2.5rem;
}
.attraction-card,
.slider-card {
  display: block;
  width: 100%;
  height: 100%;
  box-shadow: 0 1px 6px rgba(0,0,0,0.08);
  border-radius: 14px;
  padding: 0.7rem 0.7rem 1rem 0.7rem;
  background: #fff;
  min-width: 0;
}
.attraction-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 14px 14px 0 0;
  display: block;
}
.swiper-slide {
  width: 350px !important;
  box-sizing: border-box;
}
@media (max-width: 768px) {
  .slider-card,
  .attraction-card {
    min-height: 370px;
    height: 370px;
    width: 90vw;
    max-width: 95vw;
    margin: 0 auto 1.2rem auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 8px;
  }
  .pass-card {
    min-height: 520px;
    padding-bottom: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .pass-action {
    margin-top: auto;
    padding-bottom: 1.2rem;
    display: flex;
    justify-content: center;
  }
  .attraction-image img {
    height: 140px !important;
    object-fit: cover;
    border-radius: 10px 10px 0 0;
  }
  .attraction-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
}
.swiper-pagination {
  bottom: 0 !important;
}
.home {
  min-height: 100vh;
  background: #f4f6fa;
}

.top-banner {
  width: 100vw;
  max-width: 100%;
  background: #FC6421;
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}
.buy-now-btn {
  background: #fff;
  color: #FC6421;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: background 0.2s, color 0.2s;
}
.buy-now-btn:hover {
  background: #ffe6ef;
  color: #b8003a;
}

.hero-section {
  background: #fff;
  padding: 0 0 1.5rem 0;
  text-align: center;
  position: relative;
}
.hero-img-wrap {
  position: relative;
  width: 100vw;
  max-width: 100%;
  overflow: hidden;
  height: 220px;
}
.hero-img {
  width: 100vw;
  height: 220px;
  object-fit: cover;
  filter: brightness(0.85);
}
.hero-badge {
  position: absolute;
  top: 18px;
  left: 12px;
  background: #FC6421;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 30px;
  padding: 0.4rem 1.1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  letter-spacing: 0.5px;
}
.hero-badge span {
  color: #ffe600;
  font-size: 1.2em;
}
.hero-label {
  position: absolute;
  bottom: 10px;
  left: 12px;
  background: rgba(44,62,80,0.92);
  color: #fff;
  font-size: 0.95rem;
  border-radius: 8px;
  padding: 0.3rem 0.9rem;
}

.quick-stats {
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  margin: 1.2rem 0 0.7rem 0;
}
.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  padding: 0.7rem 1.1rem;
  font-weight: 700;
  font-size: 1.1rem;
  color: #fff;
  min-width: 80px;
}
.stat-box.orange { background: #FC6421; color: #fff; }
.stat-box.pink { background: #FC6421; color: #fff; }
.stat-box.blue { background: #00b6e6; color: #fff; }
.stat-box span { font-size: 1.3em; }
.stat-box small { font-size: 0.8em; font-weight: 400; }

.mini-stats-row {
  display: flex;
  justify-content: center;
  gap: 1.1rem;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
}
.mini-stat {
  background: #fff;
  color: #2c3e50;
  border-radius: 8px;
  font-size: 0.93rem;
  padding: 0.5rem 0.8rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  text-align: center;
  min-width: 110px;
}

.hero-title {
  font-size: 2.1rem;
  font-weight: 800;
  color: #FC6421;
  margin: 1.2rem 0 0.2rem 0;
  line-height: 1.1;
}
.hero-title span {
  color: #00b6e6;
}
.hero-subtitle {
  font-size: 1.08rem;
  color: #2c3e50;
  margin-bottom: 1.2rem;
  margin-top: 0.7rem;
}
.highlight {
  color: #FC6421;
  font-weight: 700;
}
.now-highlight {
  color: #00b6e6;
  font-weight: 700;
}
.cta-btn {
  display: block;
  width: 100%;
  max-width: 350px;
  margin: 0.7rem auto 0 auto;
  background: #FC6421;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 0.9rem 0;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.09);
  transition: background 0.2s;
}
.cta-btn:hover {
  background: #b8003a;
}

.why-choose-bar {
  background: #ffe600;
  color: #2c3e50;
  font-size: 1.08rem;
  font-weight: 600;
  text-align: center;
  padding: 0.7rem 1rem;
  margin-bottom: 1.2rem;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.why-choose-bar b {
  color: #FC6421;
}

/* Sections */
.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50;
}

/* Features Section */
.features-section {
  padding: 5rem 0;
  background: #f8f9fa;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  color: #FC6421;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

/* Attractions Section */
.attractions-section {
  padding: 5rem 0;
}

.attractions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.attraction-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.attraction-card:hover {
  transform: translateY(-5px);
}

.attraction-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.attraction-content {
  padding: 1.5rem;
}

.attraction-content h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.attraction-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.price {
  color: #FC6421;
  font-weight: 600;
}

.rating {
  color: #f39c12;
}

/* Pass Types Section */
.pass-types-section {
  padding: 5rem 0;
  background: #f8f9fa;
}

.pass-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.pass-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 520px;
  margin-bottom: 0;
}

.pass-card:hover {
  transform: translateY(-5px);
}

.pass-header {
  margin-bottom: 1.5rem;
}

.pass-price {
  font-size: 2rem;
  font-weight: 700;
  color: #FC6421;
  margin-top: 0.5rem;
}

.pass-features ul {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.pass-features li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.pass-features li:last-child {
  border-bottom: none;
}

.pass-action {
  margin-top: auto;
  padding-bottom: 1.2rem;
  display: flex;
  justify-content: center;
}

/* Testimonials Section */
.testimonials-section {
  padding: 5rem 0;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.testimonial-content {
  margin-bottom: 1.5rem;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.testimonial-author img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.testimonial-author h4 {
  margin: 0;
  color: #2c3e50;
}

.testimonial-author span {
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .top-banner { font-size: 0.98rem; padding: 0.6rem 0.7rem; }
  .hero-img-wrap, .hero-img { height: 160px; }
  .hero-badge { font-size: 0.95rem; padding: 0.3rem 0.7rem; top: 10px; }
  .hero-label { font-size: 0.8rem; padding: 0.2rem 0.6rem; bottom: 5px; }
  .quick-stats { gap: 0.4rem; }
  .stat-box { font-size: 0.95rem; min-width: 65px; padding: 0.5rem 0.7rem; }
  .mini-stats-row { gap: 0.5rem; }
  .mini-stat { font-size: 0.85rem; min-width: 90px; padding: 0.4rem 0.5rem; }
  .hero-title { font-size: 1.3rem; }
  .cta-btn { font-size: 1rem; padding: 0.7rem 0; }
  .why-choose-bar { font-size: 0.95rem; padding: 0.5rem 0.5rem; }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid,
  .attractions-grid,
  .pass-types-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
