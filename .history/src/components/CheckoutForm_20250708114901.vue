<template>
  <div class="checkout-main-layout">
    <!-- SOL: Kişisel Bilgiler ve Ödeme Formu (Stepper) -->
    <div class="checkout-left">
      <h2>Enter your personal details</h2>
      <div class="secure-checkout">
        <i class="fas fa-lock"></i> Checkout is fast and secure
      </div>
      <form @submit.prevent="handleStep" class="checkout-form">
        <template v-if="currentStep === 1">
          <div class="form-group">
            <label>Full name <span class="required">*</span></label>
            <input v-model="name" type="text" required placeholder="Full Name" />
          </div>
          <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <input v-model="email" type="email" required placeholder="you@email.com" />
          </div>
          <div class="form-group">
            <label>Country <span class="required">*</span></label>
            <select v-model="country">
              <option value="Turkey (+90)">Turkey (+90)</option>
              <option value="United States (+1)">United States (+1)</option>
              <option value="Germany (+49)">Germany (+49)</option>
              <option value="France (+33)">France (+33)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Mobile phone number <span class="required">*</span></label>
            <input v-model="phone" type="tel" required placeholder="5xx xxx xx xx" />
          </div>
          <div class="form-note">We’ll only contact you with essential updates or changes to your booking</div>
          <button class="pay-btn" type="submit">Go to payment</button>
        </template>
        <template v-else>
          <div class="form-group">
            <label>Name on Card <span class="required">*</span></label>
            <input v-model="cardName" type="text" required placeholder="Name on Card" />
          </div>
          <div class="form-group">
            <label>Card Details</label>
            <div id="card-element" class="stripe-card-element"></div>
          </div>
          <button class="pay-btn" :disabled="loading" type="submit">
            <span v-if="loading">Processing...</span>
            <span v-else>Pay Now</span>
          </button>
          <div v-if="success" class="success-message">
            <i class="fas fa-check-circle"></i> Payment Successful! Thank you.
          </div>
          <div v-if="errorMsg" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ errorMsg }}
          </div>
        </template>
      </form>
      <div class="checkout-benefits">
        <div><i class="fas fa-check-circle"></i> Pay nothing today <span>Book now and pay later</span></div>
        <div><i class="fas fa-check-circle"></i> Free cancellation <span>Until 10:00 AM on July 17</span></div>
      </div>
    </div>
    <!-- SAĞ: Order Summary -->
    <div class="checkout-right">
      <div class="order-summary-panel">
        <div class="order-summary-title">Order summary</div>
        <div class="order-summary-product">
          <img class="order-summary-img" :src="tourDetails.image" :alt="tourDetails.title" />
          <div class="order-summary-product-info">
            <div class="product-title">{{ tourDetails.title }}</div>
            <div class="product-detail"><i class="fas fa-map-marker-alt"></i> {{ tourDetails.description }}</div>
            <div class="product-detail"><i class="fas fa-calendar-alt"></i> {{ tourDetails.date }}</div>
            <div class="product-detail"><i class="fas fa-user"></i> {{ tourDetails.participants }}</div>
            <div class="product-link"><a href="#">Change date or participants</a></div>
            <div class="product-rating">
              <span class="rating-badge">H</span>
              <span class="stars">★ {{ tourDetails.rating }}</span>
              <span class="review-count">({{ tourDetails.reviewCount }})</span>
              <span class="rating-desc">Loved by over {{ tourDetails.reviewCount }} customers</span>
            </div>
          </div>
        </div>
        <div class="order-summary-benefits">
          <div><i class="fas fa-check-circle"></i> Free cancellation <span>Until 10:00 AM on July 17</span></div>
          <div><i class="fas fa-thumbs-up"></i> Great value <span>Customers rated this {{ tourDetails.rating }}/5 for value for money</span></div>
        </div>
        <div class="order-summary-promo">
          <a href="#">Enter promo, credit, or gift code</a>
        </div>
        <div class="order-summary-total-row">
          <span>Total</span>
          <span class="order-summary-total">{{ tourDetails.price }}</span>
        </div>
        <div class="order-summary-taxes">All taxes and fees included</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
let stripe, elements, card

const props = defineProps({
  tourDetails: {
    type: Object,
    required: true,
    default: () => ({
      image: 'https://cdn.getyourguide.com/img/tour/5c4b6e7e4e2b1.jpeg/68.jpg',
      title: 'San Diego: Harbor Cruise',
      description: 'North Harbor Tour (1 Hour) • Language: English',
      date: 'Friday, July 18, 2025 at 10:00 AM',
      participants: '1 adult (Age 13 - 99)',
      rating: 4.6,
      reviewCount: 1200,
      price: '₺1,455.50'
    })
  }
})

const name = ref('')
const email = ref('')
const country = ref('Turkey (+90)')
const phone = ref('')
const cardName = ref('')
const loading = ref(false)
const success = ref(false)
const errorMsg = ref('')
const currentStep = ref(1)

onMounted(() => {
  watch(currentStep, (step) => {
    if (step === 2) {
      setTimeout(() => {
        if (!window.Stripe) {
          const script = document.createElement('script')
          script.src = 'https://js.stripe.com/v3/'
          script.onload = setupStripe
          document.head.appendChild(script)
        } else {
          setupStripe()
        }
      }, 0)
    }
  }, { immediate: true })
})

function setupStripe() {
  if (card) return // tekrar mount etme
  stripe = window.Stripe('pk_test_51N9...YOUR_PUBLIC_KEY...') // TODO: Replace with your real public key
  elements = stripe.elements()
  card = elements.create('card')
  card.mount('#card-element')
}

const handleStep = async () => {
  if (currentStep.value === 1) {
    // Basit validasyon
    if (!name.value || !email.value || !country.value || !phone.value) return
    currentStep.value = 2
    return
  }
  // 2. adım: ödeme
  loading.value = true
  errorMsg.value = ''
  success.value = false
  try {
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: card,
      billing_details: {
        name: cardName.value,
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
.checkout-main-layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  justify-content: center;
  background: #f6f8fa;
  padding: 40px 0;
}
.checkout-left {
  width: 480px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 32px 24px 18px 24px;
  font-family: 'Inter', sans-serif;
}
.hold-spot-banner {
  background: #ffe9e9;
  color: #d7263d;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 1rem;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.hold-spot-banner span { font-weight: 600; }
.secure-checkout {
  color: #1a7f37;
  font-size: 1rem;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
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
input, select {
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
.form-note {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 8px;
}
.required { color: #d7263d; }
.pay-btn {
  width: 100%;
  background: #0070f3;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  padding: 14px 0;
  margin: 12px 0 0 0;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(0,112,243,0.08);
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
  color: #d7263d;
  text-align: center;
  margin-top: 12px;
  font-size: 1rem;
}
.checkout-benefits {
  margin-top: 24px;
  font-size: 1rem;
  color: #1a7f37;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.checkout-benefits i {
  color: #1a7f37;
  margin-right: 6px;
}
.checkout-benefits span {
  color: #222;
  font-weight: 400;
  margin-left: 6px;
}

.checkout-right {
  width: 370px;
  position: sticky;
  top: 40px;
}
.order-summary-panel {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 24px 20px 18px 20px;
  font-family: 'Inter', sans-serif;
}
.order-summary-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 18px;
}
.order-summary-product {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}
.order-summary-img {
  width: 68px;
  height: 68px;
  border-radius: 8px;
  object-fit: cover;
}
.order-summary-product-info {
  flex: 1;
}
.product-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 2px;
}
.product-detail {
  font-size: 0.98rem;
  color: #444;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.product-link {
  margin: 4px 0 2px 0;
}
.product-link a {
  color: #0070f3;
  font-size: 0.97rem;
  text-decoration: underline;
}
.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.rating-badge {
  background: #1a7f37;
  color: #fff;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}
.stars {
  color: #1a7f37;
  font-weight: 600;
}
.review-count {
  color: #888;
  font-size: 0.97rem;
}
.rating-desc {
  color: #888;
  font-size: 0.97rem;
}
.order-summary-benefits {
  margin: 12px 0 8px 0;
  font-size: 1rem;
  color: #1a7f37;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.order-summary-benefits i {
  color: #1a7f37;
  margin-right: 6px;
}
.order-summary-benefits span {
  color: #222;
  font-weight: 400;
  margin-left: 6px;
}
.order-summary-promo {
  margin: 10px 0 10px 0;
}
.order-summary-promo a {
  color: #0070f3;
  font-size: 0.97rem;
  text-decoration: underline;
}
.order-summary-total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 10px;
}
.order-summary-total {
  color: #0070f3;
}
.order-summary-taxes {
  color: #1a7f37;
  font-size: 0.97rem;
  margin-top: 2px;
  text-align: right;
}
</style> 