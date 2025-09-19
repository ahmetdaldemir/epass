<template>
  <div class="faqs">
    <section class="hero-section">
      <div class="container">
        <h1>{{ $t('faqs.title') }}</h1>
        <p>{{ $t('faqs.subtitle') }}</p>
      </div>
    </section>

    <section class="faqs-content">
      <div class="container">
        <div class="faqs-list">
          <div 
            class="faq-item" 
            v-for="faq in translatedFaqs" 
            :key="faq.id"
            @click="toggleFaq(faq.id)"
          >
            <div class="faq-question">
              <h3>{{ faq.question }}</h3>
              <i :class="faq.isOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </div>
            <div class="faq-answer" v-show="faq.isOpen">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const faqs = ref([
  {
    id: 1,
    questionKey: 'faqs.q1.question',
    answerKey: 'faqs.q1.answer',
    isOpen: false
  },
  {
    id: 2,
    questionKey: 'faqs.q2.question',
    answerKey: 'faqs.q2.answer',
    isOpen: false
  },
  {
    id: 3,
    questionKey: 'faqs.q3.question',
    answerKey: 'faqs.q3.answer',
    isOpen: false
  },
  {
    id: 4,
    questionKey: 'faqs.q4.question',
    answerKey: 'faqs.q4.answer',
    isOpen: false
  },
  {
    id: 5,
    questionKey: 'faqs.q5.question',
    answerKey: 'faqs.q5.answer',
    isOpen: false
  }
])

// Computed property for translated FAQs
const translatedFaqs = computed(() => {
  return faqs.value.map(faq => ({
    ...faq,
    question: t(faq.questionKey),
    answer: t(faq.answerKey)
  }))
})

const toggleFaq = (id) => {
  const faq = faqs.value.find(f => f.id === id)
  if (faq) {
    faq.isOpen = !faq.isOpen
  }
}
</script>

<style scoped>
.faqs {
  min-height: 100vh;
}

.hero-section {
  background: #FC6421;
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.faqs-content {
  padding: 4rem 0;
}

.faqs-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.faq-question:hover {
  background-color: #f8f9fa;
}

.faq-question h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.faq-question i {
  color: #FC6421;
  transition: transform 0.3s ease;
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: #666;
  line-height: 1.6;
}
</style> 