<template>
  <div class="reset-password-container">
    <div class="reset-password-box">
      <div class="header">
        <h2>Reset Password</h2>
        <p>Enter your new password below</p>
      </div>
      
      <form @submit.prevent="resetPassword" class="reset-form">
        <div class="form-group">
          <label>Email Address</label>
          <input v-model="email" type="email" placeholder="Enter your email" required />
        </div>
        
        <div class="form-group">
          <label>New Password</label>
          <input v-model="password" type="password" placeholder="Enter new password" required />
          <small class="field-note">Password must be at least 6 characters</small>
        </div>
        
        <div class="form-group">
          <label>Confirm New Password</label>
          <input v-model="passwordConfirmation" type="password" placeholder="Confirm new password" required />
        </div>
        
        <button class="btn btn-primary" type="submit" :disabled="loading">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
        
        <div v-if="message" :class="['message', success ? 'success' : 'error']">
          {{ message }}
        </div>
      </form>
      
      <div class="back-to-login">
        <a href="#" @click.prevent="$router.push('/my-pass')">Back to Login</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)

// URL'den token'ı al
onMounted(() => {
  const token = route.query.token
  if (!token) {
    message.value = 'Invalid reset link. Please request a new password reset.'
    success.value = false
  }
})

async function resetPassword() {
  try {
    loading.value = true
    message.value = ''
    success.value = false
    
    // Validation
    if (password.value.length < 6) {
      message.value = 'Password must be at least 6 characters.'
      success.value = false
      return
    }
    
    if (password.value !== passwordConfirmation.value) {
      message.value = 'Passwords do not match.'
      success.value = false
      return
    }
    
    const response = await fetch('https://backend.searchyourtour.com/api/customer/password/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        password_confirmation: passwordConfirmation.value,
        token: route.query.token
      })
    })

    const result = await response.json()
    
    if (result.status) {
      success.value = true
      message.value = result.message || 'Password reset successfully!'
      
      // Form'u temizle
      email.value = ''
      password.value = ''
      passwordConfirmation.value = ''
      
      // 3 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        router.push('/my-pass')
      }, 3000)
    } else {
      success.value = false
      message.value = result.message || 'Failed to reset password'
    }
  } catch (error) {
    console.error('Error resetting password:', error)
    success.value = false
    message.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-password-container {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.reset-password-box {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.10);
  padding: 48px 32px 40px 32px;
  min-width: 320px;
  max-width: 400px;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h2 {
  color: #FC6421;
  margin-bottom: 8px;
  font-size: 2rem;
  font-weight: 700;
}

.header p {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
}

.form-group input:focus {
  outline: none;
  border-color: #FC6421;
  box-shadow: 0 0 0 3px rgba(252, 100, 33, 0.1);
  background: white;
}

.field-note {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.btn {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-primary {
  background: #FC6421;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #e55a1a;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.message {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.message.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.message.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.back-to-login {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.back-to-login a {
  color: #FC6421;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.back-to-login a:hover {
  color: #e55a1a;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .reset-password-box {
    margin: 16px;
    padding: 32px 24px;
  }
}
</style>
