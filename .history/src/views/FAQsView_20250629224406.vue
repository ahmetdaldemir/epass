<template>
  <div class="faqs">
    <section class="hero-section">
      <div class="container">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about Istanbul Tourist Pass</p>
      </div>
    </section>

    <section class="faqs-content">
      <div class="container">
        <div class="faqs-list">
          <div 
            class="faq-item" 
            v-for="faq in faqs" 
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
import { ref } from 'vue'

const faqs = ref([
  {
    id: 1,
    question: 'What is included in the Istanbul Tourist Pass?',
    answer: 'The Istanbul Tourist Pass includes access to 100+ attractions, museums, and tours across Istanbul. You also get skip-the-line entry, free guided tours, and a mobile ticket.',
    isOpen: false
  },
  {
    id: 2,
    question: 'How long is the pass valid?',
    answer: 'The pass is valid for the duration you choose: 1 day, 3 days, 5 days, or 7 days from the first use.',
    isOpen: false
  },
  {
    id: 3,
    question: 'Can I visit the same attraction multiple times?',
    answer: 'Most attractions allow one visit per pass. However, some attractions may allow multiple visits - please check the specific attraction details.',
    isOpen: false
  },
  {
    id: 4,
    question: 'How do I use my pass?',
    answer: 'Simply show your mobile pass or printed pass at the entrance of any included attraction. No need to buy separate tickets.',
    isOpen: false
  },
  {
    id: 5,
    question: 'Can I get a refund if I don\'t use the pass?',
    answer: 'Yes, you can get a full refund if you haven\'t used the pass and request it within 30 days of purchase.',
    isOpen: false
  }
])

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  color: #fc6421;
  transition: transform 0.3s ease;
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: #666;
  line-height: 1.6;
}
</style> 