<template>
  <div class="faqs">
    <section class="hero-section">
      <div class="container">
        <h1>{{ $t('faqs.title') }}</h1>
        <p>{{ $t('faqs.subtitle') }}</p>
      </div>
    </section>

    <div class="container">
      <Breadcrumb />
    </div>

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
import Breadcrumb from '../components/Breadcrumb.vue'

const { t, locale } = useI18n()

// FAQ verilerini İngilizce olarak doğrudan koda ekliyoruz
const faqsData = [
  // About SearchYourTour.com
  {
    id: 1,
    question: 'What is SearchYourTour.com?',
    answer: 'SearchYourTour.com is a travel platform that helps you discover, compare, and book the best tours, activities, and holiday packages from trusted tour operators across various destinations.'
  },
  {
    id: 2,
    question: 'How does it work?',
    answer: 'Simply search for your desired destination or activity, compare different tour packages, read verified reviews, and book directly through the platform.'
  },
  {
    id: 3,
    question: 'Who are the tour providers listed on the site?',
    answer: 'We partner with licensed and experienced tour operators who meet our quality standards. Each provider is reviewed and vetted before being listed.'
  },
  // Booking & Payments
  {
    id: 4,
    question: 'How do I book a tour?',
    answer: 'Once you find a tour you like, click on it to view full details, select your dates, and follow the booking process. You\'ll receive a confirmation email once your booking is complete.'
  },
  {
    id: 5,
    question: 'Is it safe to make payments on your site?',
    answer: 'Yes, we use secure payment gateways and encryption protocols to protect your data and transactions.'
  },
  {
    id: 6,
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI, net banking, and other secure payment options.'
  },
  {
    id: 7,
    question: 'Can I make group bookings?',
    answer: 'Yes, many of our tour packages support group bookings. You can contact the tour operator directly via the tour page or reach out to our support team for assistance.'
  },
  // Modifications & Cancellations
  {
    id: 8,
    question: 'Can I cancel or reschedule my booking?',
    answer: 'Cancellation and rescheduling policies vary by tour operator. Please refer to the cancellation policy listed on the tour page before booking.'
  },
  {
    id: 9,
    question: 'Will I get a full refund if I cancel?',
    answer: 'Cancellations made 24 hours prior to the scheduled time are eligible for a full refund.'
  },
  // Tour Details & Customization
  {
    id: 10,
    question: 'Can I customize a tour package?',
    answer: 'Yes, some tours offer customization options such as itinerary changes, hotel upgrades, or private group tours. Use the "Contact Tour Operator" option on the tour page to discuss your preferences.'
  },
  {
    id: 11,
    question: 'Are flights included in the tour packages?',
    answer: 'Unless specified, flights are generally not included. Check the "Inclusions/Exclusions" section of each tour for details.'
  },
  {
    id: 12,
    question: 'Are the tours guided?',
    answer: 'Most tours include professional guides, especially for sightseeing and adventure packages. Details are available in the individual tour descriptions.'
  },
  // After Booking
  {
    id: 13,
    question: 'How will I receive my booking confirmation?',
    answer: 'After booking, you\'ll receive a confirmation email with your itinerary, booking ID, and contact details of the tour operator.'
  },
  {
    id: 14,
    question: 'What if I don\'t receive a confirmation email?',
    answer: 'Please check your spam or promotions folder. If you still don\'t see it, contact our support team immediately at info@searchyourtour.com.'
  },
  // Support & Contact
  {
    id: 15,
    question: 'How can I contact customer support?',
    answer: 'You can email us at info@searchyourtour.com or use the contact form on our website. We\'re here to help 24/7.'
  },
  {
    id: 16,
    question: 'Can I list my tour on your platform?',
    answer: 'Yes! If you\'re a verified tour operator, you can apply to list your packages by visiting the Partner With Us section.'
  },
  // General
  {
    id: 17,
    question: 'Is SearchYourTour.com available in multiple languages?',
    answer: 'Currently, the platform is available in English. We\'re working on adding more languages soon.'
  },
  {
    id: 18,
    question: 'Do you offer mobile app access?',
    answer: 'Yes, our mobile app is coming soon! For now, you can access our mobile-optimized website on any device.'
  }
]

// Çeviri fonksiyonu - eğer çeviri yoksa İngilizce metni döndürür
const translateText = (text, key) => {
  const translationKey = `faqs.q${key}.${text === faqsData.find(f => f.id === key)?.question ? 'question' : 'answer'}`
  const translation = t(translationKey)
  
  // Eğer çeviri bulunamazsa (anahtar bulunamadı hatası), orijinal İngilizce metni döndür
  if (translation === translationKey) {
    return text
  }
  
  return translation
}

// FAQ verilerini reactive hale getir
const faqs = ref(faqsData.map(faq => ({
  ...faq,
  isOpen: false
})))

// Computed property for translated FAQs
const translatedFaqs = computed(() => {
  return faqs.value.map(faq => ({
    ...faq,
    question: translateText(faq.question, faq.id),
    answer: translateText(faq.answer, faq.id)
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