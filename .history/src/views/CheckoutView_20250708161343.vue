<template>
  <div class="checkout-wrapper">
    <div class="checkout-main">
      <CheckoutForm v-if="selectedTourStore.tour" :tourDetails="selectedTourStore.tour" />
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
import { useSelectedTourStore } from '../stores/selectedTour'
import CheckoutForm from '../components/CheckoutForm.vue'
const selectedTourStore = useSelectedTourStore()
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