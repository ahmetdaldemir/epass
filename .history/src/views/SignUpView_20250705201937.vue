<template>
  <div class="signup-outer">
    <div class="signup-box">
      <h2>Sign Up</h2>
      <form @submit.prevent="handleSignUp">
        <input v-model="name" type="text" placeholder="Name" required />
        <input v-model="email" type="email" placeholder="E-mail" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <input v-model="passwordRepeat" type="password" placeholder="Repeat Password" required />
        <button class="btn btn-primary" type="submit">Sign Up</button>
        <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const passwordRepeat = ref('')
const errorMsg = ref('')
const router = useRouter()

function handleSignUp() {
  if (password.value !== passwordRepeat.value) {
    errorMsg.value = 'Passwords do not match.'
    return
  }
  // Burada backend entegrasyonu yapılabilir
  errorMsg.value = ''
  alert('Sign up successful!')
  router.push('/my-pass')
}
</script>

<style scoped>
.signup-outer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8f9fa;
}
.signup-box {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.10);
  padding: 48px 32px 40px 32px;
  min-width: 320px;
  max-width: 360px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.signup-box h2 {
  color: #FC6421;
  margin-bottom: 32px;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}
.signup-box form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.signup-box input {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #eee;
  font-size: 1rem;
  margin-bottom: 0;
  background: #fafafa;
}
.signup-box .btn-primary {
  width: 100%;
  margin-top: 8px;
  font-size: 1.1rem;
  padding: 12px 0;
}
.error {
  color: #fc6421;
  margin-top: 16px;
  text-align: center;
  font-size: 1rem;
}
</style> 