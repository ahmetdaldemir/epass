<template>
  <div class="currency-switcher">
    <div class="currency-dropdown" @click="toggleDropdown" ref="dropdownRef">
      <div class="currency-display">
        <span class="currency-symbol">{{ currentCurrency.symbol }}</span>
        <span class="currency-code">{{ currentCurrency.code }}</span>
        <i class="fas fa-chevron-down" :class="{ 'rotated': isDropdownOpen }"></i>
      </div>
      
      <div class="currency-options" v-if="isDropdownOpen">
        <div 
          v-for="currency in currencies" 
          :key="currency.code"
          class="currency-option"
          @click="changeCurrency(currency.code)"
          :class="{ 'active': currency.code === currentCurrency.code }"
        >
          <span class="currency-symbol">{{ currency.symbol }}</span>
          <span class="currency-name">{{ currency.name }}</span>
          <span class="currency-code">{{ currency.code }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useCurrencyStore } from '../stores/currency'

const emit = defineEmits(['currency-changed'])

const dropdownRef = ref(null)
const isDropdownOpen = ref(false)

// Currency store'u kullan
const currencyStore = useCurrencyStore()

// Currency store'dan currencies'ı al
const currencies = computed(() => {
  return currencyStore.currencies.map(currency => ({
    code: currency.currency,
    name: currency.name,
    symbol: currency.icon,
    id: currency.id
  }))
})

// Current currency'yi currency store'dan al
const currentCurrency = computed(() => {
  const currentCode = currencyStore.getCurrentCurrency()
  return currencies.value.find(c => c.code === currentCode) || currencies.value[0]
})

// Close dropdown when clicking outside
onClickOutside(dropdownRef, () => {
  isDropdownOpen.value = false
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const changeCurrency = (currencyCode) => {
  const currency = currencies.value.find(c => c.code === currencyCode)
  if (currency) {
    currentCurrency.value = currency
    isDropdownOpen.value = false
    
    // Save to localStorage
    localStorage.setItem('selectedCurrency', currencyCode)
    
    // Emit event for parent components
    emit('currency-changed', currencyCode)
    
    // Dispatch custom event for global listeners
    window.dispatchEvent(new CustomEvent('currency-changed', {
      detail: { 
        currency: currencyCode,
        currencyId: currency.id
      }
    }))
  }
}

// Initialize from localStorage
onMounted(() => {
  const savedCurrency = localStorage.getItem('selectedCurrency')
  if (savedCurrency) {
    const currency = currencies.value.find(c => c.code === savedCurrency)
    if (currency) {
      currentCurrency.value = currency
    }
  } else {
    // Default to EUR if no currency is saved
    currentCurrency.value = currencies.value.find(c => c.code === 'EUR') || currencies.value[0]
  }
})
</script>

<style scoped>
.currency-switcher {
  position: relative;
  display: inline-block;
}

.currency-dropdown {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.currency-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  transition: border-color 0.2s;
}

.currency-display:hover {
  border-color: #fc6421;
}

.currency-symbol {
  font-weight: bold;
  font-size: 16px;
}

.currency-code {
  color: #666;
  font-size: 12px;
}

.currency-display i {
  font-size: 12px;
  transition: transform 0.2s;
  color: #666;
}

.currency-display i.rotated {
  transform: rotate(180deg);
}

.currency-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.currency-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.currency-option:last-child {
  border-bottom: none;
}

.currency-option:hover {
  background-color: #f8f9fa;
}

.currency-option.active {
  background-color: #fc6421;
  color: white;
}

.currency-option.active .currency-code {
  color: rgba(255, 255, 255, 0.8);
}

.currency-name {
  flex: 1;
  font-size: 14px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .currency-display {
    padding: 6px 8px;
    font-size: 13px;
  }
  
  .currency-options {
    max-height: 150px;
  }
  
  .currency-option {
    padding: 8px 10px;
  }
}
</style> 