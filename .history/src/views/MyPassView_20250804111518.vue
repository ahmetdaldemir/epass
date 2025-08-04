<template>
  <div class="my-pass-panel">
    <div v-if="!loggedIn" class="login-outer">
      <div class="login-box">
        <h2>Customer Login</h2>
        <form @submit.prevent="login">
          <input v-model="email" type="email" placeholder="E-mail" required />
          <input v-model="password" type="password" placeholder="Password" required />
          <button class="btn btn-primary" type="submit">Login</button>
          <button class="btn btn-secondary" type="button" style="margin-top: 10px;" @click="$router.push('/signup')">Sign Up</button>
        </form>
        <div v-if="loginError" class="error">{{ loginError }}</div>
      </div>
    </div>
    <div v-else class="dashboard-flex">
      <!-- Sol Menü -->
      <aside class="side-menu">
        <div class="menu-title">My Account</div>
        <ul>
          <li :class="{active: activeTab==='tickets'}" @click="activeTab='tickets'">My Tickets</li>
          <li :class="{active: activeTab==='info'}" @click="activeTab='info'">My Info</li>
          <li :class="{active: activeTab==='password'}" @click="activeTab='password'">Change Password</li>
        </ul>
        <button class="btn btn-secondary logout-btn" @click="logout">Logout</button>
      </aside>
      <!-- Sağ İçerik -->
      <main class="main-content">
        <!-- My Tickets -->
        <section v-if="activeTab==='tickets'">
          <h2>My Tickets</h2>
          <div class="ticket-list">
            <div class="ticket-card" v-for="ticket in tickets" :key="ticket.id">
              <div>
                <h3>{{ ticket.passType }}</h3>
                <p>Start: {{ ticket.startDate }}</p>
                <p>Status: <span :class="ticket.status">{{ ticket.status }}</span></p>
              </div>
              <div class="ticket-actions">
                <button class="btn btn-secondary" @click="editTicket(ticket)">Edit</button>
                <button class="btn btn-danger" @click="cancelTicket(ticket)" :disabled="ticket.status==='cancelled'">Cancel</button>
              </div>
            </div>
            <div v-if="tickets.length === 0" class="empty-state">No tickets found.</div>
          </div>
        </section>
        <!-- My Info -->
        <section v-if="activeTab==='info'">
          <h2>My Info</h2>
          <form @submit.prevent="saveInfo" class="info-form">
            <input v-model="userInfo.name" type="text" placeholder="Name" required />
            <input v-model="userInfo.email" type="email" placeholder="E-mail" required />
            <button class="btn btn-primary" type="submit">Save</button>
          </form>
        </section>
        <!-- Change Password -->
        <section v-if="activeTab==='password'">
          <h2>Change Password</h2>
          <form @submit.prevent="changePassword" class="info-form">
            <input v-model="oldPassword" type="password" placeholder="Current Password" required />
            <input v-model="newPassword" type="password" placeholder="New Password" required />
            <input v-model="newPasswordRepeat" type="password" placeholder="Repeat New Password" required />
            <button class="btn btn-primary" type="submit">Change Password</button>
            <div v-if="passwordMsg" :class="passwordSuccess ? 'success' : 'error'">{{ passwordMsg }}</div>
          </form>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loggedIn = ref(false)
const email = ref('')
const password = ref('')
const loginError = ref('')
const activeTab = ref('tickets')
const tickets = ref([
  { id: 1, passType: '1 Day Pass', startDate: '2024-07-01', status: 'active' },
  { id: 2, passType: '3 Day Pass', startDate: '2024-06-15', status: 'cancelled' }
])
const userInfo = ref({ name: 'John Doe', email: 'john@example.com' })
const oldPassword = ref('')
const newPassword = ref('')
const newPasswordRepeat = ref('')
const passwordMsg = ref('')
const passwordSuccess = ref(false)

// Sayfa yüklendiğinde kullanıcının login durumunu kontrol et
onMounted(() => {
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  const userData = localStorage.getItem('user')
  
  if (isLoggedIn === 'true' && userData) {
    loggedIn.value = true
    try {
      const user = JSON.parse(userData)
      userInfo.value = {
        name: user.name || 'User',
        email: user.email || ''
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }
})

async function login() {
  try {
    loginError.value = ''
    
    const response = await fetch('/api/customer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const result = await response.json()
    
    if (result.status) {
      // Login başarılı
      loggedIn.value = true
      loginError.value = ''
      
      // Kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(result.data))
      localStorage.setItem('isLoggedIn', 'true')
      
      // Form alanlarını temizle
      email.value = ''
      password.value = ''
    } else {
      // Login başarısız
      loginError.value = 'Invalid email or password'
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = 'An error occurred during login. Please try again.'
  }
}
function logout() { 
  loggedIn.value = false
  // localStorage'dan kullanıcı bilgilerini temizle
  localStorage.removeItem('user')
  localStorage.removeItem('isLoggedIn')
}
function editTicket(ticket) { alert('Edit ticket: ' + ticket.id) }
function cancelTicket(ticket) { ticket.status = 'cancelled' }
function saveInfo() { alert('Info saved!') }
function changePassword() {
  if (oldPassword.value !== '1234') {
    passwordMsg.value = 'Current password is incorrect.'
    passwordSuccess.value = false
    return
  }
  if (newPassword.value.length < 6) {
    passwordMsg.value = 'New password must be at least 6 characters.'
    passwordSuccess.value = false
    return
  }
  if (newPassword.value !== newPasswordRepeat.value) {
    passwordMsg.value = 'New passwords do not match.'
    passwordSuccess.value = false
    return
  }
  passwordMsg.value = 'Password changed successfully!'
  passwordSuccess.value = true
  oldPassword.value = ''
  newPassword.value = ''
  newPasswordRepeat.value = ''
}
</script>

<style scoped>
.my-pass-panel { min-height: 100vh; background: #f8f9fa; }
.login-outer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8f9fa;
}
.login-box {
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
.login-box h2 {
  color: #FC6421;
  margin-bottom: 32px;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}
.login-box form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.login-box input {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #eee;
  font-size: 1rem;
  margin-bottom: 0;
  background: #fafafa;
}
.login-box .btn-primary {
  width: 100%;
  margin-top: 8px;
  font-size: 1.1rem;
  padding: 12px 0;
}
.login-box .error {
  color: #fc6421;
  margin-top: 16px;
  text-align: center;
  font-size: 1rem;
}
.dashboard-flex { display: flex; max-width: 900px; margin: 40px auto; background: #fff; border-radius: 16px; box-shadow: 0 2px 16px #0001; }
.side-menu { width: 200px; background: #f7f7f7; border-radius: 16px 0 0 16px; padding: 32px 0 0 0; display: flex; flex-direction: column; align-items: stretch; }
.menu-title { font-size: 1.2rem; font-weight: 700; color: #e6004c; text-align: center; margin-bottom: 2rem; }
.side-menu ul { list-style: none; padding: 0; margin: 0; }
.side-menu li { padding: 14px 28px; cursor: pointer; color: #222; font-size: 1.05rem; border-left: 4px solid transparent; transition: background 0.2s, border-color 0.2s; }
.side-menu li.active, .side-menu li:hover { background: #fff; border-left: 4px solid #e6004c; color: #e6004c; }
.logout-btn { margin: 32px 28px 0 28px; }
.main-content { flex: 1; padding: 40px 32px; }
.ticket-list { margin: 24px 0; }
.ticket-card { display: flex; justify-content: space-between; align-items: center; background: #f7f7f7; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
.ticket-actions button { margin-left: 8px; }
.ticket-card .active { color: #27ae60; }
.ticket-card .cancelled { color: #fc6421; }
.empty-state { color: #888; text-align: center; margin: 32px 0; font-size: 1.1rem; }
.info-form { max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
.info-form input { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #eee; font-size: 1rem; background: #fafafa; }
.info-form button { width: 100%; }
.success { color: #27ae60; margin-top: 8px; }
.error { color: #fc6421; margin-top: 8px; }
@media (max-width: 900px) {
  .dashboard-flex { flex-direction: column; box-shadow: none; border-radius: 0; max-width: 100vw; margin: 0; }
  .side-menu { width: 100%; border-radius: 0; flex-direction: row; padding: 0; }
  .side-menu ul { display: flex; flex-direction: row; width: 100%; }
  .side-menu li { flex: 1; text-align: center; border-left: none; border-bottom: 4px solid transparent; padding: 14px 0; font-size: 1.1rem; }
  .side-menu li.active, .side-menu li:hover { border-left: none; border-bottom: 4px solid #e6004c; }
  .logout-btn { margin: 16px 8px 0 8px; width: 100%; }
  .main-content { padding: 18px 4px; }
  .ticket-card, .info-form { max-width: 100vw; }
  .ticket-card { flex-direction: column; align-items: flex-start; gap: 8px; padding: 14px; }
  .ticket-actions { width: 100%; display: flex; gap: 8px; }
  .info-form input, .info-form button { font-size: 1.05rem; padding: 14px; }
}
@media (max-width: 500px) {
  .login-box {
    min-width: 0;
    max-width: 100vw;
    padding: 32px 8px 24px 8px;
  }
  .main-content { padding: 8px 2px; }
  .ticket-card { padding: 10px; }
  .info-form { padding: 0 2px; }
}
</style> 