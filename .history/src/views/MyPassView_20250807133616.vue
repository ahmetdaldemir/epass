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
           <li :class="{active: activeTab==='reservations'}" @click="activeTab='reservations'">My Reservations</li>
           <li :class="{active: activeTab==='info'}" @click="activeTab='info'">My Info</li>
           <li :class="{active: activeTab==='password'}" @click="activeTab='password'">Change Password</li>
         </ul>
        <button class="btn btn-secondary logout-btn" @click="logout">Logout</button>
      </aside>
      <!-- Sağ İçerik -->
      <main class="main-content">
                 <!-- My Reservations -->
         <section v-if="activeTab==='reservations'">
           <h2>My Reservations</h2>
           <div class="reservation-list">
                           <div class="reservation-card" v-for="reservation in reservations" :key="reservation.id">
                <div class="reservation-info">
                  <h3>{{ reservation.tourName }}</h3>
                  <p><strong>Date:</strong> {{ formatDate(reservation.tour_date) }}</p>
                  <p><strong>Time:</strong> {{ reservation.tour_time }}</p>
                  <p><strong>Total:</strong> {{ reservation.total }} {{ reservation.totalCurrency }}</p>
                  <p><strong>Status:</strong> <span :class="reservation.payment_status">{{ formatStatus(reservation.payment_status) }}</span></p>
                  <p><strong>Adults:</strong> {{ reservation.adult }}, <strong>Children:</strong> {{ reservation.child }}, <strong>Infants:</strong> {{ reservation.infant }}, <strong>Buggy:</strong> {{ reservation.buggy }}</p>
                </div>
               <div class="reservation-actions">
                 <button class="btn btn-secondary" @click="editReservation(reservation)">Edit</button>
                                   <button class="btn btn-danger" @click="cancelReservation(reservation)" :disabled="!canCancel(reservation.payment_status)">Cancel</button>
               </div>
             </div>
             <div v-if="reservations.length === 0" class="empty-state">No reservations found.</div>
           </div>
         </section>
                 <!-- My Info -->
         <section v-if="activeTab==='info'">
           <h2>My Info</h2>
           <form @submit.prevent="saveInfo" class="info-form">
             <input v-model="userInfo.fullname" type="text" placeholder="Full Name" required />
             <input v-model="userInfo.email" type="email" placeholder="E-mail" required />
             <input v-model="userInfo.phone" type="tel" placeholder="Phone Number" />
             <input v-model="userInfo.address" type="text" placeholder="Address" />
             <input v-model="userInfo.city" type="text" placeholder="City" />
             <input v-model="userInfo.country" type="text" placeholder="Country" />
             <input v-model="userInfo.zip_code" type="text" placeholder="ZIP Code" />
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
const activeTab = ref('reservations')
const reservations = ref([])
const userInfo = ref({ 
  fullname: '', 
  email: '', 
  phone: '', 
  address: '', 
  city: '', 
  country: '', 
  zip_code: '' 
})
const oldPassword = ref('')
const newPassword = ref('')
const newPasswordRepeat = ref('')
const passwordMsg = ref('')
const passwordSuccess = ref(false)

// Sayfa yüklendiğinde kullanıcının login durumunu kontrol et
onMounted(async () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  const userData = localStorage.getItem('user')
  
  if (isLoggedIn === 'true' && userData) {
    loggedIn.value = true
    try {
      const user = JSON.parse(userData)
      // Kullanıcı bilgilerini database'den çek
      await fetchUserProfile(user.id)
      // Kullanıcının reservation'larını çek
      await fetchUserReservations(user.id)
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }
})

// Kullanıcı profil bilgilerini database'den çek
async function fetchUserProfile(userId) {
  try {
    const response = await fetch(`https://searchyourtour.com/api/customer/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    const result = await response.json()
    
    if (result.status) {
      userInfo.value = {
        fullname: result.data.fullname || '',
        email: result.data.email || '',
        phone: result.data.phone || '',
        address: result.data.address || '',
        city: result.data.city || '',
        country: result.data.country || '',
        zip_code: result.data.zip_code || ''
      }
    } else {
      console.error('Failed to fetch user profile:', result.message)
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

// Kullanıcının reservation'larını database'den çek
async function fetchUserReservations(userId) {
  try {
    const response = await fetch(`https://searchyourtour.com/api/customer/reservations/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    const result = await response.json()
    
    if (result.status) {
      reservations.value = result.data || []
    } else {
      console.error('Failed to fetch user reservations:', result.message)
    }
  } catch (error) {
    console.error('Error fetching user reservations:', error)
  }
}

async function login() {
  try {
    loginError.value = ''
    
    const response = await fetch('https://searchyourtour.com/api/login', {
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
function editReservation(reservation) { alert('Edit reservation: ' + reservation.id) }
function cancelReservation(reservation) { 
  if (confirm('Are you sure you want to cancel this reservation?')) {
    // Backend'e cancel request gönder
    cancelReservationBackend(reservation.id)
  }
}
async function saveInfo() {
  try {
    const userData = localStorage.getItem('user')
    if (!userData) {
      alert('User not found. Please login again.')
      return
    }

    const user = JSON.parse(userData)
    
    const response = await fetch(`https://searchyourtour.com/api/customer/profile/update/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        fullname: userInfo.value.fullname,
        email: userInfo.value.email,
        phone: userInfo.value.phone,
        address: userInfo.value.address,
        city: userInfo.value.city,
        country: userInfo.value.country,
        zip_code: userInfo.value.zip_code
      })
    })

    const result = await response.json()
    
    if (result.status) {
      alert('Profile updated successfully!')
    } else {
      alert('Failed to update profile: ' + (result.message || 'Unknown error'))
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('An error occurred while updating profile. Please try again.')
  }
}
async function changePassword() {
  try {
    passwordMsg.value = ''
    passwordSuccess.value = false

    // Validation
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

    // Get user data from localStorage
    const userData = localStorage.getItem('user')
    if (!userData) {
      passwordMsg.value = 'User not found. Please login again.'
      passwordSuccess.value = false
      return
    }

    const user = JSON.parse(userData)

    // Send request to backend
    const response = await fetch(`https://searchyourtour.com/api/customer/change-password/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        current_password: oldPassword.value,
        new_password: newPassword.value,
        new_password_confirmation: newPasswordRepeat.value
      })
    })

    const result = await response.json()
    
    if (result.status) {
      passwordMsg.value = 'Password changed successfully!'
      passwordSuccess.value = true
      // Clear form
      oldPassword.value = ''
      newPassword.value = ''
      newPasswordRepeat.value = ''
    } else {
      passwordMsg.value = result.message || 'Failed to change password'
      passwordSuccess.value = false
    }
  } catch (error) {
    console.error('Error changing password:', error)
    passwordMsg.value = 'An error occurred while changing password. Please try again.'
    passwordSuccess.value = false
  }
}

// Backend'e reservation cancel request gönder
async function cancelReservationBackend(reservationId) {
  try {
    const response = await fetch(`https://searchyourtour.com/api/customer/reservations/cancel/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    const result = await response.json()
    
    if (result.status) {
      alert('Reservation cancelled successfully!')
      // Reservation listesini yenile
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        await fetchUserReservations(user.id)
      }
    } else {
      alert('Failed to cancel reservation: ' + (result.message || 'Unknown error'))
    }
  } catch (error) {
    console.error('Error cancelling reservation:', error)
    alert('An error occurred while cancelling reservation. Please try again.')
  }
}

// Tarih formatla
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Status formatla (sadece capitalize yapıyor)
function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// Cancel edilebilir mi kontrol et
function canCancel(status) {
  console.log('Checking cancel for status:', status) // Debug için
  
  // Geçici olarak tüm status'ları kabul et (test için)
  if (!status) {
    console.log('Status is null/undefined, allowing cancel')
    return true
  }
  
  // Tüm status'ları kabul et (test için)
  const cancelableStatuses = ['pending', 'waiting', 'approved', 'paid', 'Pending', 'Waiting', 'Approved', 'Paid']
  const canCancelResult = cancelableStatuses.includes(status)
  console.log('Can cancel:', canCancelResult) // Debug için
  return canCancelResult
}
</script>

<style scoped>
.my-pass-panel { min-height: 100vh;}
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
.reservation-list { margin: 24px 0; }
.reservation-card { display: flex; justify-content: space-between; align-items: flex-start; background: #f7f7f7; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
.reservation-info { flex: 1; }
.reservation-actions { margin-left: 16px; }
.reservation-actions button { margin-left: 8px; }
.reservation-card .paid { color: #27ae60; }
.reservation-card .approved { color: #27ae60; }
.reservation-card .completed { color: #27ae60; }
.reservation-card .canceled { color: #fc6421; }
.reservation-card .rejected { color: #fc6421; }
.reservation-card .pending { color: #f39c12; }
.reservation-card .waiting { color: #3498db; }
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