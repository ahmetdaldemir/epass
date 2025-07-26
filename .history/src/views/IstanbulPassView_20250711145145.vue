<template>
  <div class="istanbul-pass">
    <section class="hero-section">
      <div class="container">
        <h1>Istanbul Tourist Pass</h1>
        <p>Choose the perfect pass for your Istanbul adventure</p>
      </div>
    </section>

    <section class="pass-selection">
      <div class="container pass-flex">
        <div class="pass-grid">
          <div class="pass-card" v-for="pass in passes" :key="pass.id">
            <div class="pass-header">
              <h3>{{ pass.name }}</h3>
              <div class="pass-price">{{ pass.price }} <span class="currency">€</span></div>
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
        <div v-if="selectedPass" class="pass-box">
          <h2>Choose your pass</h2>
          <!-- Pass seçimi satırı (template kısmında güncelleme) -->
          <div class="pass-select-row">
            <div class="pass-select">{{ selectedPass.name }}</div>
            <span class="pass-price">
              {{ selectedPass.price }} <span class="currency">€</span> <small>/ person</small>
            </span>
          </div>
          <div class="quantity-row">
            <button @click="decrement" :disabled="quantity <= 1">-</button>
            <span>{{ quantity }}</span>
            <button @click="increment">+</button>
          </div>
          <div class="price-summary">
            <div class="old-price" v-if="selectedPass.oldPrice">
              <s>{{ selectedPass.oldPrice }}</s>
            </div>
            <div class="new-price">{{ selectedPass.price }}</div>
            <div class="discount" v-if="selectedPass.discount">
              <span>Sale Discount</span>
              <span>-{{ selectedPass.discount }}</span>
            </div>
          </div>
          <hr />
          <div class="fee-row">
            <span>Instant Access Fee <span class="info" title="You get your pass instantly after payment.">i</span></span>
            <span>{{ instantFee }}</span>
          </div>
          <div class="eco-row">
            <span class="eco-icon">🌱</span>
            <span>Eco-Friendly Green Technology</span>
          </div>
          <hr />
          <div class="order-total-row">
            <span>Order Total</span>
            <span class="order-total">{{ orderTotal }}</span>
          </div>
          <div class="tax-note">All taxes and fees included</div>
          <input type="email" placeholder="E-mail Address" class="input" v-model="email" />
          <input type="date" placeholder="Pass Start Date" class="input" v-model="startDate" />
          <button class="pay-btn" @click="proceedToPayment">Proceed to Payment</button>
          <div class="save-note">
            <b>Save over {{ savings }}</b> on attractions versus original prices.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const passes = ref([
  {
    id: 1,
    name: '1 Day Pass',
    price: 139,
    oldPrice: 230,
    discount: 91,
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
    price: 199,
    oldPrice: 270,
    discount: 71,
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
    price: 259,
    oldPrice: 340,
    discount: 81,
    features: [
      'Access to 100+ attractions',
      'Skip-the-line entry',
      'Free guided tours',
      'Mobile ticket',
      'Maximum flexibility'
    ]
  }
])

const selectedPass = ref(null)
const quantity = ref(1)
const email = ref('')
const startDate = ref('')
const instantFee = '€10.00'
const savings = '€270'

const selectPass = (pass) => {
  selectedPass.value = pass
  quantity.value = 1
}
const increment = () => { quantity.value++ }
const decrement = () => { if (quantity.value > 1) quantity.value-- }

const orderTotal = computed(() => {
  if (!selectedPass.value) return '€0.00'
  const total = (selectedPass.value.price * quantity.value) + 10
  return `€${total}.00`
})

const proceedToPayment = () => {
  // Payment logic here
  alert('Proceeding to payment...')
}
</script>

<style scoped>
.istanbul-pass {
  min-height: 100vh;
}

.hero-section {
  background: #fc6421;
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

.pass-flex {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.pass-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  flex: 2;
}

.pass-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.pass-header .pass-price {
  font-size: 2rem;
  font-weight: 700;
  color: #FC6421;
  margin-bottom: 1.5rem;
  display: block;
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

/* Yeni ödeme kutusu stilleri */
.pass-box {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 32px 24px;
  max-width: 400px;
  min-width: 320px;
  font-family: 'Inter', sans-serif;
  margin-top: 0.5rem;
}

.pass-box h2 {
  color: #FC6421;
  font-size: 2rem;
  margin-bottom: 18px;
  font-weight: 700;
}

.pass-select-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.pass-select {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  font-size: 1rem;
  background: #f7f7f7;
}

.pass-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
  display: flex;
  align-items: center;
  gap: 4px;
}
.currency {
  font-size: 1.1rem;
  font-weight: 500;
  margin-left: 2px;
}
.quantity-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.quantity-row button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f2f2f2;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.quantity-row button:disabled {
  background: #eee;
  cursor: not-allowed;
}

.price-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.old-price {
  color: #aaa;
  font-size: 1rem;
}

.new-price {
  color: #FC6421;
  font-size: 1.3rem;
  font-weight: 700;
}

.discount {
  color: #FC6421;
  font-size: 1rem;
}

.fee-row, .eco-row, .order-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.eco-icon {
  font-size: 1.2rem;
}

.order-total {
  font-size: 1.4rem;
  font-weight: 700;
  color: #222;
}

.tax-note {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 10px;
}

.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  margin-bottom: 10px;
  font-size: 1rem;
}

.pay-btn {
  width: 100%;
  background: #FC6421;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  padding: 14px 0;
  margin: 12px 0;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(230,0,76,0.08);
}

.pay-btn:hover {
  background: #c4003c;
}

.save-note {
  background: #f7f7f7;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1rem;
  color: #222;
  margin-top: 8px;
  text-align: center;
}

hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 12px 0;
}

.info {
  font-size: 0.9em;
  color: #888;
  cursor: pointer;
  margin-left: 4px;
}

.pass-action {
  margin-top: auto;
}

@media (max-width: 900px) {
  .container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .pass-flex { flex-direction: column; }
  .pass-box { max-width: 100%; min-width: 0; }
  .pass-grid {
    grid-template-columns: 1fr;
    justify-items: center;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  .pass-card {
    margin: 0 auto 1.5rem auto;
    width: 100%;
    max-width: 350px;
  }
}
</style> 