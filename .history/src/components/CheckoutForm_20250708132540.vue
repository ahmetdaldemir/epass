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
              <option v-for="c in countries" :key="c.iso" :value="c.name">
                <img :src="`https://flagsapi.com/${c.iso}/flat/24.png`" :alt="c.name" class="flag-option" />
                {{ c.name }}
              </option>
            </select>
          </div>
          <div class="form-group phone-row">
            <label>Mobile phone number <span class="required">*</span></label>
            <div class="phone-input-group">
              <div class="country-code-display">
                <img :src="`https://flagsapi.com/${selectedCountry.iso}/flat/24.png`" :alt="selectedCountry.name" class="flag-option" />
                <span>{{ selectedCountry.code }}</span>
              </div>
              <input
                v-model="phone"
                type="tel"
                required
                class="phone-input"
                :placeholder="selectedCountry.iso === 'TR' ? '5xx xxx xx xx' : selectedCountry.iso === 'US' ? 'xxx xxx xxxx' : selectedCountry.iso === 'DE' ? '1xx xxxxxxx' : 'xx xx xx xx'"
              />
            </div>
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
import { ref, onMounted, watch, computed } from 'vue'
let stripe, elements, card

// Tüm ülkeler ve kodları (örnek, daha fazlası eklenebilir)
const countries = [
  { name: 'Turkey', code: '+90', iso: 'TR' },
  { name: 'United States', code: '+1', iso: 'US' },
  { name: 'Germany', code: '+49', iso: 'DE' },
  { name: 'France', code: '+33', iso: 'FR' },
  { name: 'United Kingdom', code: '+44', iso: 'GB' },
  { name: 'Italy', code: '+39', iso: 'IT' },
  { name: 'Spain', code: '+34', iso: 'ES' },
  { name: 'Netherlands', code: '+31', iso: 'NL' },
  { name: 'Russia', code: '+7', iso: 'RU' },
  { name: 'Japan', code: '+81', iso: 'JP' },
  { name: 'China', code: '+86', iso: 'CN' },
  { name: 'India', code: '+91', iso: 'IN' },
  { name: 'Brazil', code: '+55', iso: 'BR' },
  { name: 'Canada', code: '+1', iso: 'CA' },
  { name: 'Australia', code: '+61', iso: 'AU' },
  // ...daha fazla ülke eklenebilir
]

const country = ref(countries[0].name)
const phone = ref('')

const selectedCountry = computed(() => countries.find(c => c.name === country.value) || countries[0])

const props = defineProps({
  tourDetails: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const name = ref('')
const email = ref('')
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
    if (!name.value || !email.value || !country.value || !phone.value) return
    currentStep.value = 2
    return
  }
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
  gap: 64px;
  align-items: flex-start;
  justify-content: center;
  background: #f6f8fa;
  padding: 48px 0;
}
.checkout-left {
  width: 600px;
  background: #fff;
  border-radius: 26px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.10);
  padding: 36px 44px 24px 44px;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
.checkout-left h2 {
  color: #1a2a3a;
  font-size: 2.3rem;
  margin-bottom: 18px;
  font-weight: 900;
  text-align: left;
  letter-spacing: -1px;
}
.secure-checkout {
  color: #0a8a4a;
  font-size: 1.08rem;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
input, select {
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid #e0e6ed;
  font-size: 1.08rem;
  background: #f7fafd;
  outline: none;
  transition: border 0.2s;
}
input:focus, select:focus {
  border-color: #0070eb;
}
.stripe-card-element {
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid #e0e6ed;
  background: #f7fafd;
  margin-top: 4px;
}
.form-note {
  font-size: 0.97rem;
  color: #888;
  margin-bottom: 8px;
}
.required { color: #d7263d; }
.pay-btn {
  width: 100%;
  background: linear-gradient(90deg, #0070eb 60%, #00c6fb 100%);
  color: #fff;
  font-size: 1.15rem;
  font-weight: 800;
  border: none;
  border-radius: 32px;
  padding: 1.05rem 0;
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 12px rgba(0,112,235,0.08);
  letter-spacing: 0.5px;
}
.pay-btn:hover {
  background: linear-gradient(90deg, #005bb5 60%, #00a6d6 100%);
  box-shadow: 0 4px 24px rgba(0,112,235,0.13);
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
/* checkout-benefits kaldırıldı */

.checkout-right {
  width: 480px;
  position: sticky;
  top: 48px;
}
.order-summary-panel {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.10);
  padding: 36px 36px 22px 36px;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.order-summary-title {
  font-size: 1.45rem;
  font-weight: 900;
  margin-bottom: 18px;
  color: #1a2a3a;
  letter-spacing: -0.5px;
}
.order-summary-product {
  display: flex;
  gap: 22px;
  margin-bottom: 10px;
  align-items: flex-start;
}
.order-summary-img {
  width: 88px;
  height: 88px;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(44,62,80,0.08);
}
.order-summary-product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.product-title {
  font-weight: 900;
  font-size: 1.18rem;
  margin-bottom: 2px;
  color: #1a2a3a;
}
.product-detail {
  font-size: 1.04rem;
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
  color: #0070eb;
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
  background: #0a8a4a;
  color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.05rem;
}
.stars {
  color: #0a8a4a;
  font-weight: 700;
}
.review-count {
  color: #888;
  font-size: 0.97rem;
}
.rating-desc {
  color: #888;
  font-size: 0.97rem;
}
.order-summary-badge {
  display: inline-block;
  background: #ff385c;
  color: #fff;
  font-size: 0.93rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 2px 10px;
  margin-bottom: 6px;
  margin-left: 4px;
  letter-spacing: 0.2px;
}
.order-summary-benefits {
  margin: 12px 0 8px 0;
  font-size: 1.01rem;
  color: #0a8a4a;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.order-summary-benefits i {
  color: #0a8a4a;
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
  color: #0070eb;
  font-size: 0.97rem;
  text-decoration: underline;
}
.order-summary-total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.22rem;
  font-weight: 900;
  margin-top: 10px;
  letter-spacing: 0.2px;
}
.order-summary-total {
  color: #0070eb;
  font-size: 1.32rem;
  font-weight: 900;
}
.order-summary-taxes {
  color: #0a8a4a;
  font-size: 0.97rem;
  margin-top: 2px;
  text-align: right;
}
.phone-row {
  margin-bottom: 0;
}
.phone-input-group {
  display: flex;
  gap: 10px;
  align-items: stretch;
}
.country-code-display {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f7fafd;
  border: 2px solid #e0e6ed;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 1.08rem;
  min-width: 90px;
  font-weight: 600;
  height: 48px;
  box-sizing: border-box;
}
.flag-option {
  width: 22px;
  height: 16px;
  margin-right: 7px;
  vertical-align: middle;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.07);
}
.phone-input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid #e0e6ed;
  font-size: 1.08rem;
  background: #f7fafd;
  outline: none;
  transition: border 0.2s;
  height: 48px;
  box-sizing: border-box;
}
.phone-input:focus {
  border-color: #0070eb;
}
@media (max-width: 1100px) {
  .checkout-main-layout {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 1.2rem 0 2.5rem 0;
  }
  .checkout-left {
    width: 98vw;
    max-width: 600px;
    margin-bottom: 2rem;
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
  .checkout-right {
    width: 98vw;
    max-width: 520px;
  }
  .order-summary-panel {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
}
@media (max-width: 600px) {
  .checkout-left {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
  .order-summary-panel {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
}
</style> 