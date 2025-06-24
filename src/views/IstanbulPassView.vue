<template>
  <div class="istanbul-pass">
    <section class="hero-section">
      <div class="container">
        <h1>Istanbul Tourist Pass</h1>
        <p>Choose the perfect pass for your Istanbul adventure</p>
      </div>
    </section>

    <section class="pass-selection">
      <div class="container">
        <div class="pass-grid">
          <div class="pass-card" v-for="pass in passes" :key="pass.id">
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
              <button @click="selectPass(pass)" class="btn btn-primary">Select Pass</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const passes = ref([
  {
    id: 1,
    name: '1 Day Pass',
    price: '€85',
    features: [
      'Access to 100+ attractions',
      'Skip-the-line entry',
      'Free guided tours',
      'Mobile ticket'
    ]
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
    ]
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
    ]
  }
])

const selectPass = (pass) => {
  console.log('Selected pass:', pass)
  // Add pass selection logic here
}
</script>

<style scoped>
.istanbul-pass {
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

.pass-selection {
  padding: 4rem 0;
}

.pass-grid {
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
}

.pass-header h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.pass-price {
  font-size: 2rem;
  font-weight: 700;
  color: #e74c3c;
  margin-bottom: 1.5rem;
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
</style> 