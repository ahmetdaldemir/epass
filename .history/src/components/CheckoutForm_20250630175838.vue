<template>
  <div class="checkout-container">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
let stripe, elements, card

const props = defineProps({
  orderTotal: { type: String, default: '€149.00' }
})

const name = ref('')
const email = ref('')
const loading = ref(false)
const success = ref(false)
const errorMsg = ref('')

onMounted(() => {
  if (!window.Stripe) {
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.onload = setupStripe
    document.head.appendChild(script)
  } else {
    setupStripe()
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
    // 1. Create payment intent on your backend (API call required)
    // 2. Confirm card payment with Stripe.js
    // ---
    // Demo: Sadece frontend gösterimi, gerçek ödeme için backend gereklidir.
    // Aşağıdaki kodu backend entegrasyonu ile değiştirin.
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
    // Gerçek uygulamada burada backend'e paymentMethod.id gönderip paymentIntent oluşturmalısınız.
    // Başarılı demo için:
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
.checkout-container {
  width: 600px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 32px 24px;
  font-family: 'Inter', sans-serif;
}
.checkout-container h2 {
  color: #e6004c;
  font-size: 2rem;
  margin-bottom: 18px;
  font-weight: 700;
  text-align: center;
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
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  font-size: 1rem;
}
.stripe-card-element {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  background: #fafafa;
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
  color: #e6004c;
}
.pay-btn {
  width: 100%;
  background: #e6004c;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  padding: 14px 0;
  margin: 12px 0 0 0;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(230,0,76,0.08);
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
</style> 