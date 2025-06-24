<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Discover Istanbul with the Ultimate Tourist Pass</h1>
          <p class="hero-subtitle">Access to 100+ attractions, museums, and tours with one convenient pass</p>
          <div class="hero-buttons">
            <router-link to="/istanbul-pass" class="btn btn-primary">Buy Now</router-link>
            <a href="#attractions" class="btn btn-secondary">Explore Attractions</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Why Choose Istanbul Tourist Pass?</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Attractions Section -->
    <section id="attractions" class="attractions-section">
      <div class="container">
        <h2 class="section-title">Popular Attractions</h2>
        <div class="attractions-grid">
          <div class="attraction-card" v-for="attraction in attractions" :key="attraction.id">
            <div class="attraction-image">
              <img :src="attraction.image" :alt="attraction.name">
            </div>
            <div class="attraction-content">
              <h3>{{ attraction.name }}</h3>
              <p>{{ attraction.description }}</p>
              <div class="attraction-meta">
                <span class="price">{{ attraction.price }}</span>
                <span class="rating">
                  <i class="fas fa-star"></i>
                  {{ attraction.rating }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pass Types Section -->
    <section class="pass-types-section">
      <div class="container">
        <h2 class="section-title">Choose Your Pass</h2>
        <div class="pass-types-grid">
          <div class="pass-card" v-for="pass in passTypes" :key="pass.id">
            <div class="pass-header">
              <h3>{{ pass.name }}</h3>
              <div class="pass-price">{{ pass.price }}</div>
            </div>
            <div class="pass-features">
              <ul>
                <li v-for="feature in pass.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>
            <div class="pass-action">
              <router-link :to="pass.link" class="btn btn-primary">Select Pass</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <h2 class="section-title">What Our Customers Say</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card" v-for="testimonial in testimonials" :key="testimonial.id">
            <div class="testimonial-content">
              <p>"{{ testimonial.text }}"</p>
            </div>
            <div class="testimonial-author">
              <img :src="testimonial.avatar" :alt="testimonial.name">
              <div>
                <h4>{{ testimonial.name }}</h4>
                <span>{{ testimonial.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Reactive data
const features = ref([
  {
    id: 1,
    icon: 'fas fa-ticket-alt',
    title: 'Skip the Lines',
    description: 'Fast-track entry to popular attractions without waiting in long queues.'
  },
  {
    id: 2,
    icon: 'fas fa-save',
    title: 'Save Money',
    description: 'Get significant discounts compared to buying individual tickets.'
  },
  {
    id: 3,
    icon: 'fas fa-map-marked-alt',
    title: '100+ Attractions',
    description: 'Access to museums, palaces, tours, and experiences across Istanbul.'
  },
  {
    id: 4,
    icon: 'fas fa-clock',
    title: 'Flexible Duration',
    description: 'Choose from 1, 3, 5, or 7-day passes to suit your schedule.'
  }
])

const attractions = ref([
  {
    id: 1,
    name: 'Hagia Sophia',
    description: 'Ancient architectural marvel and former cathedral turned mosque.',
    image: 'https://via.placeholder.com/300x200',
    price: 'FREE with Pass',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Topkapi Palace',
    description: 'Ottoman imperial palace with stunning views of the Bosphorus.',
    image: 'https://via.placeholder.com/300x200',
    price: 'FREE with Pass',
    rating: 4.7
  },
  {
    id: 3,
    name: 'Blue Mosque',
    description: 'Famous mosque known for its beautiful blue tile work.',
    image: 'https://via.placeholder.com/300x200',
    price: 'FREE with Pass',
    rating: 4.6
  }
])

const passTypes = ref([
  {
    id: 1,
    name: '1 Day Pass',
    price: '€85',
    features: [
      'Access to 100+ attractions',
      'Skip-the-line entry',
      'Free guided tours',
      'Mobile ticket'
    ],
    link: '/istanbul-pass?duration=1'
  },
  {
    id: 2,
    name: '3 Day Pass',
    price: '€115',
    features: [
      'Access to 100+ attractions',
      'Skip-the-line entry',
      'Free guided tours',
      'Mobile ticket',
      'Best value option'
    ],
    link: '/istanbul-pass?duration=3'
  },
  {
    id: 3,
    name: '7 Day Pass',
    price: '€145',
    features: [
      'Access to 100+ attractions',
      'Skip-the-line entry',
      'Free guided tours',
      'Mobile ticket',
      'Maximum flexibility'
    ],
    link: '/istanbul-pass?duration=7'
  }
])

const testimonials = ref([
  {
    id: 1,
    text: 'The Istanbul Tourist Pass was absolutely worth it! We saved so much time and money.',
    name: 'Sarah Johnson',
    location: 'New York, USA',
    avatar: 'https://via.placeholder.com/60x60'
  },
  {
    id: 2,
    text: 'Amazing experience! The skip-the-line feature alone made it worth every penny.',
    name: 'Michael Chen',
    location: 'London, UK',
    avatar: 'https://via.placeholder.com/60x60'
  },
  {
    id: 3,
    text: 'Perfect for exploring Istanbul. Highly recommend the 3-day pass.',
    name: 'Emma Rodriguez',
    location: 'Madrid, Spain',
    avatar: 'https://via.placeholder.com/60x60'
  }
])

// Lifecycle
onMounted(() => {
  console.log('HomeView component mounted')
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 0;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-primary {
  background: #e74c3c;
  color: white;
}

.btn-primary:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #667eea;
}

/* Sections */
.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50;
}

/* Features Section */
.features-section {
  padding: 5rem 0;
  background: #f8f9fa;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 1rem;
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
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
  color: #e74c3c;
  font-weight: 600;
}

.rating {
  color: #f39c12;
}

/* Pass Types Section */
.pass-types-section {
  padding: 5rem 0;
  background: #f8f9fa;
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.pass-card:hover {
  transform: translateY(-5px);
}

.pass-header {
  margin-bottom: 1.5rem;
}

.pass-price {
  font-size: 2rem;
  font-weight: 700;
  color: #e74c3c;
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid,
  .attractions-grid,
  .pass-types-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
