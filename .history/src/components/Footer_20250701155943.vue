<template>
  <footer class="main-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section" v-for="(section, i) in sections" :key="i">
          <button class="footer-toggle" @click="toggleSection(i)">
            <span>
              <router-link v-if="section.type === 'about'" to="/about" style="color:inherit;font-weight:600;">{{ section.title }}</router-link>
              <template v-else>{{ section.title }}</template>
            </span>
            <span class="toggle-icon" v-if="isMobile">{{ openSection === i ? '\u25bc' : '\u25ba' }}</span>
          </button>
          <div v-show="!isMobile || openSection === i" class="footer-section-content">
            <template v-if="section.type === 'about'">
              <p>{{ section.content }}</p>
            </template>
            <template v-else-if="section.type === 'links'">
              <ul>
                <li v-for="link in section.links" :key="link.text">
                  <router-link :to="link.to">{{ link.text }}</router-link>
                </li>
              </ul>
            </template>
            <template v-else-if="section.type === 'support'">
              <ul>
                <li v-for="link in section.links" :key="link.text">
                  <component :is="link.external ? 'a' : 'router-link'" :to="!link.external ? link.to : undefined" :href="link.external ? link.to : undefined" :target="link.external ? '_blank' : undefined">{{ link.text }}</component>
                </li>
              </ul>
            </template>
            <template v-else-if="section.type === 'social'">
              <div class="social-links">
                <a href="#" class="social-link"><i class="fab fa-facebook"></i></a>
                <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
                <a href="https://wa.me/905555555555" class="social-link" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                <a href="mailto:info@searchyourtour.com" class="social-link" title="E-mail"><i class="fas fa-envelope"></i></a>
              </div>
            </template>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; {{ currentYear }} SearchYourTour. All rights reserved.</p>
          <div class="footer-links">
            <router-link to="/security/privacy-policy">Privacy Policy</router-link>
            <router-link to="/security/terms-conditions">Terms & Conditions</router-link>
            <router-link to="/security/cookie-policy">Cookie Policy</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

// Computed properties
const currentYear = computed(() => new Date().getFullYear())
const openSection = ref(null)
const isMobile = ref(false)

const sections = [
  {
    title: 'About SearchYourTour',
    type: 'about',
    content: "Discover Istanbul's most iconic attractions with SearchYourTour. Save time and money while exploring the city's rich history and culture."
  },
  {
    title: 'Quick Links',
    type: 'links',
    links: [
      { text: 'Istanbul Pass', to: '/istanbul-pass' },
      { text: 'Attractions', to: '/attractions' },
      { text: 'Tours', to: '/tours' },
      { text: 'FAQs', to: '/faqs' }
    ]
  },
  {
    title: 'Support',
    type: 'support',
    links: [
      { text: 'Contact Us', to: '/contact' },
      { text: 'Manage Your Pass', to: 'https://myistanbul.istanbultouristpass.com/', external: true },
      { text: 'Become a Partner', to: '/become-partner' }
    ]
  },
  {
    title: 'Connect With Us',
    type: 'social'
  }
]

function toggleSection(i) {
  if (!isMobile.value) return
  openSection.value = openSection.value === i ? null : i
}

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.main-footer {
  background: linear-gradient(135deg, #fc6421 0%, #c0392b 100%);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3, .footer-toggle {
  color: #ecf0f1;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0;
}

.footer-toggle:focus {
  outline: 2px solid #e6004c;
}

.toggle-icon {
  font-size: 1.1em;
  margin-left: 8px;
}

.footer-section-content {
  transition: max-height 0.2s;
}

.footer-section p {
  color: #bdc3c7;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #3498db;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #34495e;
  color: white;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #3498db;
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 1rem;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-bottom p {
  color: #bdc3c7;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #3498db;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-section-content {
    padding-bottom: 0.5rem;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-links {
    justify-content: center;
  }
}
</style>
