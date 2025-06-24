<template>
  <div class="attractions">
    <section class="hero-section">
      <div class="container">
        <h1>Istanbul Attractions</h1>
        <p>Discover the most popular attractions included in your pass</p>
      </div>
    </section>

    <section class="attractions-list">
      <div class="container">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
  },
  {
    id: 4,
    name: 'Grand Bazaar',
    description: 'One of the largest and oldest covered markets in the world.',
    image: 'https://via.placeholder.com/300x200',
    price: 'FREE with Pass',
    rating: 4.5
  }
])
</script>

<style scoped>
.attractions {
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

.attractions-list {
  padding: 4rem 0;
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
</style> 