<template>
  <div class="plan-save">
    <div class="plan-header">
      <h2>Select visit duration and view your savings</h2>
      <div class="plan-tabs">
        <button :class="['plan-tab', { active: selectedDays === 3 }]" @click="selectDays(3)">3 Days</button>
        <button :class="['plan-tab', { active: selectedDays === 5 }]" @click="selectDays(5)">5 Days</button>
        <button :class="['plan-tab', { active: selectedDays === 7 }]" @click="selectDays(7)">7 Days</button>
      </div>
      <div class="plan-desc">Example {{ selectedDays }}-day Istanbul itinerary</div>
      <div class="plan-note">Plan ahead or choose as you go</div>
    </div>

    <div v-if="selectedDays === 3" class="plan-days plan-days-3">
      <div v-for="(day, i) in plans[3]" :key="i" class="plan-day">
        <h3>Example Day {{ i + 1 }}</h3>
        <div class="plan-cards">
          <div v-for="(item, j) in day" :key="j" class="plan-card">
            <div class="plan-card-img" v-if="item.img">
              <img :src="item.img" :alt="item.title" />
            </div>
            <div class="plan-card-content">
              <div class="plan-card-title">{{ item.title }}</div>
              <div class="plan-card-price">Normally {{ item.price }}</div>
              <button class="plan-card-btn">LEARN MORE</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="plan-slider-wrap">
      <button class="plan-slider-arrow" @click="prevSlide" :disabled="sliderIndex === 0">&#8592;</button>
      <div class="plan-slider">
        <div
          v-for="(day, i) in visibleDays"
          :key="i + sliderIndex"
          class="plan-day"
        >
          <h3>Example Day {{ i + 1 + sliderIndex }}</h3>
          <div class="plan-cards">
            <div v-for="(item, j) in day" :key="j" class="plan-card">
              <div class="plan-card-img" v-if="item.img">
                <img :src="item.img" :alt="item.title" />
              </div>
              <div class="plan-card-content">
                <div class="plan-card-title">{{ item.title }}</div>
                <div class="plan-card-price">Normally {{ item.price }}</div>
                <button class="plan-card-btn">LEARN MORE</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="plan-slider-arrow" @click="nextSlide" :disabled="sliderIndex + 3 >= plans[selectedDays].length">&#8594;</button>
    </div>

    <div class="plan-summary">
      <div class="plan-summary-title">{{ selectedDays }}-Day Saving with Istanbul E-pass</div>
      <div class="plan-summary-row">
        <span>Total gate price cost of visiting these attractions</span>
        <span>€ {{ totalGatePrice }}</span>
      </div>
      <div class="plan-summary-row">
        <span>Price of buying a {{ selectedDays }}-day Istanbul E-pass</span>
        <span>€ {{ passPrice }}</span>
      </div>
      <div class="plan-summary-row">
        <span>How much you save with Istanbul E-pass<br><small>That's a huge saving of over {{ savingPercent }}%</small></span>
        <span>€ {{ totalSavings }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedDays = ref(3)
const sliderIndex = ref(0)

const plans = {
  3: [
    [
      { title: 'Topkapi Palace', price: '60€', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
      { title: 'Hagia Sophia (Ayasofya)', price: '14€', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
      { title: 'Bosphorus Cruise', price: '15€', img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80' },
      { title: 'Blue Mosque Istanbul', price: '10€', img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80' }
    ],
    [
      { title: 'Dolmabahce Palace', price: '45€', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80' },
      { title: 'Galata Tower Entrance', price: '35€', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
      { title: 'Museum Of Illusions', price: '17€', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
      { title: 'Bosphorus Cruise', price: '15€', img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80' }
    ],
    [
      { title: 'Basilica Cistern', price: '36€', img: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&q=80' },
      { title: 'Whirling Dervishes', price: '20€', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
      { title: 'Istanbul Archaeology Museum', price: '18€', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80' },
      { title: 'Great Palace Mosaic Museum', price: '4€', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' }
    ]
  ],
  5: [
    [
      { title: 'Dolmabahce Palace', price: '45€', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80' },
      { title: 'Galata Tower Entrance', price: '35€', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
      { title: 'Museum Of Illusions', price: '17€', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
      { title: 'Bosphorus Cruise', price: '15€', img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80' }
    ],
    [
      { title: 'Basilica Cistern', price: '36€', img: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&q=80' },
      { title: 'Whirling Dervishes', price: '20€', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
      { title: 'Istanbul Archaeology Museum', price: '18€', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80' },
      { title: 'Great Palace Mosaic Museum', price: '4€', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' }
    ],
    [
      { title: 'Sapphire Observation Deck', price: '15€', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
      { title: 'Rumeli Fortress', price: '7€', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
      { title: 'Istanbul 4D Skyride', price: '10€', img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80' }
    ],
    [
      { title: 'Bosphorus Cruise', price: '15€', img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80' },
      { title: 'Turkish and Islamic Arts Museum', price: '20€', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' }
    ],
    [
      { title: 'Great Palace Mosaic Museum', price: '4€', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' }
    ]
  ],
  7: [
    [
      { title: 'Istanbul Aquarium', price: '26€', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
      { title: 'Balat Toy Museum', price: '13€', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' }
    ],
    [
      { title: 'Bursa Tour Day', price: '35€', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' }
    ],
    [
      { title: 'Sapanca Lake and Nature', price: '30€', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' }
    ],
    [
      { title: 'Sapphire Observation Deck', price: '15€', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' }
    ],
    [
      { title: 'Rumeli Fortress', price: '7€', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' }
    ],
    [
      { title: 'Istanbul 4D Skyride', price: '10€', img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80' }
    ],
    [
      { title: 'Great Palace Mosaic Museum', price: '4€', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' }
    ]
  ]
}

const passPrices = { 3: 175, 5: 225, 7: 275 }

const selectDays = (days) => {
  selectedDays.value = days
  sliderIndex.value = 0
}

const visibleDays = computed(() => {
  // 3 gün gösterilecek şekilde slider
  return plans[selectedDays.value].slice(sliderIndex.value, sliderIndex.value + 3)
})

const prevSlide = () => {
  if (sliderIndex.value > 0) sliderIndex.value--
}
const nextSlide = () => {
  if (sliderIndex.value + 3 < plans[selectedDays.value].length) sliderIndex.value++
}

const totalGatePrice = computed(() => {
  // Tüm günlerdeki tüm kartların fiyatını topla (sadece sayı kısmını al)
  const all = plans[selectedDays.value].flat()
  return all.reduce((sum, item) => sum + parseInt(item.price), 0)
})
const passPrice = computed(() => passPrices[selectedDays.value])
const totalSavings = computed(() => totalGatePrice.value - passPrice.value)
const savingPercent = computed(() => Math.round((totalSavings.value / totalGatePrice.value) * 100))
</script>

<style scoped>
.plan-save {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 12px 64px 12px;
  font-family: 'Poppins', Arial, sans-serif;
  color: #223366;
}
.plan-header {
  text-align: center;
  margin-bottom: 24px;
}
.plan-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 18px 0 8px 0;
}
.plan-tab {
  background: #fff;
  border: 2px solid #223366;
  color: #223366;
  border-radius: 8px;
  font-size: 2rem;
  font-weight: 600;
  padding: 12px 28px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.plan-tab.active {
  background: #223366;
  color: #fff;
}
.plan-desc {
  font-size: 1.2rem;
  margin-bottom: 4px;
}
.plan-note {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 18px;
}
.plan-days {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 32px;
}
.plan-day {
  min-width: 260px;
  max-width: 320px;
}
.plan-day h3 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 16px;
  color: #223366;
}
.plan-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.plan-card {
  background: #eaf6fa;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(34,51,102,0.07);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  min-height: 70px;
}
.plan-card-img img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
}
.plan-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.plan-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #223366;
}
.plan-card-price {
  font-size: 0.95rem;
  color: #444;
}
.plan-card-btn {
  background: #e6007a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 14px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  align-self: flex-start;
  transition: background 0.2s;
}
.plan-card-btn:hover {
  background: #b8005c;
}
.plan-slider-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-bottom: 32px;
}
.plan-slider {
  display: flex;
  gap: 32px;
}
.plan-slider-arrow {
  background: #eaf6fa;
  border: 2px solid #b2e0e6;
  color: #1bb6c1;
  border-radius: 8px;
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
}
.plan-slider-arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.plan-summary {
  max-width: 500px;
  margin: 0 auto;
  background: #f7fafd;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(34,51,102,0.07);
  padding: 24px 18px;
  margin-bottom: 32px;
}
.plan-summary-title {
  background: #223366;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 8px 0;
  text-align: center;
  margin-bottom: 18px;
}
.plan-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 1.05rem;
  margin-bottom: 10px;
  gap: 12px;
}
.plan-summary-row small {
  color: #888;
  font-size: 0.95em;
}
@media (max-width: 900px) {
  .plan-days, .plan-slider {
    flex-direction: column;
    gap: 18px;
    align-items: center;
  }
  .plan-slider-wrap {
    flex-direction: column;
    gap: 8px;
  }
}
@media (max-width: 600px) {
  .plan-save {
    padding: 12px 2px 32px 2px;
  }
  .plan-day {
    min-width: 0;
    max-width: 100vw;
  }
  .plan-card-img img {
    width: 48px;
    height: 48px;
  }
  .plan-tabs {
    flex-direction: column;
    gap: 6px;
  }
}
</style> 