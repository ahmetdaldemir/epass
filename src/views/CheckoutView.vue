<template>
  <div class="checkout-main-layout">
    <!-- SOL: Kişisel Bilgiler ve Ödeme Formu (Stepper) -->
    <div class="checkout-left">
      <div class="container">
        <Breadcrumb />
      </div>
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
            <select v-model="country" class="country-select-fullwidth">
              <option v-for="c in countries" :key="c.iso" :value="c.name">
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
          <div class="form-group">
            <label>Hotel Address (optional)</label>
            <input v-model="hotelAddress" type="text" placeholder="Enter your hotel address" />
          </div>
          <div class="form-group">
            <label>Your Location (optional)</label>
            <div style="display: flex; gap: 8px;">
              <input
                v-model="userLocation"
                type="text"
                placeholder="Click the button to add your current location"
                readonly
                class="input"
                style="flex: 1;"
              />
              <button type="button" @click="getLocation" class="location-btn" title="Use my location">📍</button>
            </div>
            <div v-if="userLocation">
              <a
                :href="getGoogleMapsLink(userLocation)"
                target="_blank"
                rel="noopener"
                style="color: #0070eb; text-decoration: underline; cursor: pointer; font-size:0.97em;"
              >
                View on Google Maps
              </a>
            </div>
          </div>
          <div class="form-note">We'll only contact you with essential updates or changes to your booking</div>
          
          <!-- Cancellation Policy Checkbox -->
          <div class="cancellation-policy-section">
            <label class="policy-checkbox-label">
              <input 
                v-model="policyAccepted" 
                type="checkbox" 
                class="policy-checkbox"
                required
              />
              <span class="checkbox-custom"></span>
              <span class="policy-text">
                I have read and accept the 
                <button type="button" @click="showPolicyModal = true" class="policy-link">
                  Cancellation Policy
                </button>
              </span>
            </label>
          </div>
          
          <button class="pay-btn" type="submit" :disabled="!policyAccepted">Go to payment</button>
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
            <i class="fas fa-check-circle"></i> 
            <div>
              <strong>Payment Successful!</strong>
              <p>Your booking has been confirmed. You will receive a confirmation email shortly.</p>
            </div>
          </div>
          <div v-if="errorMsg" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ errorMsg }}
          </div>
        </template>
      </form>
    </div>
    <!-- SAĞ: Order Summary -->
    <div class="checkout-right">
      <div class="order-summary-panel" v-if="selectedTourStore.tour || selectedTourStore.pass">
        <div class="order-summary-title">Order summary</div>
        
        <!-- Tour için order summary -->
        <div v-if="selectedTourStore.tour" class="order-summary-product">
          <img class="order-summary-img" :src="selectedTourStore.tour.image" :alt="selectedTourStore.tour.title" />
          <div class="order-summary-product-info">
            <div class="product-title">{{ selectedTourStore.tour.title }}</div>
            <div class="product-detail">{{ selectedTourStore.tour.description }}</div>
            <div class="product-detail" v-if="selectedTourStore.tour.bookingDate">
              <i class="fas fa-calendar-alt"></i> {{ selectedTourStore.tour.bookingDate }}
            </div>
            <div class="product-detail"><i class="fas fa-user"></i> {{ selectedTourStore.tour.participants }}</div>
            <div class="product-detail" v-if="selectedTourStore.tour.email"><i class="fas fa-envelope"></i> {{ selectedTourStore.tour.email }}</div>
            <div class="product-detail" v-if="selectedTourStore.tour.userLocation">
              <i class="fas fa-map-marker-alt"></i>
              <a
                :href="getGoogleMapsLink(selectedTourStore.tour.userLocation)"
                target="_blank"
                rel="noopener"
                style="color: #0070eb; text-decoration: underline; cursor: pointer;"
              >
                {{ selectedTourStore.tour.userLocation }}
              </a>
            </div>
          </div>
        </div>

        <!-- Pass için order summary -->
        <div v-if="selectedTourStore.pass" class="order-summary-product">
          <div class="pass-icon">
            <i class="fas fa-ticket-alt"></i>
          </div>
          <div class="order-summary-product-info">
            <div class="product-title">{{ selectedTourStore.pass.name }}</div>
            <div class="product-detail">{{ selectedTourStore.pass.days }} Day Istanbul Tourist Pass</div>
            <div class="product-detail" v-if="selectedTourStore.pass.startDate">
              <i class="fas fa-calendar-alt"></i> Start Date: {{ selectedTourStore.pass.startDate }}
            </div>
            <div class="product-detail"><i class="fas fa-user"></i> Quantity: {{ selectedTourStore.pass.quantity }}</div>
            <div class="product-detail" v-if="selectedTourStore.pass.email"><i class="fas fa-envelope"></i> {{ selectedTourStore.pass.email }}</div>
            <div class="product-detail" v-if="selectedTourStore.pass.discount">
              <i class="fas fa-tag"></i> Save {{ selectedTourStore.pass.discount }}€
            </div>
          </div>
        </div>

        <div class="order-summary-total-row">
          <span>Total</span>
          <span class="order-summary-total">{{ selectedTourStore.tour?.price || selectedTourStore.pass?.totalPrice }}</span>
        </div>
        <div class="order-summary-taxes">All taxes and fees included</div>
      </div>
    </div>
    
    <!-- Cancellation Policy Modal -->
    <div v-if="showPolicyModal" class="modal-overlay" @click="showPolicyModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Cancellation Policy Agreement</h3>
          <button @click="showPolicyModal = false" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="policy-content">
            <h4>Introduction</h4>
            <p>We aim to make your travel experience flexible and stress-free. By completing a booking, you agree to the following cancellation and refund terms:</p>
            
            <h4>1. Free Cancellation up to 24 Hours Before the Tour</h4>
            <p>You may cancel your booking up to 24 hours before the scheduled start time and receive a full refund.</p>
            
            <h4>2. Cancellation Less Than 24 Hours</h4>
            <p>Cancellations made less than 24 hours before the tour start time are non-refundable.</p>
            
            <h4>3. No-Show</h4>
            <p>If you fail to appear at the designated meeting point and time, no refund will be issued.</p>
            
            <h4>4. Rescheduling</h4>
            <p>Subject to availability and provider conditions, you may reschedule your tour without additional fees.</p>
            
            <h4>5. Cancellations by the Provider</h4>
            <p>In rare cases where the tour is canceled by the provider due to unforeseen circumstances (such as weather conditions or operational issues), you will be offered either a full refund or the option to reschedule.</p>
            
            <h4>6. How to Cancel / Request a Refund</h4>
            <p>To cancel your booking or request a refund, you must contact us by email at: <strong>info@searchyourtour.com</strong></p>
            <p>When sending your request, include the following details:</p>
            <ul>
              <li>Booking reference number</li>
              <li>Name on the reservation</li>
              <li>Tour date</li>
              <li>Reason for cancellation</li>
            </ul>
            <p>Refunds will be processed to the original payment method after your request has been verified.</p>
            
            <h4>Acceptance</h4>
            <p>By completing the booking, you confirm that you have read and accepted this Cancellation Policy Agreement.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showPolicyModal = false" class="modal-close-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSelectedTourStore } from '../stores/selectedTour'
import Breadcrumb from '../components/Breadcrumb.vue'
let stripe, elements, card
import { loadStripe } from '@stripe/stripe-js';

const router = useRouter()
const selectedTourStore = useSelectedTourStore()

// Helper function to get language ID from language code
const getLanguageId = (langCode) => {
  const languageMap = {
    'tr': 2,    // Türkçe
    'de': 6,    // Deutsch
    'en': 1,    // English
    'ar': 3,    // العربية
    'es': 4,    // Español
    'fr': 5,    // Français
    'it': 7,    // Italiano
    'pt': 8,    // Português
    'zh': 10,   // 中文
    'ja': 11,   // 日本語
    'ru': 9     // Русский
  }
  return languageMap[langCode] || 1
}

// Helper function to get currency ID from currency code
const getCurrencyId = (currencyCode) => {
  const currencyMap = {
    'EUR': 4,
    'USD': 5,
    'GBP': 6,
    'TRY': 7
  }
  return currencyMap[currencyCode] || 4
}

// Tüm ülkeler ve kodları
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
]

const country = ref(countries[0].name)
const phone = ref('')
const selectedCountry = computed(() => countries.find(c => c.name === country.value) || countries[0])

const name = ref('')
const email = ref(selectedTourStore.tour?.email || selectedTourStore.pass?.email || '')

// Customer login bilgisini localStorage'dan al
const customerLogin = ref(null)
try {
  const customerData = localStorage.getItem('customerLogin')
  if (customerData) {
    customerLogin.value = JSON.parse(customerData)
  }
} catch (error) {
  console.error('Customer login data parse error:', error)
  customerLogin.value = null
}

// Debug: Tour verilerini kontrol et
console.log('Selected Tour Store:', selectedTourStore.tour)
console.log('Customer Login:', customerLogin.value)
const cardName = ref('')
const loading = ref(false)
const success = ref(false)
const errorMsg = ref('')
const currentStep = ref(1)
const hotelAddress = ref("");
const userLocation = ref("");
const policyAccepted = ref(false);
const showPolicyModal = ref(false);

// Currency ve language bilgileri
const currentCurrency = ref(localStorage.getItem('selectedCurrency') || 'EUR')
const currencyId = computed(() => getCurrencyId(currentCurrency.value))
const languageId = computed(() => getLanguageId(localStorage.getItem('selectedLanguage') || 'en'))

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
  if (card) return
  // Stripe public key - production'da gerçek key kullanılacak
  stripe = window.Stripe('pk_test_51RmaYhQQzUg4uq68XfoINf2CrffnJsjaJ1OHLwLtNLHHKcJ2uPlQABvQi5gFefQ5CnyJtbBbLOK7yioo2pPhkzfS00bUBXgBV7') // TODO: Replace with your real public key
  elements = stripe.elements()
  card = elements.create('card', {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  })
  card.mount('#card-element')
}

function getLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    return;
  }
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      userLocation.value = data.display_name || `${latitude}, ${longitude}`;
    } catch (e) {
      userLocation.value = `${latitude}, ${longitude}`;
    }
  }, (error) => {
    alert('Could not get your location');
  });
}

function getGoogleMapsLink(location) {
  // Eğer koordinat ise (ör: "41.123, 29.456")
  if (/^-?\d+(\.\d+)?[, ]+\s*-?\d+(\.\d+)?$/.test(location)) {
    const coords = location.split(/[ ,]+/).map(Number);
    return `https://www.google.com/maps?q=${coords[0]},${coords[1]}`;
  }
  // Değilse adres olarak arat
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

// Price string'ini kuruş cinsinden integer'a çevir
function convertPriceToCents(priceString) {
  if (!priceString) return 0;
  
  // "€10.00" formatından sayısal değeri çıkar
  const numericValue = priceString.replace(/[^\d.,]/g, '').replace(',', '.');
  const amount = parseFloat(numericValue);
  
  // Kuruş cinsinden döndür (1000 = 10.00 TL)
  // Tam hassasiyet için Math.round kullanmıyoruz
  return Math.round(amount * 100);
}

const handleStep = async () => {
  if (currentStep.value === 1) {
    if (!name.value || !email.value || !country.value || !phone.value) {
      errorMsg.value = 'Please fill in all required fields.';
      return;
    }
    if (!policyAccepted.value) {
      errorMsg.value = 'Please accept the cancellation policy to continue.';
      return;
    }
    currentStep.value = 2;
    return;
  }

  loading.value = true;
  errorMsg.value = '';
  success.value = false;

  try {
    // Mevcut Stripe instance'ını kullan, yeni oluşturma
    if (!stripe) {
      throw new Error('Stripe not initialized. Please refresh the page.');
    }

    // 1. Sadece rezervasyonu ve ödeme bilgilerini backend'e gönder
    const response = await fetch('https://backend.searchyourtour.com/api/submit-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: {
          name: name.value,
          email: email.value,
          phone: selectedCountry.value.code + phone.value,
          country: country.value,
          hotel_address: hotelAddress.value,
          user_location: userLocation.value,
          confirm: true
        },
        // Tour veya Pass verilerini gönder
        ...(selectedTourStore.tour ? {
          tour: {
            id: selectedTourStore.tour?.id || null,
            title: selectedTourStore.tour?.title || '',
            description: selectedTourStore.tour?.description || '',
            price: selectedTourStore.tour?.price || '',
            booking_date: selectedTourStore.tour?.bookingDate || new Date().toISOString().split('T')[0],
            tenant_id: 'ad5257a5-efdd-4314-9e5e-b56aabe321f1',
            currency_id: currencyId.value,
            language_id: languageId.value,
            buggy: 0,
            adult: selectedTourStore.tour?.adult || 1,
            child: selectedTourStore.tour?.child || 0,
            infant: selectedTourStore.tour?.infant || 0,
            roomNumber: 0,
            randomCode: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: 'tour',
            customer_id: customerLogin.value?.id || 0
          }
        } : {
          pass: {
            id: selectedTourStore.pass?.id || null,
            name: selectedTourStore.pass?.name || '',
            days: selectedTourStore.pass?.days || 1,
            price: selectedTourStore.pass?.price || '',
            total_price: selectedTourStore.pass?.totalPrice || '',
            quantity: selectedTourStore.pass?.quantity || 1,
            start_date: selectedTourStore.pass?.startDate || new Date().toISOString().split('T')[0],
            email: selectedTourStore.pass?.email || '',
            tenant_id: 'ad5257a5-efdd-4314-9e5e-b56aabe321f1',
            currency_id: currencyId.value,
            language_id: languageId.value,
            randomCode: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: 'pass'
          }
        }),
        payment: {
          amount: convertPriceToCents(selectedTourStore.tour?.price || selectedTourStore.pass?.totalPrice || ''),
          currency: currentCurrency.value
        }
      })
    });

    const data = await response.json();

    // 2. client_secret geldiyse, Stripe ile ödemeyi başlat
    if (data?.client_secret) {
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
                      card: card, // Stripe Elements component
          billing_details: {
            name: name.value,
            email: email.value,
            phone: selectedCountry.value.code + phone.value,
            address: {
              country: selectedCountry.value.iso,
              line1: hotelAddress.value
            }
          }
        },
        return_url: 'https://yourfrontend.com/payment-status'
      });

      try {
        const payment_intent_id = data.payment_intent_id;

        if (result.error) {
          // Hata durumu
          console.error('Ödeme hatası:', result.error.message);
          errorMsg.value = result.error.message || 'Payment failed. Please try again.';
          if (data.reservation_id && payment_intent_id) {
            await fetch('https://backend.searchyourtour.com/api/check_payment_status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reservation_id: data.reservation_id,
                randomCode: data.randomCode,
                payment_intent_id: payment_intent_id
              })
            });
          }
        } else if (result.paymentIntent.status === 'succeeded') {
          // Başarılı ödeme
          success.value = true;
          if (data.reservation_id && payment_intent_id) {
            await fetch('https://backend.searchyourtour.com/api/check_payment_status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reservation_id: data.reservation_id,
                randomCode: data.randomCode,
                payment_intent_id: payment_intent_id
              })
            });
          }
          // Ödeme başarılıysa yönlendir
          router.push({
            name: 'payment-success',
            query: {
              bookingId: data.reservation_id,
              tourTitle: selectedTourStore.tour?.title || '',
              bookingDate: selectedTourStore.tour?.bookingDate || '',
              amount: selectedTourStore.tour?.price || '',
              customerName: name.value || ''
            }
          });
        } else {
          // Beklemede veya başka bir durum (ör. 3D Secure)
          errorMsg.value = 'Ödeme işlemi tamamlanmadı, ek onay gerekebilir.';
          if (data.reservation_id && payment_intent_id) {
            await fetch('https://backend.searchyourtour.com/api/check_payment_status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reservation_id: data.reservation_id,
                randomCode: data.randomCode,
                payment_intent_id: payment_intent_id
              })
            });
          }
        }
      } catch (err) {
        console.error('Payment error:', err);
        errorMsg.value = err.message || 'Payment failed. Please try again.';
      } finally {
        loading.value = false;
      }
    }
    
  } catch (err) {
    console.error('Payment error:', err);
    errorMsg.value = err.message || 'Payment failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* CheckoutForm.vue'dan taşınan stiller */
.checkout-main-layout {
  display: flex;
  gap: 64px;
  align-items: stretch;
  justify-content: center;
  background: #f6f8fa;
  padding: 48px 0;
  min-height: 100vh;
}
.checkout-left, .checkout-right {
  flex: 1 1 0;
  min-width: 340px;
  max-width: 600px;
  background: #fff;
  border-radius: 26px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.10);
  padding: 36px 44px 24px 44px;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
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
  background: linear-gradient(90deg, #FC6421 60%, #ff3401 100%);
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
  background: linear-gradient(90deg, #ff0000 60%, #ff0000 100%);
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: #f8fff9;
  border: 1px solid #27ae60;
  border-radius: 8px;
}

.success-message i {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.success-message div {
  text-align: left;
}

.success-message strong {
  display: block;
  margin-bottom: 4px;
}

.success-message p {
  margin: 0;
  font-size: 0.95rem;
  color: #666;
}
.error-message {
  color: #d7263d;
  text-align: center;
  margin-top: 12px;
  font-size: 1rem;
}

.order-summary-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
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
.order-summary-title {
  font-size: 1.45rem;
  font-weight: 900;
  margin-bottom: 18px;
  color: #1a2a3a;
  letter-spacing: -0.5px;
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
  color: #FC6421;
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
.country-select-row {
  margin-bottom: 0;
}
.country-select-flex {
  display: flex;
  align-items: center;
  gap: 8px;
}
.country-select-fullwidth {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
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
.location-btn {
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1.08rem;
  padding: 0 16px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.location-btn:hover {
  background: #eee;
}
.pass-icon {
  width: 88px;
  height: 88px;
  border-radius: 14px;
  background-color: #f7fafd;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(44,62,80,0.08);
  margin-right: 22px;
}
.pass-icon i {
  font-size: 3rem;
  color: #0070eb;
}

/* Cancellation Policy Styles */
.cancellation-policy-section {
  margin: 16px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.policy-checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  line-height: 1.4;
}

.policy-checkbox {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: #fff;
  position: relative;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.2s ease;
}

.policy-checkbox:checked + .checkbox-custom {
  background: #0070eb;
  border-color: #0070eb;
}

.policy-checkbox:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.policy-text {
  flex: 1;
  color: #333;
}

.policy-link {
  background: none;
  border: none;
  color: #0070eb;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  margin: 0;
}

.policy-link:hover {
  color: #0056b3;
  text-decoration: none;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a2a3a;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.modal-close:hover {
  background: #e9ecef;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.policy-content h4 {
  color: #1a2a3a;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 20px 0 8px 0;
}

.policy-content h4:first-child {
  margin-top: 0;
}

.policy-content p {
  margin: 0 0 12px 0;
  line-height: 1.6;
  color: #444;
}

.policy-content ul {
  margin: 8px 0 12px 20px;
  padding: 0;
}

.policy-content li {
  margin: 4px 0;
  line-height: 1.5;
  color: #444;
}

.policy-content strong {
  color: #1a2a3a;
  font-weight: 600;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  text-align: right;
}

.modal-close-btn {
  background: #0070eb;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background 0.2s;
}

.modal-close-btn:hover {
  background: #0056b3;
}
@media (max-width: 900px) {
  .checkout-main-layout {
    flex-direction: column;
    gap: 0;
    padding: 0.5rem 0 1rem 0;
    min-height: 100vh;
    width: 100vw;
    background: #fff;
    box-sizing: border-box;
  }
  .checkout-left, .checkout-right, .order-summary-panel {
    width: 100%;
    max-width: 100vw;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(44,62,80,0.06);
    padding: 0.7rem 0.5rem;
    margin: 0 0 1rem 0;
    background: #fff;
    box-sizing: border-box;
    min-width: 0;
  }
}
@media (max-width: 600px) {
  body, html {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
  }
  .checkout-main-layout {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 0 !important;
    padding: 0 12px !important;
    min-height: 100vh !important;
    width: 100vw !important;
    max-width: 100vw !important;
    background: #fff !important;
    box-sizing: border-box !important;
  }
  .checkout-left,
  .checkout-right,
  .order-summary-panel {
    width: 100% !important;
    max-width: 100vw !important;
    min-width: 0 !important;
    border-radius: 10px !important;
    box-shadow: 0 2px 8px rgba(44,62,80,0.06) !important;
    padding: 0.7rem 0.5rem !important;
    margin: 0 auto 1rem auto !important;
    background: #fff !important;
    box-sizing: border-box !important;
  }
  .checkout-left h2 {
    font-size: 1.4rem !important;
    margin-bottom: 14px !important;
  }
  .form-group,
  .country-select-fullwidth,
  .phone-input,
  .country-code-display,
  .pay-btn {
    max-width: 100vw !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    font-size: 1rem !important;
    padding-left: 0.2rem !important;
    padding-right: 0.2rem !important;
  }
  .order-summary-img {
    width: 44px !important;
    height: 44px !important;
    min-width: 32px !important;
    max-width: 44px !important;
  }
  .product-title,
  .order-summary-title {
    font-size: 1.08rem !important;
    word-break: break-word !important;
  }
  .pay-btn {
    font-size: 1.08rem !important;
    padding: 0.7rem 0 !important;
    margin-top: 0.5rem !important;
    border-radius: 12px !important;
  }
  .form-note {
    font-size: 0.9rem !important;
  }
  
  /* Modal responsive styles */
  .modal-overlay {
    padding: 10px !important;
  }
  
  .modal-content {
    max-height: 90vh !important;
    border-radius: 8px !important;
  }
  
  .modal-header {
    padding: 16px 20px !important;
  }
  
  .modal-header h3 {
    font-size: 1.2rem !important;
  }
  
  .modal-body {
    padding: 20px !important;
  }
  
  .policy-content h4 {
    font-size: 1rem !important;
    margin: 16px 0 6px 0 !important;
  }
  
  .policy-content p {
    font-size: 0.9rem !important;
    margin: 0 0 10px 0 !important;
  }
  
  .policy-content ul {
    margin: 6px 0 10px 16px !important;
  }
  
  .policy-content li {
    font-size: 0.9rem !important;
    margin: 3px 0 !important;
  }
  
  .modal-footer {
    padding: 12px 20px !important;
  }
  
  .modal-close-btn {
    padding: 8px 20px !important;
    font-size: 0.9rem !important;
  }
  
  .cancellation-policy-section {
    margin: 12px 0 !important;
    padding: 12px !important;
  }
  
  .policy-checkbox-label {
    font-size: 0.9rem !important;
    gap: 10px !important;
  }
  
  .checkbox-custom {
    width: 18px !important;
    height: 18px !important;
  }
  /* Scroll edilebilirlik için: */
  .checkout-modal,
  .checkout-content {
    width: 100vw !important;
    max-width: 100vw !important;
    height: 100vh !important;
    max-height: 100vh !important;
    overflow-y: auto !important;
    background: #fff !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
  }
}
</style>
