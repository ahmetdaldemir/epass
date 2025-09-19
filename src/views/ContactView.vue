<template>
  <div class="contact">
    <section class="hero-section">
      <div class="container">
        <h1>{{ $t('contact.title') }}</h1>
        <p>{{ $t('contact.subtitle') }}</p>
      </div>
    </section>

    <section class="contact-content">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-info">
            <h2>{{ $t('contact.getInTouch') }}</h2>
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <div>
                <h3>{{ $t('contact.email') }}</h3>
                <p>info@searchyourtour.com</p>
              </div>
            </div>
            <div class="contact-item">
              <a href="https://wa.me/905373257204" target="_blank" rel="noopener" class="whatsapp-link">
                <i class="fab fa-whatsapp"></i>
                <div>
                  <h3>{{ $t('contact.phone') }}</h3>
                  <p>+90 537 325 72 04</p>
                  <small>{{ $t('contact.whatsappNote') }}</small>
                </div>
              </a>
            </div>
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <h3>{{ $t('contact.address') }}</h3>
                <p>{{ $t('contact.companyName') }} <br> {{ $t('contact.streetAddress') }} <br> {{ $t('contact.cityStateZip') }} <br> {{ $t('contact.country') }}</p>
              </div>
            </div>
          </div>

          <div class="contact-form">
            <h2>{{ $t('contact.sendMessage') }}</h2>
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <label for="name">{{ $t('contact.form.name') }}</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="form.name" 
                  :placeholder="$t('contact.form.namePlaceholder')"
                  required
                >
              </div>
              <div class="form-group">
                <label for="email">{{ $t('contact.form.email') }}</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  :placeholder="$t('contact.form.emailPlaceholder')"
                  required
                >
              </div>
              <div class="form-group">
                <label for="subject">{{ $t('contact.form.subject') }}</label>
                <input 
                  type="text" 
                  id="subject" 
                  v-model="form.subject" 
                  :placeholder="$t('contact.form.subjectPlaceholder')"
                  required
                >
              </div>
              <div class="form-group">
                <label for="message">{{ $t('contact.form.message') }}</label>
                <textarea 
                  id="message" 
                  v-model="form.message" 
                  :placeholder="$t('contact.form.messagePlaceholder')"
                  rows="5" 
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">{{ $t('contact.form.sendMessage') }}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitForm = () => {
  console.log('Form submitted:', form.value)
  // Add form submission logic here
  alert(t('contact.form.successMessage'))
  
  // Reset form
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
}
</script>

<style scoped>
.contact {
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

.contact-content {
  padding: 4rem 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.contact-info h2,
.contact-form h2 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.contact-item i {
  font-size: 1.5rem;
  color: #FC6421;
  width: 30px;
}

.whatsapp-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.whatsapp-link:hover {
  transform: translateY(-2px);
  text-decoration: none;
  color: inherit;
}

.whatsapp-link i {
  color: #25D366 !important;
  font-size: 1.8rem;
}

.whatsapp-link small {
  color: #25D366;
  font-weight: 500;
  font-size: 0.85rem;
}

.contact-item h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #FC6421;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style> 