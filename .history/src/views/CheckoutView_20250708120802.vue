<template>
  <div class="checkout-wrapper">
    <div class="checkout-main">
      <div class="checkout-stepper">
        <div :class="['step', {active: step === 1}]">
          <span>1</span>
          <div>Contact</div>
        </div>
        <div class="step-line"></div>
        <div :class="['step', {active: step === 2}]">
          <span>2</span>
          <div>Payment</div>
        </div>
      </div>
      <div class="checkout-content">
        <CheckoutForm v-if="selectedTourStore.tour" :tourDetails="selectedTourStore.tour" />
      </div>
    </div>
    <div class="checkout-summary">
      <div class="summary-card" v-if="selectedTourStore.tour">
        <div class="summary-title">Order summary</div>
        <div class="summary-tour">
          <img class="summary-img" :src="selectedTourStore.tour.image" alt="Tour image" />
          <div>
            <div class="tour-name">{{ selectedTourStore.tour.title }}</div>
            <div class="tour-date">{{ selectedTourStore.tour.date }}</div>
            <div class="tour-detail">{{ selectedTourStore.tour.description }}</div>
          </div>
        </div>
        <div class="summary-info">
          <div><i class="fas fa-user"></i> {{ selectedTourStore.tour.participants }}</div>
          <div><i class="fas fa-star"></i> {{ selectedTourStore.tour.rating }}</div>
        </div>
        <div class="summary-total">
          <div>Total</div>
          <div class="summary-price">{{ selectedTourStore.tour.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSelectedTourStore } from '@/stores/selectedTour'
import CheckoutForm from '@/components/CheckoutForm.vue'

const step = ref(1)
const contact = ref({ name: '', email: '', country: 'Turkey', phone: '' })
const payment = ref({ cardName: '', cardNumber: '', expiry: '', cvc: '' })

const selectedTourStore = useSelectedTourStore()

function goToPayment() {
  step.value = 2
}
function submitPayment() {
  alert('Payment submitted!')
}
</script>

<style scoped>
.checkout-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2.5rem;
  padding: 2.5rem 0 3.5rem 0;
  background: #f7fafd;
  min-height: 100vh;
}
.checkout-main {
  width: 480px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(44,62,80,0.08);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.checkout-stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2.2rem;
  gap: 1.2rem;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #b0b8c1;
  font-weight: 600;
  font-size: 1.1rem;
}
.step.active {
  color: #223366;
}
.step span {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f7fafd;
  border: 2.5px solid #b0b8c1;
  color: #b0b8c1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
  font-weight: 700;
  transition: border 0.2s, color 0.2s;
}
.step.active span {
  border-color: #223366;
  color: #223366;
  background: #fff;
}
.step-line {
  width: 48px;
  height: 3px;
  background: #b0b8c1;
  border-radius: 2px;
}
.checkout-content {
  width: 100%;
}
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}
.checkout-form h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #223366;
}
.secure-info {
  color: #0a8a4a;
  font-size: 1.08rem;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-group label {
  font-size: 1.08rem;
  color: #223366;
  font-weight: 600;
}
.form-group input,
.form-group select {
  padding: 0.95rem 1.1rem;
  border-radius: 8px;
  border: 2px solid #e0e6ed;
  font-size: 1.08rem;
  background: #f7fafd;
  outline: none;
  transition: border 0.2s;
}
.form-group input:focus,
.form-group select:focus {
  border-color: #223366;
}
.form-row {
  display: flex;
  gap: 1.2rem;
}
.big-btn {
  width: 100%;
  padding: 1.1rem 0;
  font-size: 1.18rem;
  border-radius: 32px;
  background: #0070eb;
  color: #fff;
  font-weight: 700;
  margin-top: 1.2rem;
  box-shadow: 0 2px 12px rgba(0,112,235,0.08);
  border: none;
  transition: background 0.2s;
}
.big-btn:hover {
  background: #005bb5;
}
.checkout-summary {
  width: 370px;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.summary-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(44,62,80,0.10);
  padding: 2rem 2rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.summary-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #223366;
  margin-bottom: 0.7rem;
}
.summary-tour {
  display: flex;
  gap: 1.1rem;
  align-items: center;
  margin-bottom: 0.7rem;
}
.summary-img {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(44,62,80,0.08);
}
.tour-name {
  font-size: 1.08rem;
  font-weight: 700;
  color: #223366;
}
.tour-date {
  font-size: 1.01rem;
  color: #444;
}
.tour-detail {
  font-size: 0.98rem;
  color: #888;
}
.summary-info {
  display: flex;
  gap: 1.2rem;
  font-size: 1.01rem;
  color: #223366;
  align-items: center;
}
.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.18rem;
  font-weight: 700;
  color: #223366;
  margin-top: 1.2rem;
  border-top: 1.5px solid #e0e6ed;
  padding-top: 1.1rem;
}
.summary-price {
  color: #0070eb;
  font-size: 1.25rem;
  font-weight: 800;
}
@media (max-width: 1100px) {
  .checkout-wrapper {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 1.2rem 0 2.5rem 0;
  }
  .checkout-main {
    width: 98vw;
    max-width: 520px;
    margin-bottom: 2rem;
  }
  .checkout-summary {
    width: 98vw;
    max-width: 420px;
  }
}
@media (max-width: 600px) {
  .checkout-main {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
  .summary-card {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
}
</style> 