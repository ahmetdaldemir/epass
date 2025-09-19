<template>
  <div class="about-container">
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

const { t } = useI18n()

const formattedDescription = computed(() => {
  const description = t('aboutUs.description')
  // Convert line breaks to HTML paragraphs
  return description.split('\n\n').map(paragraph => 
    paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ''
  ).join('')
})
</script>

<style scoped>
.about-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 16px #0001;
  color: #222;
}
h1, h2, h3 {
  color: #FC6421;
}
.subtitle {
  font-size: 1.1rem;
  color: #555;
  opacity: 0.8;
  margin-bottom: 0.2rem;
  font-weight: 500;
}
.last-updated {
  font-size: 0.98rem;
  color: #888;
  opacity: 0.8;
  margin-bottom: 1.2rem;
  font-weight: 400;
}
section {
  margin-bottom: 2rem;
}

.about-content p {
  margin-bottom: 1.5rem;
  line-height: 1.7;
  color: #444;
}

.about-content p:last-child {
  margin-bottom: 0;
}
</style> 