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
        <img 
          class="hero-img" 
          src="https://c4.wallpaperflare.com/wallpaper/683/300/1022/sunken-palace-or-basilica-cistern-istanbul-wallpaper-preview.jpg" 
          alt="Basilica Cistern"
          loading="eager"
          fetchpriority="high"
        />
        <div class="hero-img-gradient"></div>
        <div class="hero-badge">NOW WITH <span>5GB</span> SIM FREE</div>
        <div class="hero-label">Basilica Cistern / Included with pass</div>
        <!-- Main H1 Heading for SEO -->
        <h1 class="hero-title">Discover Istanbul with SearchYourTour Pass - Save 40% on Top Attractions</h1>
        <!-- Kategori Butonları -->
        <div class="category-tabs">
          <button v-for="cat in categories" :key="cat.value" :class="['category-tab', { active: selectedCategory === cat.value }]" @click="selectedCategory = cat.value">
            <span class="cat-icon" v-html="cat.icon"></span>
            <span>{{ cat.label }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Kategoriye Göre Tur Listesi veya Yakında -->
    <section class="category-section">
      <div v-if="selectedCategory === 'culture'">
        <div class="category-list-wrap">
          <h2 class="category-title">Unforgettable Cultural Experiences</h2>
          <!-- Masaüstü: Grid, Mobil: Swiper -->
          <div class="tour-card-grid desktop-only">
            <router-link
              v-for="tour in cultureTours"
              :key="tour.id"
              :to="`/tour/${tour.id}`"
              class="tour-card"
              style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;"
            >
              <div class="tour-card-img-wrap">
                <img :src="getAttractionImage(tour)" :alt="getAttractionName(tour)" />
              </div>
              <!-- Kart içeriği -->
              <div class="tour-card-content">
                <div class="tour-card-type">{{ tour.type || 'GUIDED TOURS' }}</div>
                <div class="tour-card-title">{{ getAttractionName(tour) }}</div>
                <div class="tour-card-desc">{{ getAttractionDescription(tour) }}</div>
                <div class="tour-card-bottom">
                  <div class="tour-card-action-row">
                    <span class="tour-card-price">{{ getReactiveTourPrice(tour) }} <span class="tour-card-price-label">/ 1 adult</span></span>
                    <router-link :to="`/tour/${tour.id}`" class="tour-card-book-btn">Book Now</router-link>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <swiper
          class="tour-card-swiper mobile-only"
          :slides-per-view="1"
          :space-between="0"
          :centered-slides="true"
          :pagination="{ clickable: true }"
          style="padding-bottom: 32px;"
        >
          <swiper-slide v-for="tour in cultureTours" :key="tour.id">
            <router-link
              :to="`/tour/${tour.id}`"
              class="tour-card"
              style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;"
            >
              <div class="tour-card-img-wrap">
                <img :src="getAttractionImage(tour)" :alt="getAttractionName(tour)" />
              </div>
              <div class="tour-card-content">
                <div class="tour-card-type">{{ tour.type || 'GUIDED TOURS' }}</div>
                <div class="tour-card-title">{{ getAttractionName(tour) }}</div>
                <div class="tour-card-desc">{{ getAttractionDescription(tour) }}</div>
                <div class="tour-card-bottom">
                  <div class="tour-card-action-row">
                    <span class="tour-card-price">{{ getReactiveTourPrice(tour) }} <span class="tour-card-price-label">/ 1 adult</span></span>
                    <router-link :to="`/tour/${tour.id}`" class="tour-card-book-btn">Book Now</router-link>
                  </div>
                </div>
              </div>
            </router-link>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div v-else>
        <h2 class="category-title">Coming Soon</h2>
        <div class="coming-soon">This category will be available soon.</div>
      </div>
    </section>

    <!-- Why Choose Section (Yellow Info Bar) -->
    <div class="why-choose-bar">
      <span>Beat the heat with cool discoveries!</span> Istanbul's culture is always in season—<b>Save 40% on SearchYourTour ends today!</b>
    </div>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-list-wrap">
        <div class="container swiper-no-padding">
          <h2 class="section-title">Why choose SearchYourTour?</h2>
          <div class="features-grid-desktop">
            <div class="feature-card" v-for="feature in features" :key="feature.id">
              <div class="feature-icon">
                <i :class="feature.icon"></i>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
          <!-- Mobile Swiper -->
          <swiper
            class="features-swiper-mobile"
            :slides-per-view="1"
            :space-between="0"
            :centered-slides="false"
            :pagination="{ clickable: true }"
            :breakpoints="{ 0: { slidesPerView: 1, spaceBetween: 0, centeredSlides: false } }"
          >
            <swiper-slide v-for="feature in features" :key="feature.id">
              <div class="feature-card">
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
      </div>
    </section>

    <!-- Attractions Section -->
    <section id="attractions" class="attractions-section">
      <div class="section-list-wrap">
        <div class="container swiper-no-padding">
          <h2 class="section-title">Popular Attractions</h2>
          <div v-if="loading">Loading...</div>
          <div v-else-if="error">{{ error }}</div>
          <!-- Masaüstü Swiper -->
          <swiper
            class="desktop-only"
            :slides-per-view="3"
            :space-between="16"
            :centered-slides="false"
            :pagination="{ clickable: true }"
            :breakpoints="{
              0: { slidesPerView: 1, spaceBetween: 0, centeredSlides: false },
              769: { slidesPerView: 3, spaceBetween: 16, centeredSlides: false }
            }"
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
          <!-- Mobil Swiper -->
          <swiper
            class="attractions-slider-mobile mobile-only"
            :slides-per-view="1"
            :space-between="0"
            :centered-slides="true"
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
      </div>
    </section>

    <!-- Pass Types Section -->
    <section class="pass-types-section">
      <div class="section-list-wrap">
        <div class="container swiper-no-padding">
          <h2 class="section-title">Choose Your SearchYourTour Pass</h2>
          <p class="section-subtitle">Select the perfect pass for your Istanbul adventure. <router-link to="/istanbul-pass" class="inline-link">View all pass options</router-link> or <router-link to="/attractions" class="inline-link">browse attractions</router-link> to plan your visit.</p>
          <swiper
            class="pass-types-slider"
            :slides-per-view="3"
            :space-between="16"
            :centered-slides="false"
            :pagination="{ clickable: true }"
            :breakpoints="{
              0: { slidesPerView: 1, spaceBetween: 0, centeredSlides: false },
              769: { slidesPerView: 3, spaceBetween: 16, centeredSlides: false }
            }"
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
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="section-list-wrap">
        <div class="container swiper-no-padding">
          <h2 class="section-title">What Our Customers Say About SearchYourTour</h2>
          <p class="section-subtitle">Read reviews from travelers who experienced Istanbul with SearchYourTour. <router-link to="/tours" class="inline-link">Book guided tours</router-link> or <router-link to="/contact" class="inline-link">contact us</router-link> for personalized recommendations.</p>
          <swiper
            :slides-per-view="3"
            :space-between="16"
            :centered-slides="false"
            :pagination="{ clickable: true }"
            :breakpoints="{
              0: { slidesPerView: 1, spaceBetween: 0, centeredSlides: false },
              769: { slidesPerView: 3, spaceBetween: 16, centeredSlides: false }
            }"
          >
            <swiper-slide v-for="testimonial in testimonials" :key="testimonial.id">
              <div
                class="testimonial-card slider-card"
                :class="{ active: activeTestimonialId === testimonial.id }"
                @click="openTestimonialCard(testimonial.id)"
              >
                <div class="testimonial-content">
                  <template v-if="activeTestimonialId === testimonial.id">
                    "{{ testimonial.text }}"
                  </template>
                  <template v-else>
                    <span class="testimonial-short">
                      <template v-if="isMobile">"{{ testimonial.text }}"</template>
                      <template v-else>"{{ shortText(testimonial.text) }}"</template>
                    </span>
                  </template>
                </div>
                <div class="testimonial-author">
                  <img v-if="testimonial.avatar" :src="testimonial.avatar" :alt="testimonial.name">
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
      </div>
      <!-- Overlay ve Büyüyen Kart -->
      <div v-if="activeTestimonialId" class="testimonial-overlay" @click.self="closeTestimonialCard">
        <div class="testimonial-card active-card-modal">
          <div class="testimonial-content">
            "{{ testimonials.find(t => t.id === activeTestimonialId).text }}"
          </div>
          <div class="testimonial-author">
            <img v-if="testimonials.find(t => t.id === activeTestimonialId).avatar" :src="testimonials.find(t => t.id === activeTestimonialId).avatar" :alt="testimonials.find(t => t.id === activeTestimonialId).name">
            <div>
              <h4>{{ testimonials.find(t => t.id === activeTestimonialId).name }}</h4>
              <span>{{ testimonials.find(t => t.id === activeTestimonialId).location }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { useCurrencyStore } from '../stores/currency'

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

// Currency store
const currencyStore = useCurrencyStore()
const currentCurrency = computed(() => {
  const savedCurrency = currencyStore.getCurrentCurrency()
  return getCurrencyId(savedCurrency)
})

// Currency değişikliklerini izle ve fiyatları güncelle
const currencyChangeTrigger = ref(0)

// Currency değişikliklerini dinlemek için event listener
const handleCurrencyChange = (event) => {
  if (event.detail && event.detail.currency) {
    console.log('HomeView: Currency changed to:', event.detail.currency, 'ID:', event.detail.currencyId)
    // Currency store'u güncelle
    currencyStore.setCurrentCurrency(event.detail.currency)
    // Trigger'ı artırarak fiyatların yeniden hesaplanmasını sağla
    currencyChangeTrigger.value++
  }
}

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
  return currencyMap[currencyCode] || 7
}

// Helper function to get currency code from currency ID
const getCurrencyCodeFromId = (currencyId) => {
  const currencyMap = {
    4: 'EUR',
    5: 'USD',
    6: 'GBP',
    7: 'TRY'
  }
  return currencyMap[currencyId] || 'EUR'
}

const fetchAttractions = async () => {
  loading.value = true
  error.value = null
  try {
    // Güvenli değer alma
    const language = currentLanguage.value || 'en'
    const languageId = getLanguageId(language)
    
    // Her zaman EUR fiyatları al (currency_id=4)
    const currencyId = 4 // EUR
    
    const url = `https://backend.searchyourtour.com/api/tours?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1&language_id=${languageId}&currency_id=${currencyId}&limit=200&IpAdrress=78.177.166.135`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch attractions')
    }
    const data = await response.json()
        const istanbulTours = (data || []).filter(tour => tour.destination?.id === 404 && tour.is_active === true)
    
    // Debug: API'den gelen tour verilerini kontrol et
    console.log('=== API RESPONSE DEBUG ===')
    console.log('Total tours found:', istanbulTours.length)
    console.log('API called with currency_id:', currencyId, '(EUR)')
    istanbulTours.slice(0, 5).forEach((tour, index) => {
      console.log(`\n${index + 1}. Tour ID: ${tour.id}`)
      console.log(`   Name: ${tour.content?.[0]?.name}`)
      console.log(`   Price data:`, tour.tour_price?.[0])
      console.log(`   Raw price: ${tour.tour_price?.[0]?.price}`)
      console.log(`   Price type: ${typeof tour.tour_price?.[0]?.price}`)
      console.log(`   Currency code: ${tour.tour_price?.[0]?.currency_code}`)
    })
    console.log('=== END API DEBUG ===')
    
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

// Price conversion functions
const convertAndFormatPrice = (priceInEUR) => {
  if (!priceInEUR) return ''
  const currentCurrency = currencyStore.getCurrentCurrency()
  const convertedPrice = currencyStore.convertPrice(priceInEUR, currentCurrency)
  return currencyStore.formatPrice(convertedPrice, currentCurrency)
}

const getTourPrice = (tour) => {
  // Currency değişikliklerini dinlemek için trigger'ı kullan
  currencyChangeTrigger.value
  
  // API'den gelen fiyat verisini al
  const priceData = tour.tour_price?.[0]
  if (!priceData) {
    return ''
  }
  
  // API'den her zaman EUR fiyatları alıyoruz
  const apiPrice = priceData.price
  const targetCurrency = currencyStore.getCurrentCurrency()
  
  console.log(`Tour ${tour.id} price debug:`, {
    apiPrice,
    apiCurrencyCode: 'EUR',
    targetCurrency,
    priceData
  })
  
  // Eğer hedef para birimi EUR ise, direkt formatla
  if (targetCurrency === 'EUR') {
    return currencyStore.formatPrice(apiPrice, targetCurrency)
  }
  
  // EUR'dan hedef para birimine çevir
  const convertedPrice = currencyStore.convertPrice(apiPrice, targetCurrency)
  return currencyStore.formatPrice(convertedPrice, targetCurrency)
}

// Reaktif fiyat hesaplama fonksiyonu - currency değişikliklerini otomatik dinler
const getReactiveTourPrice = (tour) => {
  // Currency değişikliklerini dinlemek için trigger'ı kullan
  currencyChangeTrigger.value
  
  // API'den gelen fiyat verisini al
  const priceData = tour.tour_price?.[0]
  if (!priceData) {
    console.warn(`Tour ${tour.id} has no price data`)
    return ''
  }
  
  // API'den her zaman EUR fiyatları alıyoruz
  const apiPrice = priceData.price
  const targetCurrency = currencyStore.getCurrentCurrency()
  
  console.log(`Tour ${tour.id} price debug:`, {
    apiPrice,
    apiCurrencyCode: 'EUR',
    targetCurrency,
    priceData
  })
  
  // Eğer hedef para birimi EUR ise, direkt formatla
  if (targetCurrency === 'EUR') {
    return currencyStore.formatPrice(apiPrice, targetCurrency)
  }
  
  // EUR'dan hedef para birimine çevir
  const convertedPrice = currencyStore.convertPrice(apiPrice, targetCurrency)
  return currencyStore.formatPrice(convertedPrice, targetCurrency)
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
    text: 'SearchYourTour İstanbul turuna katıldım. Turu organize eden arkadaşlara çok teşekkür ediyorum. Profesyonel ve işini bilen bir tur firması olduğunu söyleyebilirim. İstanbul turlarınızda tavsiye ederim.',
    name: 'Gülsüm Deniz',
    location: 'İstanbul, Türkiye',
    avatar: 'https://cdn-icons-png.freepik.com/512/9230/9230519.png'
  },
  {
    id: 2,
    text: 'We had a very good experience with the tour agency. Robi was able to book a Bosphorous dinner cruise for us at the last minute. The whole process was very smooth and nicely organised. We had a very enjoyable evening without any hassle. Will definitely recommend!',
    name: 'Haiqah Amjad',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    text: 'Beautiful trip,amazing service,the crew was very nice.Thank u for everything!',
    name: 'Florentina Salalidis',
    location: 'Bucharest, Romania',
    avatar: 'https://cdn-icons-png.freepik.com/512/9230/9230518.png?ga=GA1.1.84761969.1751881134'
  },
  {
    id: 4,
    text: 'We have done a number of tours but this company was by far the best we have ever had. Great value, so much information and a guide that really cared for making sure they delivered value for money.',
    name: 'Caitlin Palmer',
    location: 'Sydney, Australia',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 5,
    text: 'SearchYourTour firmasının Ayasofya ve Topkapı sarayı turlarına katıldım. İstanbul turlarında kesinlikle tavsiye ederim. Vaktiniz olursa boğaz turuna da katılmanızı öneririm.',
    name: 'Mehmet Kemal Bozkurt',
    location: 'İstanbul, Türkiye',
    avatar: 'https://cdn-icons-png.freepik.com/512/9230/9230525.png?ga=GA1.1.84761969.1751881134'
  },
  {
    id: 6,
    text: 'Very careful, attentive to every detail. It was an excellent experience, I recommend it!',
    name: 'Patrícia Siqueira Cosignani',
    location: 'São Paulo, Brazil',
    avatar: 'https://cdn-icons-png.freepik.com/512/9230/9230528.png?ga=GA1.1.84761969.1751881134'
  },
  {
    id: 7,
    text: 'I had a great time on the tour. The guide was very knowledgeable and the tour was well organized. I would definitely recommend this tour to anyone visiting Istanbul.',
    name: 'Elsa Klein',
    location: 'Berlin, Germany',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
])

const activeTestimonialId = ref(null)

function openTestimonialCard(id) {
  // Sadece masaüstünde büyütme/overlay aç
  if (window.innerWidth < 769) return;
  activeTestimonialId.value = id
  document.body.style.overflow = 'hidden'
}
function closeTestimonialCard() {
  activeTestimonialId.value = null
  document.body.style.overflow = ''
}

function handleClickOutside(event) {
  const activeCard = document.querySelector('.testimonial-card.active')
  if (activeCard && !activeCard.contains(event.target)) {
    closeTestimonialCard()
  }
}
onMounted(() => {
  window.addEventListener('mousedown', handleClickOutside)
})
onBeforeUnmount(() => {
  window.removeEventListener('mousedown', handleClickOutside)
})

function shortText(text, maxLength = 120) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  // Son boşlukta kes ve ... ekle
  const cut = text.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return cut.slice(0, lastSpace > 0 ? lastSpace : maxLength) + '...'
}

const isMobile = ref(false)
function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}
// Currency change event listener is already defined above

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  // Add event listener for currency changes
  window.addEventListener('currency-changed', handleCurrencyChange)
  // Get language from localStorage or default to English
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'
  currentLanguage.value = savedLanguage
  
  // Currency store'u başlangıçta yükle
  currencyStore.fetchCurrencies()
  
  console.log('HomeView onMounted:', {
    savedLanguage,
    currentLanguage: currentLanguage.value,
    currentCurrency: currentCurrency.value
  })
  
  fetchAttractions()
})

onBeforeUnmount(() => {
  // Remove event listener
  window.removeEventListener('currency-changed', handleCurrencyChange)
})

// Kategoriler
const categories = [
  { value: 'culture', label: 'Culture', icon: '<i class="fas fa-landmark"></i>' },
  { value: 'food', label: 'Food', icon: '<i class="fas fa-utensils"></i>' },
  { value: 'nature', label: 'Nature', icon: '<i class="fas fa-mountain"></i>' },
  { value: 'sport', label: 'Sports', icon: '<i class="fas fa-running"></i>' }
]
const selectedCategory = ref('culture')

// Kültür kategorisi için turlar (şimdilik tüm attractions)
const cultureTours = attractions


</script>

<style scoped>
@import 'swiper/swiper-bundle.css';

.home {
  padding-top: 0 !important;
}
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
.attraction-image,
.attraction-image img {
  border-radius: 0 !important;
}
.swiper-slide {
  width: 350px !important;
  box-sizing: border-box;
}
@media (max-width: 768px) {
  .slider-card,
  .attraction-card,
  .feature-card,
  .pass-card,
  .testimonial-card {
    width: 92vw !important;
    max-width: 92vw !important;
    min-width: 92vw !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    min-height: 480px;
    height: 480px;
  }
  .swiper-slide {
    width: 100vw !important;
    min-width: 100vw !important;
    max-width: 100vw !important;
    min-height: 480px;
    height: 480px;
    display: flex;
    align-items: stretch;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
  }
  .swiper-wrapper {
    width: 100vw !important;
  }
  .container.swiper-no-padding {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .pass-types-slider .swiper-slide {
    height: 500px;
    display: flex;
    align-items: stretch;
  }
  .pass-card {
    min-height: 400px;
    height: 100%;
    padding-bottom: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 96vw;
    max-width: 99vw;
    margin: 0 0 1.5rem 0.1rem;
  }
  .pass-action {
    margin-top: auto;
    padding-bottom: 1.2rem;
    display: flex;
    justify-content: center;
  }
  .attraction-image img {
    height: 200px !important;
    object-fit: cover;
    border-radius: 10px 10px 0 0;
  }
  .attraction-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .hero-img-wrap {
    height: 220px;
  }
  .hero-img {
    height: 220px;
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
  padding: 0 0 1.5rem 0;
  text-align: center;
  position: relative;
}
.hero-img-wrap {
  position: relative;
  width: 100vw;
  max-width: 100%;
  overflow: hidden;
  height: 500px;
}
.hero-img {
  width: 100vw;
  height: 500px;
  object-fit: cover;
  filter: brightness(0.85);
}
.hero-img-gradient {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 40%;
  background: linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0));
  z-index: 2;
  pointer-events: none;
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
  top: 14px;
  right: 14px;
  background: rgba(44,62,80,0.92);
  color: #fff;
  font-size: 0.95rem;
  border-radius: 8px;
  padding: 0.3rem 0.9rem;
  z-index: 3;
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
}

.features-grid-desktop {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}
.features-swiper-mobile {
  display: none;
}
@media (max-width: 768px) {
  .features-grid-desktop {
    display: none;
  }
  .features-swiper-mobile {
    display: block;
  }
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  margin: 0;
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
  padding: 0 0 1rem 0;
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
  .hero-label { font-size: 0.75rem; padding: 0.18rem 0.6rem; top: 8px; right: 8px; }
  .quick-stats { gap: 0.4rem; }
  .stat-box { font-size: 0.95rem; min-width: 65px; padding: 0.5rem 0.7rem; }
  .mini-stats-row { gap: 0.5rem; }
  .mini-stat { font-size: 0.85rem; min-width: 90px; padding: 0.4rem 0.5rem; }
  .hero-title { 
    font-size: 1.1rem; 
    line-height: 1.1;
    top: 45%;
    z-index: 5;
  }
  .cta-btn { font-size: 1rem; padding: 0.7rem 0; }
  .why-choose-bar { font-size: 0.95rem; padding: 0.5rem 0.5rem; }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid-desktop {
    display: none;
  }
  .features-swiper-mobile {
    display: block;
  }
  .features-swiper-mobile .swiper-slide {
    width: 100vw !important;
    max-width: 100vw !important;
    min-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .features-swiper-mobile .swiper-wrapper {
    width: 100vw !important;
  }
  .features-swiper-mobile .swiper-pagination {
    bottom: 0 !important;
  }
  .attractions-grid,
  .pass-types-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  .feature-card {
    width: 100%;
    max-width: 100vw;
    margin: 0;
  }
  .features-swiper-mobile .feature-card {
    width: 85vw !important;
    max-width: 85vw !important;
    min-width: 85vw !important;
    padding: 1.2rem 0.5rem !important;
    font-size: 0.98rem;
    min-height: 220px !important;
    height: 220px !important;
  }
  .pass-types-section .pass-card {
    height: 500px !important;
    padding-top: 2.2rem !important;
  }
  .testimonials-section .testimonial-card {
    min-height: 180px !important;
    height: 180px !important;
    padding: 1rem 0.7rem !important;
  }
  .testimonials-section .testimonial-content {
    margin-bottom: 0.7rem;
    font-size: 0.98rem;
  }
  .testimonials-section .testimonial-author img {
    width: 40px;
    height: 40px;
  }
  .testimonials-section .testimonial-author h4 {
    font-size: 1rem;
  }
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 32px;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%) translateY(10%);
  z-index: 10;
  margin: 0;
  width: auto;
  padding-bottom: 8px;
  flex-wrap: wrap;
  max-width: 90vw;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}
.category-tab {
  background: transparent;
  color: #fff;
  border: none;
  border-radius: 18px 18px 0 0;
  font-size: 1.4rem;
  font-weight: 700;
  padding: 18px 38px 14px 38px;
  box-shadow: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: -2px;
  position: relative;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}
.category-tab.active {
  background: #FC6421;
  color: #fff;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.cat-icon {
  font-size: 1.5em;
  display: flex;
  align-items: center;
}
.category-section {
  border-radius: 0 0 24px 24px;
  margin-bottom: 32px;
  padding-bottom: 32px;
}
.category-title {
  text-align: left;
  font-size: 2.2rem;
  color: #223366;
  font-weight: 800;
  margin: 0 0 2rem;
}
.tour-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 2rem;
  padding: 0 2vw;
  margin: 0 350px;
}

/* 1200px altında mobil slider'a geç */
@media (max-width: 1199px) {
  .tour-card-grid {
    display: none !important;
  }
  .tour-card-swiper {
    display: block !important;
  }
}
.tour-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(34,51,102,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
  position: relative;
  min-height: 540px;
  height: 540px;
}
.tour-card:hover {
  box-shadow: 0 4px 24px rgba(34,51,102,0.16);
}
.tour-card-img-wrap {
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}
.tour-card-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.tour-card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #fff;
  color: #e6007a;
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 8px;
  padding: 4px 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.tour-card-fav {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #fff;
  color: #e6007a;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: background 0.2s;
}
.tour-card-fav:hover {
  background: #ffe6ef;
}
.tour-card-content {
  padding: 1.2rem 1.2rem 1.4rem 1.2rem;
  display: flex;
  flex-direction: column;
  height: 50%;
  justify-content: space-between;
}
.tour-card-bottom {
  margin-top: auto;
  padding-top: 16px;
  flex-shrink: 0;
}
.tour-card-type {
  color: #e6007a;
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  flex-shrink: 0;
}
.tour-card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #223366;
  margin-bottom: 0.2rem;
  flex-shrink: 0;
}
.tour-card-desc {
  font-size: 1.01rem;
  color: #444;
  margin-bottom: 0.2rem;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.tour-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.98rem;
  margin-bottom: 0.2rem;
}
.tour-card-duration {
  color: #223366;
  font-weight: 600;
}
.tour-card-rating {
  color: #f39c12;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}
.tour-card-reviews {
  color: #888;
  font-size: 0.95em;
  margin-left: 2px;
}
.tour-card-prices {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tour-card-old-price {
  color: #888;
  font-size: 0.98em;
  text-decoration: line-through;
}
.tour-card-price {
  color: #e6007a;
  font-size: 1.08em;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
.coming-soon {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  margin: 2rem 0;
}

@media (max-width: 600px) {
  .category-tabs {
    gap: 6px;
    padding-bottom: 2px;
    z-index: 15;
  }
  .category-tab {
    font-size: 0.85rem;
    padding: 7px 10px 6px 10px;
    border-radius: 10px 10px 0 0;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cat-icon {
    font-size: 0.95em;
  }
  .category-title {
    font-size: 1.1rem;
    margin: 0 0 1.2rem 2vw;
  }
  .hero-label {
    font-size: 0.6rem;
    padding: 0.12rem 0.4rem;
    top: 8px;
    right: 8px;
  }
  .hero-badge {
    font-size: 0.8rem;
    padding: 0.18rem 0.7rem;
    top: 7px;
    left: 7px;
  }
}

@media (max-width: 768px) {
  .features-list,
  .attractions-list,
  .pass-types-list,
  .testimonials-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .slider-card,
  .attraction-card,
  .feature-card,
  .pass-card,
  .testimonial-card {
    width: 92vw !important;
    max-width: 92vw !important;
    min-width: 92vw !important;
    margin: 0 auto !important;
    padding: 0 !important;
  }
}

/* Desktop: Equal heights for feature and attraction cards within their own sections */
@media (min-width: 769px) {
  .features-section .swiper-wrapper {
    display: flex;
    align-items: stretch;
  }
  .features-section .feature-card {
    height: 100%;
    min-height: 260px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .attractions-section .swiper-wrapper {
    display: flex;
    align-items: stretch;
  }
  .attractions-section .swiper-slide {
    display: flex;
    align-items: stretch;
    height: 100%;
  }
  .attraction-card {
    height: 100%;
    min-height: 420px;
    display: flex;
    flex-direction: column;
  }
  .attraction-image img {
    height: 200px;
  }
  .attraction-content h3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 4.2em;
    max-height: 4.2em;
  }
  .attraction-content p {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 6.5em;
    max-height: 6.5em;
  }
  /* Center pass cards */
  .pass-types-section .container.swiper-no-padding {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .pass-types-section .swiper {
    width: auto;
    display: flex;
    justify-content: center;
  }
  .pass-types-section .swiper-wrapper {
    justify-content: center;
  }
  /* Center testimonial cards */
  .testimonials-section .container.swiper-no-padding {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .testimonials-section .swiper {
    width: auto;
    display: flex;
    justify-content: center;
  }
  .testimonials-section .swiper-wrapper {
    justify-content: center;
  }
}
.desktop-only { display: block; }
.mobile-only { display: none; }

/* 1200px altında mobil slider'a geç */
@media (max-width: 1199px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: block !important; }
}

@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: block !important; }
  .tour-card-swiper .tour-card,
  .tour-card-swiper .swiper-slide {
    width: 90vw !important;
    max-width: 90vw !important;
    min-width: 90vw !important;
    margin: 0 auto;
  }
}

/* Tablet boyutları için swiper ayarları */
@media (max-width: 1199px) and (min-width: 769px) {
  .tour-card-swiper .tour-card,
  .tour-card-swiper .swiper-slide {
    width: 80vw !important;
    max-width: 80vw !important;
    min-width: 80vw !important;
    margin: 0 auto;
  }
}
@media (max-width: 768px) {
  .tour-card-swiper {
    width: 100vw !important;
    margin-left: calc(-50vw + 50%) !important;
  }
  .tour-card-swiper .swiper-slide {
    width: 100vw !important;
    max-width: 100vw !important;
    min-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    display: flex;
    justify-content: center;
  }
  .tour-card-swiper .tour-card {
    width: 92vw !important;
    max-width: 92vw !important;
    min-width: 92vw !important;
    margin: 0 auto !important;
  }
  .category-section,
  .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
@media (max-width: 768px) {
  .tour-card-img-wrap {
    height: 200px !important;
    min-height: 200px !important;
    max-height: 200px !important;
    overflow: hidden;
    border-radius: 16px 16px 0 0;
  }
  .tour-card-img-wrap img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }
  .tour-card-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
}
@media (min-width: 769px) {
  .tour-card {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box;
  }
}
@media (min-width: 769px) {
  .tour-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    gap: 2rem;
    padding: 0 2vw;
    width: 100%;
  }
  .tour-card-img-wrap {
    height: 300px;
    overflow: hidden;
    border-radius: 8px 8px 0 0;
  }
  .tour-card-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
@media (max-width: 768px) {
  .desktop-only { display: none !important; }
}
@media (max-width: 768px) {
  .tour-card {
    width: 96vw !important;
    max-width: 96vw !important;
    min-width: 96vw !important;
    margin: 0 auto 1.2rem auto !important;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.10);
  }
  .tour-card-content {
    padding: 1.2rem 1.2rem 1.4rem 1.2rem !important;
  }
}
@media (max-width: 768px) {
  .tour-card {
    border-radius: 8px !important;
  }
  .tour-card-img-wrap {
    border-radius: 8px 8px 0 0 !important;
  }
}
@media (min-width: 1200px) {
  .testimonials-section .section-list-wrap {
    margin-left: 350px;
    margin-right: 350px;
    /* Ortalamak için genişlik ve margin ayarla */
    width: auto;
    max-width: none;
  }
  .testimonials-section .container.swiper-no-padding {
    padding: 0;
    margin: 0;
    width: 100%;
    max-width: 100%;
  }
  .testimonials-section .swiper {
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .testimonials-section .swiper-wrapper {
    display: flex;
    align-items: stretch;
    width: 100%;
    margin: 0;
  }
  .testimonial-card {
    min-height: 320px;
    height: 320px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    transition: box-shadow 0.25s;
    cursor: pointer;
    z-index: 1;
    position: relative;
  }
  .testimonial-card .testimonial-content {
    /* JS ile kısaltma yapıldığı için satır kırpma kaldırıldı */
    overflow: hidden;
    min-height: 7.5em;
    max-height: 7.5em;
    flex: 1 1 auto;
    transition: all 0.2s;
    display: block;
  }
  .testimonial-short {
    /* Sadece normal metin, ... JS ile eklenecek */
    white-space: pre-line;
  }
  /* Overlay ve büyüyen kart */
  .testimonial-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.35);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s;
  }
  .active-card-modal {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 40px rgba(34,51,102,0.18);
    max-width: 520px;
    width: 90vw;
    min-height: 320px;
    padding: 2.5rem 2rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    animation: growIn 0.22s cubic-bezier(.4,2,.6,1);
    position: relative;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes growIn {
    from { transform: scale(0.85); opacity: 0.5; }
    to { transform: scale(1); opacity: 1; }
  }
}
@media (max-width: 768px) {
  .active-card-modal {
    max-width: 98vw;
    width: 98vw;
    min-height: 60vh;
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    font-size: 1.08rem;
    border-radius: 10px;
    box-sizing: border-box;
    justify-content: flex-start;
  }
  .active-card-modal .testimonial-content {
    font-size: 1.08rem;
    margin-bottom: 1.2rem;
    text-align: left;
    min-height: 120px;
    max-height: 50vh;
    overflow-y: auto;
    white-space: pre-line;
  }
  .active-card-modal .testimonial-author {
    margin-top: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  .active-card-modal .testimonial-author img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  .active-card-modal .testimonial-author h4 {
    font-size: 1.08rem;
    margin: 0;
  }
  .active-card-modal .testimonial-author span {
    font-size: 0.98rem;
    color: #888;
  }
}
@media (min-width: 1200px) {
  /* Sağdan 350px margin için swiper'a padding ekle */
  .testimonials-section .swiper {
    padding-right: 350px;
  }
}
@media (min-width: 769px) {
  .testimonial-card .testimonial-author h4 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.08rem;
    margin: 0;
    max-width: 180px;
    display: block;
  }
  .active-card-modal .testimonial-author h4 {
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
    max-width: 100%;
    display: block;
  }
}
/* Hero Title Styles for SEO */
.hero-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
  z-index: 10;
  max-width: 800px;
  width: 90%;
  margin: 0;
  line-height: 1.2;
}

/* Tablet boyutları için kategori butonları responsive */
@media (max-width: 1024px) {
  .category-tabs {
    gap: 16px;
    max-width: 95vw;
  }
  .category-tab {
    font-size: 1.1rem;
    padding: 12px 20px 8px 20px;
  }
  .cat-icon {
    font-size: 1.2em;
  }
}

@media (max-width: 900px) {
  .category-tabs {
    gap: 12px;
    max-width: 98vw;
  }
  .category-tab {
    font-size: 1rem;
    padding: 10px 16px 6px 16px;
  }
  .cat-icon {
    font-size: 1.1em;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 1.1rem;
    max-width: 90%;
    line-height: 1.1;
    top: 45%;
  }
  .category-tabs {
    gap: 12px;
  }
  .category-tab {
    font-size: 1rem;
    padding: 10px 20px 6px 20px;
  }
}

/* iPad Mini ve benzeri küçük tablet'ler için */
@media (max-width: 820px) and (min-width: 769px) {
  .category-tabs {
    gap: 10px;
    max-width: 98vw;
  }
  .category-tab {
    font-size: 0.95rem;
    padding: 8px 14px 4px 14px;
  }
  .cat-icon {
    font-size: 1em;
  }
}

/* Section subtitle styles for better SEO */
.section-subtitle {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.inline-link {
  color: #FC6421;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.inline-link:hover {
  color: #e6007a;
  text-decoration: underline;
}

/* Social Media Section Styles */
.social-media-section {
  padding: 4rem 0;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.social-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.social-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.social-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: white;
}

.social-card:nth-child(1) .social-icon {
  background: #1877f2;
}

.social-card:nth-child(2) .social-icon {
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}

.social-card:nth-child(3) .social-icon {
  background: #1da1f2;
}

.social-card:nth-child(4) .social-icon {
  background: #ff0000;
}

.social-card h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.social-card p {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.social-btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background: #FC6421;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.social-btn:hover {
  background: #e6007a;
  color: white;
  text-decoration: none;
}

.share-section {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #dee2e6;
}

.share-section h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.share-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  color: white;
  font-weight: 600;
  transition: opacity 0.3s ease;
}

.share-btn:hover {
  opacity: 0.8;
  color: white;
  text-decoration: none;
}

.share-btn.facebook {
  background: #1877f2;
}

.share-btn.twitter {
  background: #1da1f2;
}

.share-btn.linkedin {
  background: #0077b5;
}

.share-btn.whatsapp {
  background: #25d366;
}

@media (max-width: 768px) {
  .social-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .share-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .share-btn {
    width: 200px;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .testimonial-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 260px;
    height: 100%;
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    box-sizing: border-box;
  }
  .testimonial-card .testimonial-content {
    flex: 1 1 auto;
    font-size: 1.01rem;
    margin-bottom: 1.2rem;
    max-height: 50vh;
    overflow-y: auto;
    white-space: pre-line;
  }
  .testimonial-card .testimonial-author {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding-bottom: 0.2rem;
  }
  .testimonial-card .testimonial-author img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  .testimonial-card .testimonial-author h4 {
    font-size: 1rem;
    margin: 0;
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
    max-width: 100%;
    display: block;
  }
  .testimonial-card .testimonial-author span {
    font-size: 0.95rem;
    color: #888;
  }
}
@media (max-width: 768px) {
  .testimonials-section .testimonial-card {
    min-height: 250px !important;
    height: 250px !important;
  }
}
@media (min-width: 1200px) {
  .category-list-wrap {
    margin-left: 350px;
    margin-right: 350px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .tour-card-grid {
    margin-left: 0;
    margin-right: 0;
    padding: 0;
    width: 100%;
  }
}
.tour-card-action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  gap: 12px;
  min-height: 44px;
  align-items: flex-end;
}
.tour-card-book-btn {
  background: #FC6421;
  color: #fff;
  font-weight: 700;
  border-radius: 6px;
  padding: 0.6rem 1.4rem;
  font-size: 1.08rem;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
  border: none;
  outline: none;
  cursor: pointer;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tour-card-book-btn:hover {
  background: #e6007a;
  color: #fff;
}
.tour-card-price-label {
  color: #888;
  font-size: 0.98em;
  margin-left: 4px;
}
@media (max-width: 768px) {
  .tour-card-action-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-top: 12px;
  }
  .tour-card-book-btn {
    width: 100%;
    text-align: center;
    padding: 0.8rem 0;
    font-size: 1.12rem;
    height: 48px;
  }
  .tour-card {
    min-height: 480px;
    height: 480px;
  }
  .tour-card-content {
    padding: 1rem 1rem 1.2rem 1rem;
    height: 60%;
  }
}
@media (min-width: 1200px) {
  .tour-card-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    padding: 0 1vw;
  }
  .tour-card {
    min-width: 0;
    max-width: 320px;
    margin: 0 auto;
  }
  .category-list-wrap {
    max-width: 1400px;
    margin: 0 auto;
  }
}
</style>
