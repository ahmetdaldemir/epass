<template>
  <div class="blog-post-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>{{ t('blog.post.loading') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <h3>{{ t('blog.post.notFound') }}</h3>
      <p>{{ error }}</p>
      <button @click="$router.push('/blog')" class="back-btn">
        {{ t('blog.post.backToBlog') }}
      </button>
    </div>

    <!-- Blog Post Content -->
    <article v-else-if="post && !error" class="blog-post">
      <div class="blog-post-breadcrumb-wrapper">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <router-link to="/" class="breadcrumb-link">
                <svg class="breadcrumb-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                {{ t('nav.home') }}
              </router-link>
              <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/blog" class="breadcrumb-link">
                {{ t('nav.blog') }}
              </router-link>
              <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </li>
            <li class="breadcrumb-item breadcrumb-item--active">
              <span class="breadcrumb-current">{{ getBlogTitle(post) }}</span>
            </li>
          </ol>
        </nav>
      </div>
      
      <!-- Post Header -->
      <header class="post-header">
        <div class="post-meta">
          <span class="post-category" v-if="post.category_name && post.category_name !== 'Bulunamadı'">{{ post.category_name }}</span>
          <span class="post-date">{{ formatDate(post.created_at) }}</span>
          <span class="post-author" v-if="post.author">{{ post.author }}</span>
        </div>
        
        <h1 class="post-title">{{ getBlogTitle(post) }}</h1>
        
        <div class="post-tags" v-if="post.category && post.category.length">
          <span 
            v-for="cat in post.category" 
            :key="cat" 
            class="post-tag"
          >
            {{ cat }}
          </span>
        </div>
      </header>

      <!-- Featured Image -->
      <div v-if="getBlogImage(post) !== '/placeholder-blog.jpg'" class="post-featured-image">
        <img 
          :src="getBlogImage(post)" 
          :alt="getBlogTitle(post)"
          loading="lazy"
        />
      </div>

      <!-- Post Content -->
      <div class="post-content" v-html="getBlogContent(post)"></div>

      <!-- Post Footer -->
      <footer class="post-footer">
        <div class="post-actions">
          <button @click="sharePost" class="share-btn">
            {{ t('blog.post.share') }}
          </button>
          <button @click="goBack" class="back-btn">
            {{ t('blog.post.backToBlog') }}
          </button>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Breadcrumb from '../components/Breadcrumb.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Reactive data
const post = ref(null)
const loading = ref(true)
const error = ref(null)

// API Configuration
const API_BASE_URL = 'https://backend.searchyourtour.com/api'

// Methods
const fetchBlogPost = async (slug) => {
  try {
    loading.value = true
    error.value = null
    
    // Güvenli değer alma - localStorage'dan güncel dili al
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'
    const languageId = getLanguageId(savedLanguage)
    
    console.log('=== BLOG POST DEBUG ===')
    console.log('Looking for slug:', slug)
    
    // Try slug-based endpoint first, fallback to ID-based if it fails
    let response, data
    
    try {
      // First try the new slug-based endpoint
      response = await fetch(`${API_BASE_URL}/blog/${slug}?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1&language_id=${languageId}`)
      
      if (response.ok) {
        data = await response.json()
        console.log('Slug-based API Response:', data)
      } else {
        throw new Error('Slug endpoint not available')
      }
    } catch (slugError) {
      console.log('Slug-based endpoint failed, trying fallback method:', slugError.message)
      
      // Fallback: Fetch all blogs and find by slug match
      response = await fetch(`${API_BASE_URL}/blogs?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1&language_id=${languageId}`)
      
      if (!response.ok) {
        throw new Error('Failed to load blog posts')
      }
      
      const allBlogs = await response.json()
      console.log('All blogs fetched, looking for slug match:', slug)
      
      // Find blog post by matching generated slug with the provided slug
      const foundPost = allBlogs.find(item => {
        const generatedSlug = generateSlugFromPost(item)
        console.log(`Comparing: "${generatedSlug}" with "${slug}"`)
        return generatedSlug === slug
      })
      
      data = foundPost || null
      console.log('Found post via fallback:', data)
    }
    
    // Debug: Image URL'lerini kontrol et
    if (data) {
      console.log('=== BLOG POST IMAGES DEBUG ===')
      console.log(`Blog Post (ID: ${data.id}):`)
      console.log('  - images:', data.images)
      console.log('  - image array:', data.image)
      console.log('  - files:', data.files)
      console.log('=== END BLOG POST IMAGES DEBUG ===')
    }
    
    // Set the post data
    post.value = data || null
    
    if (!data) {
      console.log('No blog post found for slug:', slug)
      error.value = 'Blog post not found'
    }
    
  } catch (err) {
    console.error('Error loading article:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Helper function to get slug from post (same logic as BlogView)
const generateSlugFromPost = (post) => {
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


// Helper functions to get blog content
const getBlogTitle = (post) => {
  if (!post) return 'Blog Post'
  if (post.blog_content && post.blog_content.length > 0) {
    return post.blog_content[0].title || `Blog Post ${post.id}`
  }
  return `Blog Post ${post.id}`
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

const getBlogContent = (post) => {
  if (!post) return 'Blog içeriği yükleniyor...'
  if (post.blog_content && post.blog_content.length > 0) {
    return post.blog_content[0].description || 'Blog içeriği henüz eklenmemiş.'
  }
  return 'Blog içeriği henüz eklenmemiş. Lütfen daha sonra tekrar kontrol edin.'
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


const sharePost = () => {
  if (!post.value) return
  
  if (navigator.share) {
    navigator.share({
      title: getBlogTitle(post.value),
      text: getBlogContent(post.value).replace(/<[^>]*>/g, '').substring(0, 100),
      url: window.location.href
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    alert(t('blog.post.linkCopied'))
  }
}

const goBack = () => {
  router.push('/blog')
}

// Dil değişikliklerini dinlemek için event listener
const handleLanguageChange = async (event) => {
  if (event.detail && event.detail.language) {
    console.log('BlogPostView: Language changed to:', event.detail.language)

    // Yeni dilde aynı makaleyi (SABİT ID ile) yükle, doğru başlıktan slug üret
    const savedLanguage = event.detail.language
    const languageId = getLanguageId(savedLanguage)

    // Eğer mevcut makalenin ID'si biliniyorsa, yeni dilde aynı ID'yi bul
    const currentPostId = post.value?.id
    const currentSlug = route.params.slug

    if (currentPostId) {
      try {
        // Tüm blogları yeni dilde çek ve aynı ID'yi bul
        const resp = await fetch(`${API_BASE_URL}/blogs?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1&language_id=${languageId}`)
        if (resp.ok) {
          const allBlogsNewLang = await resp.json()
          const localizedPost = allBlogsNewLang.find(b => b.id === currentPostId)

          if (localizedPost) {
            const newSlug = generateSlugFromPost(localizedPost)
            console.log('Current slug:', currentSlug)
            console.log('New slug for language:', newSlug)

            // İçeriği güncelle
            post.value = localizedPost

            // URL farklıysa güncelle
            if (newSlug && newSlug !== currentSlug) {
              router.replace(`/blog/${newSlug}`)
            }
            return
          }
        }
      } catch (e) {
        console.warn('Failed to refetch localized post by ID, falling back to slug refetch:', e)
      }
    }

    // Fallback: post ID yoksa veya bulunamadıysa, mevcut slug ile yeniden fetch et
    const fallbackSlug = route.params.slug
    if (fallbackSlug) {
      fetchBlogPost(fallbackSlug)
    }
  }
}

// Lifecycle
onMounted(() => {
  const slug = route.params.slug
  if (slug) {
    fetchBlogPost(slug)
  } else {
    error.value = 'Invalid article'
    loading.value = false
  }
  
  // Dil değişikliği event listener'ını ekle
  window.addEventListener('language-changed', handleLanguageChange)
})

onBeforeUnmount(() => {
  // Event listener'ı temizle
  window.removeEventListener('language-changed', handleLanguageChange)
})
</script>

<style scoped>
.blog-post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 16px #0001;
  color: #222;
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

/* Error State */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

/* Blog Post */
.blog-post {
  line-height: 1.8;
}

.post-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
  flex-wrap: wrap;
}

.post-category {
  background: #FC6421;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post-date {
  font-weight: 500;
}

.post-author {
  font-style: italic;
}

.post-title {
  color: #333;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.post-tag {
  background: #f8f9fa;
  color: #666;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid #e9ecef;
}

.post-featured-image {
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.post-featured-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.post-content {
  margin: 2rem 0;
  font-size: 1.1rem;
  line-height: 1.8;
  font-family: 'GT-Eesti', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.post-content :deep(h2) {
  color: #FC6421;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.post-content :deep(h3) {
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem 0;
}

.post-content :deep(p) {
  margin-bottom: 1.5rem;
  color: #444;
}

.post-content :deep(ul), .post-content :deep(ol) {
  margin: 1rem 0 1.5rem 2rem;
}

.post-content :deep(li) {
  margin-bottom: 0.5rem;
}

.post-content :deep(strong) {
  color: #333;
  font-weight: 600;
}

.post-content :deep(*) {
  font-family: 'GT-Eesti', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}

.post-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.share-btn, .back-btn {
  background: #FC6421;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.share-btn:hover, .back-btn:hover {
  background: #e55a1e;
  transform: translateY(-1px);
}

.back-btn {
  background: #6c757d;
}

.back-btn:hover {
  background: #5a6268;
}

/* Breadcrumb Specific Styles */
.blog-post-breadcrumb-wrapper {
  width: 100%;
  padding-left: 0;
  padding-right: 0;
}

.blog-post-breadcrumb-wrapper .breadcrumb-list {
  padding-left: 15px; /* Add back padding to the list items if needed for alignment with other content */
  padding-right: 15px;
}

/* Breadcrumb Styles */
.breadcrumb {
  padding: 12px 0;
  margin-bottom: 20px;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 1.5;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;
}

.breadcrumb-link:hover {
  color: #3b82f6;
  background-color: #f3f4f6;
}

.breadcrumb-current {
  color: #374151;
  font-weight: 500;
  padding: 4px 8px;
}

.breadcrumb-icon {
  flex-shrink: 0;
  color: #6b7280;
}

.breadcrumb-separator {
  flex-shrink: 0;
  color: #9ca3af;
  margin: 0 4px;
}

.breadcrumb-item--active .breadcrumb-current {
  color: #1f2937;
}

/* Responsive Design */
@media (max-width: 768px) {
  .blog-post-container {
    padding: 1rem;
  }
  
  .post-title {
    font-size: 1.8rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .post-featured-image img {
    height: 250px;
  }
  
  .post-actions {
    flex-direction: column;
  }
  
  .share-btn, .back-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .post-title {
    font-size: 1.5rem;
  }
  
  .post-content {
    font-size: 1rem;
  }
}
</style>
