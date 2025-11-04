<template>
  <div class="blog-container">
    <div class="blog-header">
      <h1>{{ t('blog.title') }}</h1>
      <div class="subtitle">{{ t('blog.subtitle') }}</div>
    </div>

    <div class="blog-breadcrumb-wrapper">
      <Breadcrumb />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>{{ t('blog.loading') }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="blogPosts.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>{{ t('blog.emptyState.title') }}</h3>
      <p>{{ t('blog.emptyState.description') }}</p>
    </div>

    <!-- Blog Hero Slider -->
    <div v-else-if="sliderBlogs.length > 0" class="blog-hero-slider-wrapper">
      <div class="blog-hero-slider-container">
          <swiper
          :modules="[Navigation, Autoplay]"
          :slides-per-view="1"
          :loop="false"
          :autoplay="{
            delay: 5000,
            disableOnInteraction: false
          }"
          @slideChange="onSlideChange"
          class="blog-hero-slider"
          ref="heroSwiper"
        >
          <swiper-slide v-for="post in sliderBlogs" :key="post.id">
            <div 
              class="hero-slide"
              :style="{ backgroundImage: `url(${getBlogImage(post)})` }"
            >
              <div class="hero-overlay"></div>
              <h2 class="hero-title">
                <a @click="navigateToPost(post)" class="hero-title-link">
                  {{ getBlogTitle(post) }}
                </a>
              </h2>
              <div class="hero-content">
                <p class="hero-description">{{ getBlogExcerpt(post) }}</p>
                <div class="hero-meta">
                  <span class="hero-author-date">
                    <span class="hero-icon">📍</span>
                    Admin On {{ formatDate(post.created_at) }}
                  </span>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>

        <!-- Thumbnail Navigation -->
        <div class="blog-thumbnail-nav">
          <div 
            v-for="(post, index) in sliderBlogs" 
            :key="post.id"
            class="thumbnail-item"
            :class="{ active: activeSlideIndex === index }"
            @click="handleThumbnailClick(post, index)"
          >
            <div class="thumbnail-image">
              <img 
                :src="getBlogImage(post)" 
                :alt="getBlogTitle(post)"
                loading="lazy"
              />
            </div>
            <div class="thumbnail-content">
              <h6 class="thumbnail-title">{{ getBlogTitle(post) }}</h6>
              <span class="thumbnail-date">{{ formatDate(post.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Remaining Blog Posts Grid -->
    <div v-if="remainingBlogs.length > 0" class="blog-posts">
      <article 
        v-for="post in remainingBlogs" 
        :key="post.id" 
        class="blog-post"
        @click="navigateToPost(post)"
      >
        <div class="post-image">
          <img 
            :src="getBlogImage(post)" 
            :alt="getBlogTitle(post)"
            loading="lazy"
          />
          <div class="post-category" v-if="post.category_name && post.category_name !== 'Bulunamadı'">
            {{ post.category_name }}
          </div>
        </div>
        
        <div class="post-content">
          <div class="post-meta">
            <span class="post-date">{{ formatDate(post.created_at) }}</span>
            <span class="post-author" v-if="post.author">{{ post.author }}</span>
          </div>
          
          <h2 class="post-title">{{ getBlogTitle(post) }}</h2>
          
          <p class="post-excerpt">{{ getBlogExcerpt(post) }}</p>
          
          <div class="post-tags" v-if="post.category && post.category.length">
            <span 
              v-for="cat in post.category.slice(0, 3)" 
              :key="cat" 
              class="post-tag"
            >
              {{ cat }}
            </span>
          </div>
          
          <div class="read-more">
            {{ t('blog.readMore') }}
          </div>
        </div>
      </article>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="loadPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        {{ t('blog.pagination.previous') }}
      </button>
      
      <div class="pagination-numbers">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          @click="loadPage(page)"
          :class="['pagination-number', { active: page === currentPage }]"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        @click="loadPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        {{ t('blog.pagination.next') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import Breadcrumb from '../components/Breadcrumb.vue'

const router = useRouter()
const { t } = useI18n()

// Reactive data
const blogPosts = ref([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const postsPerPage = ref(20) // İlk 4 slider için, kalanlar grid için

// API Configuration
const API_BASE_URL = 'https://backend.searchyourtour.com/api'

// Reactive data for slider
const heroSwiper = ref(null)
const activeSlideIndex = ref(0)

// Computed properties
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Slider blogs (first 4 posts)
const sliderBlogs = computed(() => {
  return blogPosts.value.slice(0, 4)
})

// Remaining blogs (for grid below)
const remainingBlogs = computed(() => {
  return blogPosts.value.slice(4)
})

// Methods
const fetchBlogPosts = async (page = 1) => {
  try {
    loading.value = true
        // Güvenli değer alma - localStorage'dan güncel dili al
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'
    const languageId = getLanguageId(savedLanguage)
    // Fetch blog posts from API
    const response = await fetch(`${API_BASE_URL}/blogs?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1&page=${page}&limit=${postsPerPage.value}&language_id=${languageId}`)
    
    if (!response.ok) {
      throw new Error('Failed to load blog posts')
    }
    
    const data = await response.json()
    
    // Debug: API'den gelen image URL'lerini ve tarih bilgilerini kontrol et
    console.log('=== BLOG DATA DEBUG ===')
    if (data && data.length > 0) {
      data.slice(0, 3).forEach((post, index) => {
        console.log(`Blog ${index + 1} (ID: ${post.id}):`)
        console.log('  - created_at:', post.created_at)
        console.log('  - updated_at:', post.updated_at)
        console.log('  - images:', post.images)
        console.log('  - image array:', post.image)
        console.log('  - files:', post.files)
      })
    }
    console.log('=== END BLOG DATA DEBUG ===')
    
    // Adjust according to API response format and sort by created_at (newest first)
    if (data && Array.isArray(data)) {
      // Sort by created_at in descending order (newest first)
      blogPosts.value = data.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0)
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0)
        return dateB - dateA // Descending order (newest first)
      })
    } else {
      blogPosts.value = []
    }
    
    totalPages.value = Math.ceil(blogPosts.value.length / postsPerPage.value)
    currentPage.value = page
    
  } catch (error) {
    console.error('Error loading blog posts:', error)
    
    // Show empty array on error
    blogPosts.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
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


const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper functions to get blog content
const getBlogTitle = (post) => {
  if (post.blog_content && post.blog_content.length > 0) {
    return post.blog_content[0].title || `Blog Post ${post.id}`
  }
  return `Blog Post ${post.id}`
}

const getBlogExcerpt = (post) => {
  if (post.blog_content && post.blog_content.length > 0) {
    const description = post.blog_content[0].description || ''
    // Remove HTML tags and limit to 150 characters
    const plainText = description.replace(/<[^>]*>/g, '')
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
  }
  return 'Blog içeriği henüz eklenmemiş.'
}

const getBlogImage = (post) => {
  // Önce image array'ini kontrol et (Cloudinary path)
  if (post.image && post.image.length > 0) {
    const imagePath = post.image[0]
    // Cloudinary URL'sini oluştur
    return `https://res.cloudinary.com/dpen2pshi/image/upload/v1737105822/${imagePath}.webp`
  }
  
  // Sonra images field'ını kontrol et (eğer string ise)
  if (post.images && typeof post.images === 'string') {
    return post.images
  }
  
  // Son olarak files field'ını kontrol et
  if (post.files && post.files.length > 0) {
    return post.files[0].url || post.files[0]
  }
  
  // Hiçbiri yoksa placeholder
  return '/placeholder-blog.jpg'
}

const getBlogSlug = (post) => {
  // Use API's pre-generated slug if available, fallback to title-based generation
  if (post.blog_content && post.blog_content.length > 0 && post.blog_content[0].slug) {
    return post.blog_content[0].slug
  }
  
  // Fallback: Generate slug from title if API slug not available
  if (post.blog_content && post.blog_content.length > 0 && post.blog_content[0].title) {
    const title = post.blog_content[0].title
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }
  
  // Final fallback to ID
  return post.id
}

const navigateToPost = (post) => {
  // Navigate to blog post detail page using slug or ID
  const slug = getBlogSlug(post)
  console.log('=== NAVIGATION DEBUG ===')
  console.log('Post:', post)
  console.log('Generated slug:', slug)
  console.log('Navigating to:', `/blog/${slug}`)
  router.push(`/blog/${slug}`)
}

// Slider methods
const onSlideChange = (swiper) => {
  activeSlideIndex.value = swiper.activeIndex
}

const goToSlide = (index) => {
  if (heroSwiper.value) {
    // Swiper instance'ı kontrol et
    const swiperInstance = heroSwiper.value.swiper || heroSwiper.value
    if (swiperInstance && typeof swiperInstance.slideTo === 'function') {
      swiperInstance.slideTo(index, 500) // 500ms animasyon ile geçiş
      activeSlideIndex.value = index
    }
  }
}

const handleThumbnailClick = (post, index) => {
  // Slider'ı o slide'a geçir
  goToSlide(index)
  // Blog detay sayfasına yönlendir
  navigateToPost(post)
}

const loadPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchBlogPosts(page)
  }
}

// Dil değişikliklerini dinlemek için event listener
const handleLanguageChange = (event) => {
  if (event.detail && event.detail.language) {
    console.log('BlogView: Language changed to:', event.detail.language)
    // Mevcut sayfa ile yeniden fetch et - bu sayede slug'lar yeni dilde güncellenir
    fetchBlogPosts(currentPage.value)
  }
}

// Lifecycle
onMounted(() => {
  fetchBlogPosts()
  
  // Dil değişikliği event listener'ını ekle
  window.addEventListener('language-changed', handleLanguageChange)
})

onBeforeUnmount(() => {
  // Event listener'ı temizle
  window.removeEventListener('language-changed', handleLanguageChange)
})
</script>

<style scoped>
.blog-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 16px #0001;
  color: #222;
}

.blog-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.blog-header h1 {
  color: #FC6421;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  font-weight: 400;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FC6421;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

/* Blog Posts Grid */
.blog-posts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.blog-post {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.blog-post:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.post-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-post:hover .post-image img {
  transform: scale(1.05);
}

.post-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #FC6421;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.post-date {
  font-weight: 500;
}

.post-author {
  font-style: italic;
}

.post-title {
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.post-tag {
  background: #f8f9fa;
  color: #666;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid #e9ecef;
}

.read-more {
  color: #FC6421;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: right;
  margin-top: auto;
  padding-top: 1rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #f0f0f0;
}

.pagination-btn {
  background: #FC6421;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #e55a1e;
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-number {
  background: white;
  color: #666;
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 45px;
}

.pagination-number:hover {
  background: #f8f9fa;
  border-color: #FC6421;
}

.pagination-number.active {
  background: #FC6421;
  color: white;
  border-color: #FC6421;
}

/* Breadcrumb Specific Styles */
.blog-breadcrumb-wrapper {
  width: 100%;
  padding-left: 0;
  padding-right: 0;
}

.blog-breadcrumb-wrapper .breadcrumb-list {
  padding-left: 15px; /* Add back padding to the list items if needed for alignment with other content */
  padding-right: 15px;
}

/* Blog Hero Slider */
.blog-hero-slider-wrapper {
  margin-bottom: 3rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.blog-hero-slider-container {
  position: relative;
}

.blog-hero-slider {
  width: 100%;
  height: 550px;
  position: relative;
}

.hero-slide {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.3));
  z-index: 1;
}

.hero-title {
  position: relative;
  z-index: 2;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1;
  color: white;
  max-width: 800px;
  width: 100%;
  margin-top: 2rem;
}

.hero-content {
  position: relative;
  z-index: 2;
  color: white;
  max-width: 800px;
  width: 100%;
  margin-bottom: 3rem;
}

.hero-title-link {
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.hero-title-link:hover {
  color: #FC6421;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.95);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hero-meta {
  margin-bottom: 1rem;
}

.hero-author-date {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hero-icon {
  font-size: 1rem;
  color: #FC6421;
}

/* Thumbnail Navigation */
.blog-thumbnail-nav {
  background: #f8f9fa;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.thumbnail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.thumbnail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.thumbnail-item.active {
  background: #333;
  border-color: #FC6421;
}

.thumbnail-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.thumbnail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-content {
  flex: 1;
  min-width: 0;
}

.thumbnail-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #333;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.thumbnail-item.active .thumbnail-title {
  color: white;
}

.thumbnail-date {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.thumbnail-item.active .thumbnail-date {
  color: rgba(255, 255, 255, 0.8);
}

/* Responsive Design */
@media (max-width: 768px) {
  .blog-container {
    padding: 1rem;
  }
  
  .blog-header h1 {
    font-size: 2rem;
  }

  .blog-hero-slider {
    height: 400px;
  }

  .hero-slide {
    padding: 2rem 1.5rem;
  }

  .hero-title {
    font-size: 1.4rem;
    position: absolute;
    top: 20%;
    left: 0;
    right: 0;
    padding: 0 2rem;
    margin-top: 0;
  }

  .hero-content {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    padding: 0 2rem;
    margin-bottom: 0;
  }

  .hero-description {
    font-size: 1rem;
  }

  .blog-thumbnail-nav {
    grid-template-columns: repeat(2, 1fr);
    padding: 1rem;
  }

  .thumbnail-image {
    width: 60px;
    height: 60px;
  }

  .thumbnail-title {
    font-size: 0.8rem;
  }
  
  .blog-posts {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-numbers {
    order: -1;
  }
}

@media (max-width: 480px) {
  .blog-header h1 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }

  .blog-hero-slider {
    height: 350px;
  }

  .hero-slide {
    padding: 1.5rem 1rem;
  }

  .hero-title {
    font-size: 1.4rem;
    position: absolute;
    top: 20%;
    left: 0;
    right: 0;
    padding: 0 1.5rem;
    margin-top: 0;
  }

  .hero-content {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    padding: 0 1.5rem;
    margin-bottom: 0;
  }

  .hero-description {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .blog-thumbnail-nav {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .thumbnail-item {
    padding: 0.75rem;
  }

  .thumbnail-image {
    width: 50px;
    height: 50px;
  }

  .thumbnail-title {
    font-size: 0.75rem;
  }

  .thumbnail-date {
    font-size: 0.7rem;
  }
  
  .post-content {
    padding: 1rem;
  }
  
  .post-title {
    font-size: 1.1rem;
  }
}
</style>
