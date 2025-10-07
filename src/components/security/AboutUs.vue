<template>
  <div class="about-container">
    <div class="about-breadcrumb-wrapper">
      <Breadcrumb />
    </div>
    
    <h1>{{ $t('aboutUs.title') }}</h1>
    <div class="subtitle">{{ $t('aboutUs.subtitle') }}</div>
    <div class="last-updated">{{ $t('aboutUs.lastUpdated') }}</div>
    <section>
      <div class="about-content" v-html="formattedDescription"></div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import Breadcrumb from '../Breadcrumb.vue'

const { t } = useI18n()

const formattedDescription = computed(() => {
  const description = t('aboutUs.description')
  // Convert line breaks to HTML paragraphs and add special styling for first paragraph
  const paragraphs = description.split('\n\n').map((paragraph, index) => {
    if (paragraph.trim()) {
      if (index === 0) {
        // First paragraph gets special welcome styling
        return `<p class="welcome-paragraph">${paragraph.trim()}</p>`
      } else {
        return `<p>${paragraph.trim()}</p>`
      }
    }
    return ''
  })
  return paragraphs.join('')
})
</script>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 16px #0001;
  color: #222;
}

/* Breadcrumb Specific Styles */
.about-breadcrumb-wrapper {
  width: 100%;
  padding-left: 0;
  padding-right: 0;
  margin-bottom: 20px;
}

.about-breadcrumb-wrapper .breadcrumb-list {
  padding-left: 15px;
  padding-right: 15px;
}

h1, h2, h3 {
  color: #FC6421;
}

.subtitle {
  font-size: 1.2rem;
  color: #555;
  opacity: 0.8;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.last-updated {
  font-size: 1rem;
  color: #888;
  opacity: 0.8;
  margin-bottom: 2rem;
  font-weight: 400;
}

section {
  margin-bottom: 2rem;
}

.about-content p {
  margin-bottom: 2.2rem;
  line-height: 1.8;
  color: #444;
  font-size: 1.05rem;
}

.about-content p:last-child {
  margin-bottom: 0;
}

/* Welcome paragraph özel stilleri */
.about-content :deep(.welcome-paragraph) {
  font-size: 1.3rem !important;
  font-weight: 600 !important;
  color: #020202 !important;
  margin-bottom: 2.5rem !important;
  line-height: 1.6 !important;
  padding: 1.5rem 0;
  border-bottom: 2px solid #f0f0f0;
  border-top: 2px solid #f0f0f0;
  margin-top: 1rem !important;
}
</style> 