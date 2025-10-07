<template>
  <div class="istanbul-pass">
    <section class="hero-section">
      <div class="container">
        <h1>SearchYourTour Pass</h1>
        <p>Choose the perfect pass for your Istanbul adventure</p>
      </div>
    </section>

    <div class="container">
      <Breadcrumb />
    </div>

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
          <div class="date-input-wrapper" ref="dateInputWrapper">
            <input
              type="text"
              class="input date-input"
              :value="startDate"
              placeholder="gg.aa.yyyy"
              readonly
              @click="openDatePicker"
              style="background:#f7f7f7; color:#222; padding-right:36px;"
            />
            <span class="calendar-icon" @click="openDatePicker">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="#FC6421" stroke-width="2"/>
                <path d="M16 3v4M8 3v4" stroke="#FC6421" stroke-width="2" stroke-linecap="round"/>
                <path d="M3 9h18" stroke="#FC6421" stroke-width="2"/>
              </svg>
            </span>
            <ElDatePicker
              v-if="!isMobile"
              ref="pickerRef"
              v-model="startDate"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :teleported="false"
              :editable="false"
              :input-visible="false"
              :disabled-date="disablePastDates"
              popper-class="custom-datepicker-popper"
              :popper-options="{ placement: 'bottom-start' }"
              style="opacity:0; pointer-events:none; position:absolute; left:0; top:0; width:100%;"
              @change="onDateChange"
            />
            <!-- Mobilde tam ekran ve scrollable v-calendar -->
            <div v-if="isMobile && showDatePicker" class="mobile-calendar-modal">
              <div class="calendar-modal-header">
                <span>Pick a date</span>
                <button class="calendar-modal-close" @click="showDatePicker = false">&times;</button>
              </div>
              <div class="calendar-scroll-container">
                <Calendar
                  :columns="1"
                  :rows="9"
                  :min-date="todayStr"
                  :locale="'en-US'"
                  @dayclick="onDayClick"
                  class="vcalendar-mobile"
                />
              </div>
            </div>
          </div>
          <button 
            class="pay-btn" 
            @click="proceedToPayment"
            :disabled="!isDateSelected"
            :class="{ 'disabled': !isDateSelected }"
          >
            {{ isDateSelected ? 'Proceed to Payment' : 'Please Select Date' }}
          </button>
          <div class="save-note">
            <b>Save over {{ savings }}</b> on attractions versus original prices.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSelectedTourStore } from '../stores/selectedTour'
import Breadcrumb from '../components/Breadcrumb.vue'
import { ElDatePicker } from 'element-plus'
import 'element-plus/dist/index.css'
import { Calendar } from 'v-calendar';
import 'v-calendar/style.css';

const router = useRouter()
const selectedTourStore = useSelectedTourStore()

const passes = ref([
  {
    id: 1,
    name: '1 Day Pass',
    price: 139,
    oldPrice: 230,
    discount: 91,
    days: 1,
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
    days: 3,
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
    days: 7,
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

// Date picker için gerekli state'ler
const showDatePicker = ref(false)
const pickerRef = ref(null)
const isMobile = ref(false)
const todayStr = new Date().toISOString().slice(0, 10);

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

// Tarih seçili mi kontrolü
const isDateSelected = computed(() => {
  return startDate.value && startDate.value.trim() !== '';
})

// DatePicker'ı input ile tetiklemek için fonksiyonlar
function openDatePicker() {
  if (isMobile.value) {
    showDatePicker.value = true;
  } else {
    nextTick(() => {
      if (pickerRef.value) pickerRef.value.handleOpen();
    });
  }
}

function onDateChange(val) {
  showDatePicker.value = false;
}

function onDayClick(day) {
  if (!day || !day.id) return;
  // Seçilen gün bugünden küçükse izin verme
  if (day.id < todayStr) return;
  startDate.value = day.id;
  showDatePicker.value = false;
}

// Masaüstü için bugünden önceki tarihleri devre dışı bırak
function disablePastDates(date) {
  const today = new Date();
  today.setHours(0,0,0,0);
  return date < today;
}

const proceedToPayment = () => {
  if (!startDate.value || startDate.value === '' || startDate.value.trim() === '') {
    alert('Please select a date before proceeding to payment');
    return;
  }
  
  if (!selectedPass.value) {
    alert('Please select a pass before proceeding to payment');
    return;
  }

  // Pass verilerini store'a aktar
  selectedTourStore.setPass({
    id: selectedPass.value.id,
    name: selectedPass.value.name,
    price: selectedPass.value.price,
    oldPrice: selectedPass.value.oldPrice,
    discount: selectedPass.value.discount,
    days: selectedPass.value.days,
    quantity: quantity.value,
    email: email.value,
    startDate: startDate.value,
    totalPrice: orderTotal.value,
    instantFee: instantFee,
    features: selectedPass.value.features,
    type: 'pass' // Pass olduğunu belirtmek için
  })

  // Checkout'a yönlendir
  router.push('/checkout')
}

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  // Temizlik
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
  });
})
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

/* Tarih seçici stilleri */
.date-input-wrapper {
  position: relative;
  margin-bottom: 10px;
}

.date-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  font-size: 1rem;
  cursor: pointer;
}

.calendar-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 2;
}

.calendar-icon svg {
  width: 20px;
  height: 20px;
}

/* Mobil takvim modal stilleri */
.mobile-calendar-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.calendar-modal-header {
  background: #fff;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.calendar-modal-header span {
  font-weight: 600;
  font-size: 1.1rem;
}

.calendar-modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-scroll-container {
  flex: 1;
  background: #fff;
  overflow-y: auto;
}

.vcalendar-mobile {
  width: 100%;
  height: 100%;
}

/* Disabled buton stili */
.pay-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pay-btn.disabled:hover {
  background: #ccc;
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