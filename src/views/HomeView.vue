<template>
  <div class="home">
    <!-- Top Banner (Istanbul Sunset Yacht Tour) -->
    <div class="top-banner" v-if="sunsetYachtTour">
      <span>{{ sunsetYachtTour.content?.[0]?.name || 'Istanbul Sunset Yacht Tour' }} - {{ getReactiveTourPrice(sunsetYachtTour) }}</span>
      <router-link :to="`${sunsetYachtTour.slug_url}`" class="buy-now-btn">{{ $t('home.hero.buyNow') }}</router-link>
    </div>

    <!-- Hero Section with Main Visual and Badge -->
    <section class="hero-section">
      <!-- Desktop Hero -->
      <div class="hero-img-wrap desktop-only">
        <div class="hero-title-content">
          <h1 class="hero-section__header">
            <span class="text-atom--headline-2">{{ $t('home.hero.title') }}</span>
          </h1>
        </div>
        
        <!-- Desktop Hero Image -->
        <img class="hero-img" :src="currentHeroImage" :alt="currentHeroAlt" loading="eager" fetchpriority="high" />
        
        <div class="hero-img-gradient"></div>
    
        <!-- Kategori Butonları -->
        <div class="category-tabs">
          <button v-for="cat in categories" :key="cat.value"
            :class="['category-tab', { active: selectedCategory === cat.value }]" @click="selectedCategory = cat.value">
            <span class="cat-icon" v-html="cat.icon"></span>
            <span>{{ $t(cat.label) }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile Hero -->
      <div class="hero-img-wrap mobile-only">
        <div class="hero-title-content">
          <h1 class="hero-section__header">
            <span class="text-atom--headline-2">{{ $t('home.hero.title') }}</span>
          </h1>
        </div>
        
        <!-- Mobile Hero Image -->
        <img class="hero-img" :src="currentMobileHeroImage" :alt="currentMobileHeroAlt" loading="eager" fetchpriority="high" />
        
        <div class="hero-img-gradient"></div>
    
        <!-- Kategori Butonları -->
        <div class="category-tabs">
          <button v-for="cat in categories" :key="cat.value"
            :class="['category-tab', { active: selectedCategory === cat.value }]" @click="selectedCategory = cat.value">
            <span class="cat-icon" v-html="cat.icon"></span>
            <span>{{ $t(cat.label) }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Kategoriye Göre Tur Listesi veya Yakında -->
    <section class="category-section">
      <div v-if="selectedCategory === 'culture'">
        <div class="category-list-wrap">
          <h2 class="category-title">{{ $t('home.categories.title') }}</h2>
          <!-- Masaüstü: Grid, Mobil: Swiper -->
          <div class="tour-card-grid desktop-only">
            <router-link v-for="tour in cultureTours" :key="tour.id" :to="`${tour.slug_url}`" class="tour-card"
              style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;">
              <div class="" style="    border: 1px solid #dcdfe4;height: 100%;">
              <div class="tour-card-img-wrap">
                <img :src="getAttractionImage(tour)" :alt="getAttractionName(tour)" />
                <!-- Likely to sell out badge -->
                <div v-if="isLikelyToSellOut(tour.id)" class="sell-out-badge">
                  {{ $t('home.common.likelyToSellOut') }}
                </div>
                <!-- Bestseller badge -->
                <div v-if="isBestseller(tour.id)" class="bestseller-badge">
                  {{ $t('home.common.bestseller') }}
                </div>
              </div>
              <!-- Kart içeriği -->
              <div class="tour-card-content">
                <div class="tour-card-type">{{ tour.type || 'GUIDED TOURS' }}</div>
                <div class="tour-card-title">{{ getAttractionName(tour) }}</div>
                <div class="tour-card-desc">{{ getAttractionDescription(tour) }}</div>
                <div class="tour-card-bottom">
                  <div class="tour-card-action-row">
                    <span class="tour-card-price">{{ getReactiveTourPrice(tour) }} <span class="tour-card-price-label">/
                        1 adult</span></span>
                    <router-link :to="`${tour.slug_url}`" class="tour-card-book-btn">{{ $t('home.common.bookNow') }}</router-link>
                  </div>
                </div>
              </div>
            </div>
            </router-link>
          </div>
        </div>
        <swiper class="tour-card-swiper mobile-only" :slides-per-view="1" :space-between="0" :centered-slides="false"
          :pagination="{ clickable: true }" :breakpoints="{
            0: { slidesPerView: 1, spaceBetween: 0, centeredSlides: false },
            769: { slidesPerView: 2, spaceBetween: 16, centeredSlides: false }
          }" style="padding-bottom: 32px;">
          <swiper-slide v-for="tour in cultureTours" :key="tour.id">
            <router-link :to="`${tour.slug_url}`" class="tour-card"
              style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;">
              <div class="tour-card-img-wrap">
                <img :src="getAttractionImage(tour)" :alt="getAttractionName(tour)" />
                <!-- Likely to sell out badge -->
                <div v-if="isLikelyToSellOut(tour.id)" class="sell-out-badge">
                  {{ $t('home.common.likelyToSellOut') }}
                </div>
                <!-- Bestseller badge -->
                <div v-if="isBestseller(tour.id)" class="bestseller-badge">
                  {{ $t('home.common.bestseller') }}
                </div>
              </div>
              <div class="tour-card-content">
                <div class="tour-card-type">{{ tour.type || 'GUIDED TOURS' }}</div>
                <div class="tour-card-title">{{ getAttractionName(tour) }}</div>
                <div class="tour-card-desc">{{ getAttractionDescription(tour) }}</div>
                <div class="tour-card-bottom">
                  <div class="tour-card-action-row">
                    <span class="tour-card-price">{{ getReactiveTourPrice(tour) }} <span class="tour-card-price-label">/
                        1 adult</span></span>
                    <router-link :to="`${tour.slug_url}`" class="tour-card-book-btn">{{ $t('home.common.bookNow') }}</router-link>
                  </div>
                </div>
              </div>
            </router-link>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div v-else>
        <h2 class="category-title">{{ $t('home.categories.comingSoon') }}</h2>
        <div class="coming-soon">{{ $t('home.categories.comingSoonText') }}</div>
      </div>
    </section>

    <!-- Why Choose Section (Yellow Info Bar) -->
    <div class="why-choose-bar">
      <span>{{ $t('home.whyChooseBar.title') }}</span> {{ $t('home.whyChooseBar.subtitle') }}<b>{{ $t('home.whyChooseBar.highlight') }}</b>
    </div>

    <!-- Features Section -->
    <section class="features-section desktop-only">
      <div class="section-list-wrap">
        <div class="container swiper-no-padding">
          <h2 class="section-title">{{ $t('home.whyChoose.title') }}</h2>
          <div class="features-grid-desktop">
            <div class="feature-card" v-for="feature in features" :key="feature.id">
              <div class="feature-icon">
                <i :class="feature.icon"></i>
              </div>
              <h3>{{ $t(feature.title) }}</h3>
              <p>{{ $t(feature.description) }}</p>
            </div>
          </div>
          <!-- Mobile Swiper -->
          <swiper class="features-swiper-mobile" :slides-per-view="1" :space-between="0" :centered-slides="false"
            :pagination="{ clickable: true }"
            :breakpoints="{ 0: { slidesPerView: 1, spaceBetween: 0, centeredSlides: false } }">
            <swiper-slide v-for="feature in features" :key="feature.id">
              <div class="feature-card">
                <div class="feature-icon">
                  <i :class="feature.icon"></i>
                </div>
                <h3>{{ $t(feature.title) }}</h3>
                <p>{{ $t(feature.description) }}</p>
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
          <h2 class="section-title">{{ $t('home.attractions.title') }}</h2>
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>{{ $t('home.attractions.loading') }}</p>
          </div>
          <div v-else-if="error" class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>{{ $t('home.attractions.error') }}</h3>
            <p>{{ error }}</p>
            <button @click="fetchAttractions" class="retry-button">
              <i class="fas fa-redo"></i> {{ $t('home.attractions.retry') }}
            </button>
          </div>
          <!-- Masaüstü Swiper -->
          <swiper class="desktop-only" :slides-per-view="3" :space-between="16" :centered-slides="false"
            :pagination="{ clickable: true }" :breakpoints="{
              0: { slidesPerView: 1, spaceBetween: 0, centeredSlides: false },
              769: { slidesPerView: 3, spaceBetween: 16, centeredSlides: false },
              1200: { slidesPerView: 3, spaceBetween: 16, centeredSlides: false }
            }" style="padding-bottom: 32px;">
            <swiper-slide v-for="attraction in attractions" :key="attraction.id">
              <router-link :to="`${attraction.slug_url}`" class="attraction-card slider-card"
                style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;">
                <div class="attraction-image">
                  <img :src="getAttractionImage(attraction)" :alt="getAttractionName(attraction)" />
                </div>
                <div class="attraction-content">
                  <h3>{{ getAttractionName(attraction) }}</h3>
                  <!-- <p>{{ getAttractionDescription(attraction) }}</p> -->
                  <div class="attraction-meta">
                  </div>
                </div>
              </router-link>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
          <!-- Mobil Swiper -->
          <swiper class="attractions-slider-mobile mobile-only" :slides-per-view="1" :space-between="0"
            :centered-slides="false" :pagination="{ clickable: true }" :breakpoints="{
              0: { slidesPerView: 1, spaceBetween: 0, centeredSlides: false },
              769: { slidesPerView: 2, spaceBetween: 16, centeredSlides: false }
            }" style="padding-bottom: 32px;">
            <swiper-slide v-for="attraction in attractions" :key="attraction.id">
              <router-link :to="`${attraction.slug_url}`" class="attraction-card slider-card"
                style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;">
                <div class="attraction-image">
                  <img :src="getAttractionImage(attraction)" :alt="getAttractionName(attraction)" />
                </div>
                <div class="attraction-content">
                  <h3>{{ getAttractionName(attraction) }}</h3>
                  <!-- <p>{{ getAttractionDescription(attraction) }}</p> -->
                  <div class="attraction-meta">
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
    <section class="pass-types-section" v-if="passTypes.length > 0">
      <div class="section-list-wrap">
        <div class="container swiper-no-padding">
          <h2 class="section-title">{{ $t('home.passTypes.title') }}</h2>
          <p class="section-subtitle">{{ $t('home.passTypes.subtitle') }}</p>
          <swiper class="pass-types-slider" :slides-per-view="3" :space-between="16" :centered-slides="false"
            :pagination="{ clickable: true }" :breakpoints="{
              0: { slidesPerView: 1, spaceBetween: 0, centeredSlides: false },
              769: { slidesPerView: 3, spaceBetween: 16, centeredSlides: false }
            }">
            <swiper-slide v-for="pass in passTypes" :key="pass.id">
              <router-link :to="pass.link" class="pass-card" style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;">
                <div class="pass-header">
                  <h3>{{ pass.name }}</h3>
                  <div class="pass-price">{{ pass.price }}</div>
                </div>
                <div class="pass-features">
                  <ul>
                    <li v-for="feature in pass.features" :key="feature">{{ $t(feature) }}</li>
                  </ul>
                </div>
                <div class="pass-action">
                  <span class="btn btn-primary">{{ $t('home.passTypes.selectPass') }}</span>
                </div>
              </router-link>
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
          <h2 class="section-title">{{ $t('home.testimonials.title') }}</h2>
          <p class="section-subtitle">{{ $t('home.testimonials.subtitle') }}</p>
          <swiper :slides-per-view="3" :space-between="16" :centered-slides="false" :pagination="{ clickable: true }"
            :breakpoints="{
              0: { slidesPerView: 1, spaceBetween: 0, centeredSlides: false },
              769: { slidesPerView: 2, spaceBetween: 16, centeredSlides: false },
              1200: { slidesPerView: 3, spaceBetween: 16, centeredSlides: false }
            }">
            <swiper-slide v-for="testimonial in testimonials" :key="testimonial.id">
              <div class="testimonial-card slider-card" :class="{ active: activeTestimonialId === testimonial.id }"
                @click="openTestimonialCard(testimonial.id)">
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
            "{{testimonials.find(t => t.id === activeTestimonialId).text}}"
          </div>
          <div class="testimonial-author">
            <img v-if="testimonials.find(t => t.id === activeTestimonialId).avatar"
              :src="testimonials.find(t => t.id === activeTestimonialId).avatar"
              :alt="testimonials.find(t => t.id === activeTestimonialId).name">
            <div>
              <h4>{{testimonials.find(t => t.id === activeTestimonialId).name}}</h4>
              <span>{{testimonials.find(t => t.id === activeTestimonialId).location}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { useCurrencyStore } from '../stores/currency'

// Import hero images
import heroImage1 from '../assets/images/1.webp'
import heroImage2 from '../assets/images/2.webp'
import heroImage3 from '../assets/images/3.webp'
import heroImage4 from '../assets/images/4.webp'
import heroImage5 from '../assets/images/5.webp'

// Import mobile hero images
import mobileHeroImage1 from '../assets/images/mobile/1.webp'
import mobileHeroImage2 from '../assets/images/mobile/2.webp'
import mobileHeroImage3 from '../assets/images/mobile/3.webp'
import mobileHeroImage4 from '../assets/images/mobile/4.webp'
import mobileHeroImage5 from '../assets/images/mobile/5.webp'

// Hero slider data
const heroImages = [
  { src: heroImage1, alt: 'Istanbul Attraction 1' },
  { src: heroImage2, alt: 'Istanbul Attraction 2' },
  { src: heroImage3, alt: 'Istanbul Attraction 3' },
  { src: heroImage4, alt: 'Istanbul Attraction 4' },
  { src: heroImage5, alt: 'Istanbul Attraction 5' }
]

// Mobile hero slider data
const mobileHeroImages = [
  { src: mobileHeroImage1, alt: 'Istanbul Mobile Attraction 1' },
  { src: mobileHeroImage2, alt: 'Istanbul Mobile Attraction 2' },
  { src: mobileHeroImage3, alt: 'Istanbul Mobile Attraction 3' },
  { src: mobileHeroImage4, alt: 'Istanbul Mobile Attraction 4' },
  { src: mobileHeroImage5, alt: 'Istanbul Mobile Attraction 5' }
]

const currentHeroIndex = ref(0)
const heroSliderInterval = ref(null)

// Mobile hero slider variables
const currentMobileHeroIndex = ref(0)
const mobileHeroSliderInterval = ref(null)

// Computed properties for current image
const currentHeroImage = computed(() => {
  return heroImages[currentHeroIndex.value]?.src || heroImages[0].src
})

const currentHeroAlt = computed(() => {
  return heroImages[currentHeroIndex.value]?.alt || heroImages[0].alt
})

// Computed properties for mobile hero image
const currentMobileHeroImage = computed(() => {
  return mobileHeroImages[currentMobileHeroIndex.value]?.src || mobileHeroImages[0].src
})

const currentMobileHeroAlt = computed(() => {
  return mobileHeroImages[currentMobileHeroIndex.value]?.alt || mobileHeroImages[0].alt
})

// Reactive data
const features = ref([
  {
    id: 1,
    icon: 'fas fa-ticket-alt',
    title: 'home.whyChoose.features.skipLines.title',
    description: 'home.whyChoose.features.skipLines.description'
  },
  {
    id: 2,
    icon: 'fas fa-save',
    title: 'home.whyChoose.features.saveMoney.title',
    description: 'home.whyChoose.features.saveMoney.description'
  },
  {
    id: 3,
    icon: 'fas fa-map-marked-alt',
    title: 'home.whyChoose.features.attractions.title',
    description: 'home.whyChoose.features.attractions.description'
  },
  {
    id: 4,
    icon: 'fas fa-clock',
    title: 'home.whyChoose.features.flexibleDuration.title',
    description: 'home.whyChoose.features.flexibleDuration.description'
  }
])

const attractions = ref([])
const loading = ref(false)
const error = ref(null)
const currentLanguage = ref('en')
const sunsetYachtTour = ref(null)

// Likely to sell out system
const sellOutInterval = ref(null)
const currentSellOutTourId = ref(null)

// Bestseller system - API'den gelen best_seller alanını kullan
const bestsellerTours = ref([]) // API'den gelen bestseller turları

// i18n
const { t } = useI18n()

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

// Dil değişikliklerini dinlemek için event listener
const handleLanguageChange = (event) => {
  if (event.detail && event.detail.language) {
    console.log('HomeView: Language changed to:', event.detail.language)
    // currentLanguage'i güncelle
    currentLanguage.value = event.detail.language
    // API'den yeni dilde veri çek
    fetchAttractions()
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
  try {
    loading.value = true
    error.value = null
    
    // Clear existing sell out interval before fetching new data
    if (sellOutInterval.value) {
      clearInterval(sellOutInterval.value)
      sellOutInterval.value = null
    }

    // Güvenli değer alma - localStorage'dan güncel dili al
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'
    const languageId = getLanguageId(savedLanguage)

    // Her zaman EUR fiyatları al (currency_id=4)
    const currencyId = 4 // EUR

    const url = `https://backend.searchyourtour.com/api/tours?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1&language_id=${languageId}&currency_id=${currencyId}&limit=200&IpAdrress=78.177.166.135`

    console.log('Fetching tours from:', url)

    const response = await fetch(url)
    if (!response.ok) {
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url: url
      })
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    const istanbulTours = (data || []).filter(tour => 
      tour.destination?.id === 404 && 
      tour.is_active === true &&
      tour.tour_price?.[0]?.price && 
      tour.tour_price[0].price > 0
    )

    // Debug: API'den gelen tour verilerini kontrol et
    console.log('=== API RESPONSE DEBUG ===')
    console.log('Total tours found:', istanbulTours.length)
    console.log('API called with currency_id:', currencyId, '(EUR)')
    
    // Fiyat bilgisi olmayan turları da sayalım
    const allIstanbulTours = (data || []).filter(tour => tour.destination?.id === 404 && tour.is_active === true)
    const toursWithoutPrice = allIstanbulTours.filter(tour => !tour.tour_price?.[0]?.price || tour.tour_price[0].price <= 0)
    console.log(`Tours without price: ${toursWithoutPrice.length}`)
    console.log(`Tours with price: ${istanbulTours.length}`)
    
    istanbulTours.slice(0, 5).forEach((tour, index) => {
      console.log(`\n${index + 1}. Tour ID: ${tour.id}`)
      console.log(`   Name: ${tour.content?.[0]?.name}`)
      console.log(`   Price data:`, tour.tour_price?.[0])
      console.log(`   Raw price: ${tour.tour_price?.[0]?.price}`)
      console.log(`   Price type: ${typeof tour.tour_price?.[0]?.price}`)
      console.log(`   Currency code: ${tour.tour_price?.[0]?.currency_code}`)
    })
    
    // Istanbul Sunset Yacht Tour'u bul (ID: 63)
    const foundSunsetYachtTour = istanbulTours.find(tour => tour.id === 63)
    
    if (foundSunsetYachtTour) {
      sunsetYachtTour.value = foundSunsetYachtTour
      console.log('\n=== ISTANBUL SUNSET YACHT TOUR FOUND ===')
      console.log(`Tour ID: ${foundSunsetYachtTour.id}`)
      console.log(`Name: ${foundSunsetYachtTour.content?.[0]?.name}`)
      console.log(`Price: ${foundSunsetYachtTour.tour_price?.[0]?.price}`)
      console.log('=========================================')
    } else {
      console.log('\n=== ISTANBUL SUNSET YACHT TOUR (ID: 63) NOT FOUND ===')
      console.log('Available tour IDs:')
      istanbulTours.slice(0, 10).forEach(tour => {
        console.log(`- ID: ${tour.id}, Name: ${tour.content?.[0]?.name}`)
      })
      console.log('=====================================================')
    }
    console.log('=== END API DEBUG ===')

    attractions.value = istanbulTours
    
    // Bestseller turları filtrele
    bestsellerTours.value = istanbulTours
      .filter(tour => tour.best_seller === true)
      .map(tour => tour.id)
    
  } catch (err) {
    console.error('Detailed error:', err)
    error.value = 'Sorry, we are unable to load attraction information at the moment. Please try again later.'

    // API çalışmıyorsa boş liste göster, kullanıcıya hata mesajı ver
    if (err.message.includes('500') || err.message.includes('Failed to fetch')) {
      console.log('API is not available, showing empty state')
      attractions.value = []
    }
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

// Likely to sell out functions
const isLikelyToSellOut = (tourId) => {
  return currentSellOutTourId.value === tourId
}

// Bestseller functions
const isBestseller = (tourId) => {
  return bestsellerTours.value.includes(tourId)
}

const rotateSellOutBadge = () => {
  if (attractions.value.length === 0) return
  
  // Randomly select a new tour for the badge
  const randomIndex = Math.floor(Math.random() * attractions.value.length)
  const newTourId = attractions.value[randomIndex].id
  currentSellOutTourId.value = newTourId
  
  // Save to localStorage with timestamp
  const badgeData = {
    tourId: newTourId,
    timestamp: Date.now(),
    interval: Math.random() * (4 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000) + 3 * 60 * 60 * 1000
  }
  localStorage.setItem('sellOutBadge', JSON.stringify(badgeData))
  
  console.log(`"Likely to sell out" badge moved to tour ID: ${newTourId}`)
}

const startSellOutRotation = () => {
  // Clear any existing interval first
  if (sellOutInterval.value) {
    clearInterval(sellOutInterval.value)
    sellOutInterval.value = null
  }
  
  // Check if there's existing badge data in localStorage
  const existingBadgeData = localStorage.getItem('sellOutBadge')
  let shouldRotate = true
  let interval = 0
  
  if (existingBadgeData) {
    try {
      const badgeData = JSON.parse(existingBadgeData)
      const timeElapsed = Date.now() - badgeData.timestamp
      
      // If the interval hasn't passed yet, keep the same tour
      if (timeElapsed < badgeData.interval) {
        currentSellOutTourId.value = badgeData.tourId
        shouldRotate = false
        interval = badgeData.interval - timeElapsed
        
        const remainingHours = Math.round(interval / (60 * 60 * 1000) * 10) / 10
        console.log(`"Likely to sell out" badge continuing with tour ID: ${badgeData.tourId}, remaining time: ${remainingHours} hours`)
      }
    } catch (error) {
      console.warn('Error parsing badge data from localStorage:', error)
    }
  }
  
  // If we should rotate (no existing data or interval has passed)
  if (shouldRotate) {
    rotateSellOutBadge()
    // Get the interval from the badge data we just saved
    const badgeData = JSON.parse(localStorage.getItem('sellOutBadge'))
    interval = badgeData.interval
  }
  
  // Set up the interval for the next rotation
  sellOutInterval.value = setInterval(() => {
    rotateSellOutBadge()
  }, interval)
  
  const hours = Math.round(interval / (60 * 60 * 1000) * 10) / 10
  console.log(`Sell out badge rotation started with ${hours} hour interval`)
}

// Hero slider functions
const nextHeroSlide = () => {
  currentHeroIndex.value = (currentHeroIndex.value + 1) % heroImages.length
  console.log(`Hero image changed to index: ${currentHeroIndex.value}`)
}

const startHeroSlider = () => {
  // Clear any existing interval first
  stopHeroSlider()
  
  // Change image every 10 seconds
  heroSliderInterval.value = setInterval(() => {
    nextHeroSlide()
  }, 10000)
  
  console.log('Hero slider started with 10 second intervals')
}

const stopHeroSlider = () => {
  if (heroSliderInterval.value) {
    clearInterval(heroSliderInterval.value)
    heroSliderInterval.value = null
    console.log('Hero slider stopped')
  }
}

// Mobile hero slider functions
const nextMobileHeroSlide = () => {
  currentMobileHeroIndex.value = (currentMobileHeroIndex.value + 1) % mobileHeroImages.length
  console.log(`Mobile hero image changed to index: ${currentMobileHeroIndex.value}`)
}

const startMobileHeroSlider = () => {
  // Clear any existing interval first
  stopMobileHeroSlider()
  
  // Change image every 10 seconds
  mobileHeroSliderInterval.value = setInterval(() => {
    nextMobileHeroSlide()
  }, 10000)
  
  console.log('Mobile hero slider started with 10 second intervals')
}

const stopMobileHeroSlider = () => {
  if (mobileHeroSliderInterval.value) {
    clearInterval(mobileHeroSliderInterval.value)
    mobileHeroSliderInterval.value = null
    console.log('Mobile hero slider stopped')
  }
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

// Pass turları - API'den gelen pass: true olan turları filtrele
const passTypes = computed(() => {
  return attractions.value
    .filter(tour => tour.pass === true)
    .slice(0, 3) // Maksimum 3 pass kartı göster
    .map(tour => ({
      id: tour.id,
      name: getAttractionName(tour),
      price: getReactiveTourPrice(tour),
      features: [
        'home.passTypes.features.access',
        'home.passTypes.features.skipLine',
        'home.passTypes.features.guidedTours',
        'home.passTypes.features.mobileTicket'
      ],
      link: `${tour.slug_url}`,
      tour: tour // Orijinal tur verisini de sakla
    }))
})

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
  // Masaüstü ve tablet boyutlarında büyütme/overlay aç
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
  // Add event listener for language changes
  window.addEventListener('language-changed', handleLanguageChange)
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
  
  // Start hero sliders
  startHeroSlider()
  startMobileHeroSlider()
  
  // Start sell out badge rotation after attractions are loaded
  watch(attractions, (newAttractions) => {
    if (newAttractions.length > 0 && !sellOutInterval.value) {
      startSellOutRotation()
    }
  }, { immediate: true })
  
  // Dil değişikliklerini izle
  watch(() => currentLanguage.value, (newLang, oldLang) => {
    if (newLang !== oldLang) {
      console.log('Language changed from', oldLang, 'to', newLang)
      // Clear existing badge data for new language
      localStorage.removeItem('sellOutBadge')
      // Clear bestseller data
      bestsellerTours.value = []
      // API'den yeni dilde veri çek
      fetchAttractions()
      // Sell out badge rotation'ı yeniden başlat
      if (attractions.value.length > 0) {
        startSellOutRotation()
      }
    }
  })
})

onBeforeUnmount(() => {
  // Remove event listeners
  window.removeEventListener('currency-changed', handleCurrencyChange)
  window.removeEventListener('language-changed', handleLanguageChange)
  
  // Clear hero slider intervals
  stopHeroSlider()
  stopMobileHeroSlider()
  
  // Clear sell out interval
  if (sellOutInterval.value) {
    clearInterval(sellOutInterval.value)
    sellOutInterval.value = null
  }
})

// Kategoriler
const categories = [
  { value: 'culture', label: 'home.categories.culture', icon: '<i class="fas fa-landmark"></i>' },
  { value: 'food', label: 'home.categories.food', icon: '<i class="fas fa-utensils"></i>' },
  { value: 'nature', label: 'home.categories.nature', icon: '<i class="fas fa-mountain"></i>' },
  { value: 'sport', label: 'home.categories.sport', icon: '<i class="fas fa-running"></i>' }
]
const selectedCategory = ref('culture')

// Kültür kategorisi için turlar - özel sıralama ile
const cultureTours = computed(() => {
  // İstediğiniz tur ID'lerini buraya sırayla yazın
  const preferredTourOrder = [
    81,  
    125,
    80,
    126,  
    79,  
    63,  
    56,
    124,
      // Beşinci öncelikli tur
    // Daha fazla tur ID'si ekleyebilirsiniz
  ]
  
  // Önce tercih edilen sıraya göre turları al
  const orderedTours = []
  const remainingTours = [...attractions.value]
  
  // Tercih edilen sıraya göre turları ekle
  preferredTourOrder.forEach(tourId => {
    const tourIndex = remainingTours.findIndex(tour => tour.id === tourId)
    if (tourIndex !== -1) {
      orderedTours.push(remainingTours[tourIndex])
      remainingTours.splice(tourIndex, 1)
    }
  })
  
  // Kalan turları da ekle
  orderedTours.push(...remainingTours)
  
  return orderedTours
})


</script>

<style scoped>
@import 'swiper/swiper-bundle.css';

.home {
  padding-top: 0 !important;
}

.features-slider,
.attractions-slider,
.pass-types-slider,
.testimonials-slider {
  width: 100%;
  padding-bottom: 2.5rem;
}

.attraction-card,
.slider-card {
  display: block;
  width: 100%;
  height: 100%;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
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

  /* Popular Attractions slider için özel height */
  .attractions-slider-mobile .attraction-card {
    min-height: 320px !important;
    height: 320px !important;
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

  /* Popular Attractions slider için özel swiper-slide height */
  .attractions-slider-mobile .swiper-slide {
    min-height: 320px !important;
    height: 320px !important;
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

  /* Hero image mobile responsive */
  .hero-img-wrap {
    height: 400px;
  }

  .hero-img {
    height: 400px;
  }

  /* Mobile hero specific styles */
  .mobile-only .hero-img-wrap {
    height: 400px;
  }

  .mobile-only .hero-img {
    height: 400px;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
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
  display: block;
  transition: opacity 0.5s ease-in-out;
}

.hero-img-gradient {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 40%;
  background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  background: rgba(44, 62, 80, 0.92);
  color: #fff;
  font-size: 0.95rem;
  border-radius: 8px;
  padding: 0.3rem 0.9rem;
  z-index: 3;
}

/* Responsive hero badge and label sizing */
@media (max-width: 1200px) {
  .hero-badge {
    font-size: 1rem;
    padding: 0.35rem 1rem;
  }

  .hero-label {
    font-size: 0.9rem;
    padding: 0.25rem 0.8rem;
  }
}

@media (max-width: 900px) {
  .hero-badge {
    font-size: 0.95rem;
    padding: 0.3rem 0.9rem;
    top: 15px;
    left: 10px;
  }

  .hero-label {
    font-size: 0.85rem;
    padding: 0.2rem 0.7rem;
    top: 12px;
    right: 12px;
  }
}

@media (max-width: 768px) {
  .hero-badge {
    font-size: 0.95rem;
    padding: 0.3rem 0.7rem;
    top: 10px;
    left: 7px;
  }

  .hero-label {
    font-size: 0.75rem;
    padding: 0.18rem 0.6rem;
    top: 8px;
    right: 8px;
  }
}

@media (max-width: 480px) {
  .hero-badge {
    font-size: 0.8rem;
    padding: 0.25rem 0.6rem;
    top: 8px;
    left: 6px;
  }

  .hero-label {
    font-size: 0.6rem;
    padding: 0.15rem 0.5rem;
    top: 6px;
    right: 6px;
  }
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

.stat-box.orange {
  background: #FC6421;
  color: #fff;
}

.stat-box.pink {
  background: #FC6421;
  color: #fff;
}

.stat-box.blue {
  background: #00b6e6;
  color: #fff;
}

.stat-box span {
  font-size: 1.3em;
}

.stat-box small {
  font-size: 0.8em;
  font-weight: 400;
}

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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  text-align: center;
  min-width: 110px;
}

@media (max-width: 1024px) {
    .hero-title-content {
        padding: 0 1.5rem;
    }
    
    .text-atom--headline-2 {
        font-size: 2.5rem !important;
        line-height: 3rem !important;
    }
}

@media (max-width: 768px) {
    .hero-title-content {
        padding: 0 1rem;
    }
    
    .text-atom--headline-2 {
        font-size: 1.8rem !important;
        line-height: 2.2rem !important;
    }
}

@media (max-width: 480px) {
    .hero-title-content {
        padding: 0 0.8rem;
    }
    
    .text-atom--headline-2 {
        font-size: 1.4rem !important;
        line-height: 1.8rem !important;
    }
}

.hero-title-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 900px;
  padding: 0 2rem;
  z-index: 999;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero-section__header {
  margin: 0;
  width: 100%;
  text-align: center;
}

.text-atom--headline-2 {
  font-size: 3rem;
  font-weight: 700;
  line-height: 4.25rem
}

.hero-title {

  color: #FC6421;
  margin: 1.2rem 0 0.2rem 0;

  font-size: 2.75rem;
  font-weight: 700;
  line-height: 3rem;

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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
  line-height: 0.8;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "Font Awesome 6 Solid", sans-serif;
}

.feature-icon i {
  font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "Font Awesome 6 Solid", sans-serif !important;
  font-weight: 900;
}

/* Font Awesome ikonları için genel kural */
.fas, .far, .fab, .fa-solid, .fa-regular, .fa-brands {
  font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "Font Awesome 6 Solid", sans-serif !important;
}

.fas, .fa-solid {
  font-weight: 900 !important;
}

.far, .fa-regular {
  font-weight: 400 !important;
}

.fab, .fa-brands {
  font-weight: 400 !important;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 520px;
  margin-bottom: 0;
  text-decoration: none;
  color: inherit;
}

.pass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-decoration: none;
  color: inherit;
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

.btn-primary {
  background: #FC6421;
  color: #fff;
  font-weight: 700;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  transition: background 0.2s, color 0.2s;
  border: none;
  outline: none;
  cursor: pointer;
  display: inline-block;
}

.btn-primary:hover {
  background: #e6007a;
  color: #fff;
  text-decoration: none;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  .top-banner {
    font-size: 0.98rem;
    padding: 0.6rem 0.7rem;
  }

  .hero-img-wrap,
  .hero-img {
    height: 160px;
  }

  .quick-stats {
    gap: 0.4rem;
  }

  .stat-box {
    font-size: 0.95rem;
    min-width: 65px;
    padding: 0.5rem 0.7rem;
  }

  .mini-stats-row {
    gap: 0.5rem;
  }

  .mini-stat {
    font-size: 0.85rem;
    min-width: 90px;
    padding: 0.4rem 0.5rem;
  }

  .cta-btn {
    font-size: 1rem;
    padding: 0.7rem 0;
  }

  .why-choose-bar {
    font-size: 0.95rem;
    padding: 0.5rem 0.5rem;
  }

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
  max-width: 90vw;
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
}

.category-tab.active {
  background: #FC6421;
  color: #fff;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.cat-icon {
  font-size: 1.5em;
  display: flex;
  align-items: center;
  font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "Font Awesome 6 Solid", sans-serif !important;
}

.cat-icon i {
  font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "Font Awesome 6 Solid", sans-serif !important;
  font-weight: 900 !important;
}

/* Kategori ikonları için özel kural */
.category-tab .cat-icon i {
  font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "Font Awesome 6 Solid", sans-serif !important;
  font-weight: 900 !important;
  display: inline-block !important;
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
  box-shadow: 0 2px 12px rgba(34, 51, 102, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
  position: relative;
  min-height: 540px;
  height: 540px;
}

.tour-card:hover {
  box-shadow: 0 4px 24px rgba(34, 51, 102, 0.16);
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

.sell-out-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: #ff0000;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.bestseller-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  padding-bottom: 16px;
  flex-shrink: 0;
}

.tour-card-type {
  color: #FC6421;
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  flex-shrink: 0;
}

.tour-card-title {
  color: #1a2b49;
  margin-bottom: 0.2rem;
  flex-shrink: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5rem;
}

.tour-card-desc {
  color: #444;
  margin-bottom: 0.2rem;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  font-size: .875rem;
  font-weight: 400;
  line-height: 1.25rem;
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
  color: #FC6421;
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

.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

/* 1200px altında mobil slider'a geç */
@media (max-width: 1199px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: block !important;
  }
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: block !important;
  }

  .tour-card-swiper .tour-card,
  .tour-card-swiper .swiper-slide {
    width: 90vw !important;
    max-width: 90vw !important;
    min-width: 90vw !important;
    margin: 0 auto;
  }
}

  /* Tablet boyutları için mobil slider'la aynı ayarlar */
@media (max-width: 1199px) and (min-width: 769px) {
  .tour-card-swiper {
    width: 100% !important;
    margin-left: 0 !important;
    padding: 0 20px !important;
  }

  .tour-card-swiper .swiper-slide {
    width: 50% !important;
    max-width: 50% !important;
    min-width: 50% !important;
    margin: 0 !important;
    padding: 0 8px !important;
    display: flex !important;
    align-items: stretch !important;
  }

  .tour-card-swiper .tour-card {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    margin: 0 !important;
  }

  .category-section,
  .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* Tablet boyutları için mobil kart stilleri */
  .tour-card {
    width: 96vw !important;
    max-width: 96vw !important;
    min-width: 96vw !important;
    margin: 0 auto 1.2rem auto !important;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.10);
  }

  .tour-card-content {
    padding: 1.2rem 1.2rem 1.4rem 1.2rem !important;
  }

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

  /* Tablet boyutları için attraction slider düzeltmesi */
  .attractions-section .desktop-only {
    display: none !important;
  }

  .attractions-section .mobile-only {
    display: block !important;
  }

  .attractions-slider-mobile {
    width: 100% !important;
    margin-left: 0 !important;
    padding: 0 20px !important;
  }

  .attractions-slider-mobile .swiper-slide {
    width: 50% !important;
    max-width: 50% !important;
    min-width: 50% !important;
    margin: 0 !important;
    padding: 0 8px !important;
    display: flex !important;
    align-items: stretch !important;
  }

  .attractions-slider-mobile .attraction-card {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    margin: 0 !important;
  }

  /* Tablet boyutları için testimonials slider - yeni sistem */
  .testimonials-section .swiper {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 20px !important;
  }

  .testimonials-section .swiper-wrapper {
    display: flex !important;
    align-items: stretch !important;
  }

  .testimonials-section .swiper-slide {
    width: 50% !important;
    max-width: 50% !important;
    min-width: 50% !important;
    margin: 0 !important;
    padding: 0 8px !important;
    display: flex !important;
    align-items: stretch !important;
  }

  .testimonials-section .testimonial-card {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    margin: 0 !important;
    min-height: 320px !important;
    height: auto !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
  }

  .testimonials-section .testimonial-content {
    flex: 1 !important;
    margin-bottom: 1rem !important;
    font-size: 0.95rem !important;
    line-height: 1.5 !important;
  }

  .testimonials-section .testimonial-author {
    margin-top: auto !important;
    padding-top: 1rem !important;
  }

  /* Tablet boyutları için testimonial modal düzeltmesi */
  .testimonial-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background: rgba(0, 0, 0, 0.5) !important;
    z-index: 9999 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 20px !important;
  }

  .active-card-modal {
    background: #fff !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2) !important;
    max-width: 600px !important;
    width: 90% !important;
    min-height: 300px !important;
    max-height: 80vh !important;
    padding: 2rem !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    overflow-y: auto !important;
  }

  .active-card-modal .testimonial-content {
    font-size: 1.1rem !important;
    margin-bottom: 1.5rem !important;
    text-align: left !important;
    line-height: 1.6 !important;
    white-space: pre-line !important;
  }

  .active-card-modal .testimonial-author {
    margin-top: auto !important;
    display: flex !important;
    align-items: center !important;
    gap: 1rem !important;
    padding-top: 1rem !important;
    border-top: 1px solid #eee !important;
  }

  .active-card-modal .testimonial-author img {
    width: 50px !important;
    height: 50px !important;
    border-radius: 50% !important;
    object-fit: cover !important;
  }

  .active-card-modal .testimonial-author h4 {
    font-size: 1.1rem !important;
    margin: 0 !important;
    color: #333 !important;
  }

  .active-card-modal .testimonial-author span {
    font-size: 0.95rem !important;
    color: #666 !important;
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

  /* Mobil için testimonials slider - yeni sistem */
  .testimonials-section .swiper {
    width: 100vw !important;
    margin-left: calc(-50vw + 50%) !important;
    padding: 0 !important;
  }

  .testimonials-section .swiper-slide {
    width: 100vw !important;
    max-width: 100vw !important;
    min-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    display: flex !important;
    justify-content: center !important;
  }

  .testimonials-section .testimonial-card {
    width: 92vw !important;
    max-width: 92vw !important;
    min-width: 92vw !important;
    margin: 0 auto !important;
    min-height: 250px !important;
    height: auto !important;
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

  /* Mobil attraction card için özel yükseklik */
  .attractions-slider-mobile .attraction-card {
    min-height: 320px !important;
    height: 320px !important;
  }

  .attractions-slider-mobile .attraction-content {
    padding: 1rem 1rem 1.2rem 1rem !important;
    height: auto !important;
    min-height: auto !important;
  }

  .attractions-slider-mobile .attraction-content h3 {
    margin-bottom: 0 !important;
    font-size: 1.1rem !important;
    line-height: 1.3 !important;
    text-align: center;
    padding: 0.5rem 0;
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
  .desktop-only {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .tour-card {
    width: 96vw !important;
    max-width: 96vw !important;
    min-width: 96vw !important;
    margin: 0 auto 1.2rem auto !important;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.10);
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

/* 1200px - 1600px arası için özel kural */
@media (min-width: 1200px) and (max-width: 1600px) {
  .testimonials-section {
    padding: 5rem 0;
  }

  .testimonials-section .section-list-wrap {
    margin-left: 200px;
    margin-right: 200px;
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

  .testimonials-section .swiper-slide {
    width: 33.333% !important;
    max-width: 33.333% !important;
    min-width: 33.333% !important;
    margin: 0 !important;
    padding: 0 12px !important;
    display: flex !important;
    align-items: stretch !important;
  }

  .testimonial-card {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    margin: 0 !important;
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
    overflow: hidden;
    min-height: 7.5em;
    max-height: 7.5em;
    flex: 1 1 auto;
    transition: all 0.2s;
    display: block;
  }

  .testimonial-short {
    white-space: pre-line;
  }
}

/* 1600px üstü için geniş ekran kuralı */
@media (min-width: 1601px) {
  .testimonials-section {
    padding: 5rem 0;
  }

  .testimonials-section .section-list-wrap {
    margin-left: 350px;
    margin-right: 350px;
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

  .testimonials-section .swiper-slide {
    width: 33.333% !important;
    max-width: 33.333% !important;
    min-width: 33.333% !important;
    margin: 0 !important;
    padding: 0 8px !important;
    display: flex !important;
    align-items: stretch !important;
  }

  .testimonial-card {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    margin: 0 !important;
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
    overflow: hidden;
    min-height: 7.5em;
    max-height: 7.5em;
    flex: 1 1 auto;
    transition: all 0.2s;
    display: block;
  }

  .testimonial-short {
    white-space: pre-line;
  }

  /* Overlay ve büyüyen kart */
  .testimonial-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s;
  }

  .active-card-modal {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 40px rgba(34, 51, 102, 0.18);
    max-width: 520px;
    width: 90vw;
    min-height: 320px;
    padding: 2.5rem 2rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    animation: growIn 0.22s cubic-bezier(.4, 2, .6, 1);
    position: relative;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes growIn {
    from {
      transform: scale(0.85);
      opacity: 0.5;
    }

    to {
      transform: scale(1);
      opacity: 1;
    }
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
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  z-index: 10;
  max-width: 800px;
  width: 90%;
  margin: 0;
  line-height: 1.2;
}

/* Responsive hero title sizing */
@media (max-width: 1200px) {
  .hero-title {
    font-size: 2.2rem;
    max-width: 85%;
  }
}

@media (max-width: 900px) {
  .hero-title {
    font-size: 1.8rem;
    max-width: 90%;
  }
}



@media (max-width: 480px) {
  .hero-title {
    font-size: 0.95rem;
    max-width: 95%;
    line-height: 1.1;
  }
}

/* Tablet boyutları için kategori butonları responsive */
@media (max-width: 1024px) {
  .category-tabs {
    gap: 20px;
  }

  .category-tab {
    font-size: 1.2rem;
    padding: 14px 28px 10px 28px;
  }
}

@media (max-width: 900px) {
  .category-tabs {
    gap: 16px;
  }

  .category-tab {
    font-size: 1.1rem;
    padding: 12px 24px 8px 24px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 1.1rem;
    max-width: 90%;
    line-height: 1.1;
    top: 45%;
  }
  
  .hero-img-wrap {
    height: 400px;
  }
  
  .hero-img {
    height: 400px;
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
    gap: 14px;
  }

  .category-tab {
    font-size: 1.05rem;
    padding: 11px 22px 7px 22px;
  }
}

/* 500px altı için kategori butonları optimize et */
@media (max-width: 500px) {
  .category-tabs {
    gap: 8px;
    max-width: 95vw;
  }

  .category-tab {
    font-size: 0.9rem;
    padding: 8px 12px 4px 12px;
  }

  .cat-icon {
    font-size: 1.2em;
    font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "Font Awesome 6 Solid", sans-serif !important;
  }
  
  .cat-icon i {
    font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "Font Awesome 6 Solid", sans-serif !important;
    font-weight: 900 !important;
  }
}

/* 400px altı için sadece ikonlar */
@media (max-width: 400px) {
  .category-tabs {
    gap: 6px;
    max-width: 98vw;
  }

  .category-tab {
    font-size: 0.8rem;
    padding: 6px 8px 2px 8px;
    min-width: 40px;
    justify-content: center;
  }

  .cat-icon {
    font-size: 1.3em;
    font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "Font Awesome 6 Solid", sans-serif !important;
  }
  
  .cat-icon i {
    font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "Font Awesome 6 Solid", sans-serif !important;
    font-weight: 900 !important;
  }

  .category-tab span:not(.cat-icon) {
    display: none;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.social-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
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

/* Loading ve Error State Stilleri */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FC6421;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  margin: 20px 0;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state h3 {
  color: #e53e3e;
  margin-bottom: 8px;
  font-size: 1.2rem;
}

.error-state p {
  color: #666;
  margin-bottom: 20px;
  max-width: 400px;
}

.retry-button {
  background: #FC6421;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background: #e55a1d;
}

.retry-button i {
  font-size: 14px;
}
</style>
