<template>
  <div v-if="show" class="checkout-modal-overlay">
    <div class="checkout-modal">
      <button class="close-btn" @click="$emit('close')">&times;</button>
      <div class="checkout-modal-content">
        <div class="checkout-modal-form">
          <h2>Payment</h2>
          <form @submit.prevent="handleSubmit" class="checkout-form">
            <div class="form-group">
              <label>Name on Card</label>
              <input v-model="name" type="text" required placeholder="Full Name" />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input v-model="email" type="email" required placeholder="you@email.com" />
            </div>
            <div class="form-group">
              <label>Card Details</label>
              <div id="card-element" class="stripe-card-element"></div>
            </div>
            <div class="order-summary">
              <div class="summary-row">
                <span>Order Total</span>
                <span class="total-amount">{{ orderTotal }}</span>
              </div>
            </div>
            <button class="pay-btn" :disabled="loading">
              <span v-if="loading">Processing...</span>
              <span v-else>Pay Now</span>
            </button>
            <div v-if="success" class="success-message">
              <i class="fas fa-check-circle"></i> Payment Successful! Thank you.
            </div>
            <div v-if="errorMsg" class="error-message">
              <i class="fas fa-exclamation-circle"></i> {{ errorMsg }}
            </div>
          </form>
        </div>
        <div class="checkout-modal-summary">
          <div class="summary-card">
            <div class="summary-title">Order summary</div>
            <div class="summary-tour">
              <img class="summary-img" :src="tour.image" alt="Tour image" v-if="tour && tour.image" />
              <div>
                <div class="tour-name">{{ tour?.name }}</div>
                <div class="tour-date">{{ tour?.date }}</div>
                <div class="tour-detail">{{ tour?.detail }}</div>
              </div>
            </div>
            <div class="summary-info">
              <div v-if="tour?.person"><i class="fas fa-user"></i> {{ tour.person }}</div>
              <div v-if="tour?.rating"><i class="fas fa-star"></i> {{ tour.rating }}</div>
            </div>
            <div class="summary-total">
              <div>Total</div>
              <div class="summary-price">{{ orderTotal }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
let stripe, elements, card

const props = defineProps({
  orderTotal: { type: String, default: '€149.00' },
  show: { type: Boolean, default: false },
  tour: { type: Object, default: null }
})
const emit = defineEmits(['close'])

const name = ref('')
const email = ref('')
const loading = ref(false)
const success = ref(false)
const errorMsg = ref('')

// Stripe mount/unmount işlemini show prop'una göre yap
watch(() => props.show, (val) => {
  if (val) {
    // Modal açıldıysa Stripe mount et
    if (!window.Stripe) {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.onload = setupStripe
      document.head.appendChild(script)
    } else {
      setTimeout(() => {
        setupStripe()
      }, 0)
    }
  } else {
    // Modal kapandıysa kartı unmount et
    if (card) card.unmount()
  }
})

function setupStripe() {
  stripe = window.Stripe('pk_test_51N9...YOUR_PUBLIC_KEY...') // TODO: Replace with your real public key
  elements = stripe.elements()
  card = elements.create('card')
  card.mount('#card-element')
}

const handleSubmit = async () => {
  loading.value = true
  errorMsg.value = ''
  success.value = false
  try {
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: card,
      billing_details: {
        name: name.value,
        email: email.value
      }
    })
    if (error) {
      errorMsg.value = error.message
      loading.value = false
      return
    }
    setTimeout(() => {
      loading.value = false
      success.value = true
    }, 1200)
  } catch (err) {
    errorMsg.value = err.message || 'Payment failed.'
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(44,62,80,0.18);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.checkout-modal {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 48px rgba(44,62,80,0.16);
  padding: 0;
  min-width: 900px;
  max-width: 98vw;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: modalIn 0.22s cubic-bezier(.4,2,.6,1);
}
@keyframes modalIn {
  from { transform: scale(0.95); opacity: 0.5; }
  to { transform: scale(1); opacity: 1; }
}
.close-btn {
  position: absolute;
  top: 22px;
  right: 32px;
  background: none;
  border: none;
  font-size: 2.2rem;
  color: #888;
  cursor: pointer;
  z-index: 2;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #fc6421;
}
.checkout-modal-content {
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  padding: 2.8rem 2.8rem 2.2rem 2.8rem;
}
.checkout-modal-form {
  width: 420px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}
.checkout-modal-form h2 {
  color: #223366;
  font-size: 2rem;
  margin-bottom: 18px;
  font-weight: 700;
  text-align: left;
}
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
input {
  padding: 12px 14px;
  border-radius: 8px;
  border: 1.5px solid #e0e6ed;
  font-size: 1.08rem;
  background: #f7fafd;
}
input:focus {
  border-color: #223366;
}
.stripe-card-element {
  padding: 12px 14px;
  border-radius: 8px;
  border: 1.5px solid #e0e6ed;
  background: #f7fafd;
  margin-top: 4px;
}
.order-summary {
  margin: 16px 0 8px 0;
  padding: 12px;
  background: #f7f7f7;
  border-radius: 8px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 600;
}
.total-amount {
  color: #FC6421;
}
.pay-btn {
  width: 100%;
  background: #0070eb;
  color: #fff;
  font-size: 1.18rem;
  font-weight: 700;
  border: none;
  border-radius: 32px;
  padding: 1.1rem 0;
  margin: 12px 0 0 0;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 12px rgba(0,112,235,0.08);
}
.pay-btn:disabled {
  background: #aaa;
  cursor: not-allowed;
}
.success-message {
  color: #27ae60;
  text-align: center;
  margin-top: 16px;
  font-size: 1.1rem;
}
.error-message {
  color: #fc6421;
  text-align: center;
  margin-top: 12px;
  font-size: 1rem;
}
.checkout-modal-summary {
  width: 340px;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
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
  .checkout-modal {
    min-width: 98vw;
    max-width: 99vw;
  }
  .checkout-modal-content {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
  .checkout-modal-form {
    width: 98vw;
    max-width: 520px;
    margin-bottom: 2rem;
  }
  .checkout-modal-summary {
    width: 98vw;
    max-width: 420px;
  }
}
@media (max-width: 600px) {
  .checkout-modal-content {
    padding: 0.5rem;
  }
  .summary-card {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
}
</style> 