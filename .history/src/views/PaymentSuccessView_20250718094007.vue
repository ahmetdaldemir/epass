<template>
  <div class="payment-success-container">
    <div class="success-card">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      
      <h1 class="success-title">Payment Successful!</h1>
      <p class="success-message">Your booking has been confirmed. You will receive a confirmation email shortly.</p>
      
      <div class="booking-details" v-if="bookingDetails">
        <h3>Booking Details</h3>
        <div class="detail-row">
          <span class="detail-label">Booking ID:</span>
          <span class="detail-value">{{ bookingDetails.bookingId || 'N/A' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tour:</span>
          <span class="detail-value">{{ bookingDetails.tourTitle || 'N/A' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span>
          <span class="detail-value">{{ bookingDetails.bookingDate || 'N/A' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount:</span>
          <span class="detail-value">{{ bookingDetails.amount || 'N/A' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Customer:</span>
          <span class="detail-value">{{ bookingDetails.customerName || 'N/A' }}</span>
        </div>
      </div>
      
      <div class="action-buttons">
        <button @click="goHome" class="btn btn-primary">
          <i class="fas fa-home"></i> Go to Home
        </button>
        <button @click="goToMyPass" class="btn btn-secondary">
          <i class="fas fa-ticket-alt"></i> View My Pass
        </button>
      </div>
      
      <div class="help-section">
        <p>Need help? Contact our support team</p>
        <a href="/contact" class="contact-link">
          <i class="fas fa-envelope"></i> Contact Support
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const bookingDetails = ref(null)

onMounted(() => {
  // URL'den booking detaylarını al (eğer varsa)
  if (route.query.bookingId) {
    bookingDetails.value = {
      bookingId: route.query.bookingId,
      tourTitle: route.query.tourTitle,
      bookingDate: route.query.bookingDate,
      amount: route.query.amount,
      customerName: route.query.customerName
    }
  }
})

const goHome = () => {
  router.push('/')
}

const goToMyPass = () => {
  router.push('/my-pass')
}
</script>

<style scoped>
.payment-success-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}

.success-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.success-icon {
  margin-bottom: 20px;
}

.success-icon i {
  font-size: 80px;
  color: #27ae60;
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.success-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #2c3e50;
  margin-bottom: 15px;
  letter-spacing: -1px;
}

.success-message {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 30px;
  line-height: 1.6;
}

.booking-details {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  text-align: left;
}

.booking-details h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #6c757d;
  font-size: 1rem;
}

.detail-value {
  font-weight: 700;
  color: #2c3e50;
  font-size: 1rem;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border-radius: 50px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  min-width: 140px;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(90deg, #FC6421 60%, #ff3401 100%);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(90deg, #ff0000 60%, #ff0000 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(252, 100, 33, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(108, 117, 125, 0.3);
}

.help-section {
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
  margin-top: 20px;
}

.help-section p {
  color: #6c757d;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.contact-link {
  color: #0070eb;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .payment-success-container {
    padding: 10px;
  }
  
  .success-card {
    padding: 30px 20px;
  }
  
  .success-title {
    font-size: 2rem;
  }
  
  .success-message {
    font-size: 1.1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 250px;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .detail-value {
    font-weight: 600;
  }
}
</style> 