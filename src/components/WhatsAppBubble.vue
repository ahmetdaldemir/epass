<template>
  <div class="whatsapp-bubble" @click="openWhatsApp">
    <div class="whatsapp-icon">
      <i class="fab fa-whatsapp"></i>
    </div>
    <div class="whatsapp-tooltip" v-if="showTooltip">
      {{ $t('whatsapp.tooltip') }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const showTooltip = ref(false)
let tooltipTimeout = null

const openWhatsApp = () => {
  // WhatsApp numarası: +90 537 325 72 04
  const phoneNumber = '905373257204'
  const message = encodeURIComponent(t('whatsapp.defaultMessage'))
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
}

const showTooltipOnHover = () => {
  showTooltip.value = true
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout)
  }
  tooltipTimeout = setTimeout(() => {
    showTooltip.value = false
  }, 3000)
}

const hideTooltip = () => {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout)
  }
  showTooltip.value = false
}

onMounted(() => {
  // 3 saniye sonra tooltip'i göster
  setTimeout(() => {
    showTooltip.value = true
    tooltipTimeout = setTimeout(() => {
      showTooltip.value = false
    }, 5000)
  }, 2000)
})

onBeforeUnmount(() => {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout)
  }
})
</script>

<style scoped>
.whatsapp-bubble {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s ease;
}

.whatsapp-bubble:hover {
  transform: scale(1.1);
}

.whatsapp-icon {
  width: 60px;
  height: 60px;
  background: #25D366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.whatsapp-icon:hover {
  box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
}

.whatsapp-icon i {
  font-size: 30px;
  color: white;
}

.whatsapp-tooltip {
  position: absolute;
  bottom: 70px;
  right: 0;
  background: #333;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.3s ease;
  max-width: 200px;
  white-space: normal;
  text-align: center;
}

.whatsapp-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 20px;
  border: 6px solid transparent;
  border-top-color: #333;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .whatsapp-bubble {
    bottom: 80px;
    right: 15px;
  }
  
  .whatsapp-icon {
    width: 55px;
    height: 55px;
  }
  
  .whatsapp-icon i {
    font-size: 26px;
  }
  
  .whatsapp-tooltip {
    bottom: 65px;
    right: -10px;
    font-size: 13px;
    padding: 10px 14px;
    max-width: 180px;
  }
}

/* Pulse animation */
.whatsapp-icon::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  background: #25D366;
  opacity: 0.3;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
}
</style>

