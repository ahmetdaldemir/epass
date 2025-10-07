<template>
  <div class="my-pass-panel">
    <div class="container">
      <Breadcrumb />
    </div>
    
    <div v-if="!loggedIn" class="login-outer">
      <div class="login-box">
        <h2>{{ $t('myPass.login.title') }}</h2>
        <form @submit.prevent="login">
          <input v-model="email" type="email" :placeholder="$t('myPass.login.email')" required />
          <input v-model="password" type="password" :placeholder="$t('myPass.login.password')" required />
          <div class="forgot-password">
            <a href="#" @click.prevent="showForgotPassword = true">{{ $t('myPass.login.forgotPassword') }}</a>
          </div>
          <button class="btn btn-primary login-btn" type="submit">{{ $t('myPass.login.loginBtn') }}</button>
          <button class="btn btn-secondary signup-btn" type="button" style="margin-top: 10px;" @click="$router.push('/signup')">{{ $t('myPass.login.signupBtn') }}</button>
        </form>
        <div v-if="loginError" class="error">{{ loginError }}</div>
      </div>
      
      <!-- Forgot Password Modal -->
      <div v-if="showForgotPassword" class="modal-overlay" @click="showForgotPassword = false">
        <div class="modal-content" @click.stop>
                     <div class="modal-header">
             <h3>{{ $t('myPass.resetPassword.title') }}</h3>
             <button class="close-btn" @click="showForgotPassword = false">&times;</button>
           </div>
           <form @submit.prevent="sendResetLink" class="reset-form">
             <div class="form-group">
               <label>{{ $t('myPass.resetPassword.email') }}</label>
               <input v-model="resetEmail" type="email" :placeholder="$t('myPass.resetPassword.emailPlaceholder')" required />
             </div>
             <button class="btn btn-primary" type="submit" :disabled="resetLoading">
               {{ resetLoading ? $t('myPass.resetPassword.sending') : $t('myPass.resetPassword.sendBtn') }}
             </button>
            <div v-if="resetMessage" :class="['message', resetSuccess ? 'success' : 'error']">
              {{ resetMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-else class="dashboard-container">
      <!-- Sol Menü -->
      <aside class="side-menu">
        <div class="user-profile">
          <div class="user-avatar">
            <span>{{ getUserInitials() }}</span>
          </div>
                     <div class="user-info">
             <h3>{{ getUserName() }}</h3>
             <p>{{ $t('myPass.dashboard.account') }}</p>
           </div>
        </div>
        <nav class="nav-menu">
          <div class="nav-item" :class="{active: activeTab==='reservations'}" @click="activeTab='reservations'">
            <i class="nav-icon">📋</i>
            <span>{{ $t('myPass.dashboard.myReservations') }}</span>
          </div>
          <div class="nav-item" :class="{active: activeTab==='info'}" @click="activeTab='info'">
            <i class="nav-icon">👤</i>
            <span>{{ $t('myPass.dashboard.profile') }}</span>
          </div>
          <div class="nav-item" :class="{active: activeTab==='password'}" @click="activeTab='password'">
            <i class="nav-icon">🔒</i>
            <span>{{ $t('myPass.dashboard.changePassword') }}</span>
          </div>
        </nav>
                 <button class="logout-btn" @click="logout">
           <i class="logout-icon">🚪</i>
           {{ $t('myPass.dashboard.logout') }}
         </button>
      </aside>
      
      <!-- Sağ İçerik -->
      <main class="main-content">
        <!-- My Reservations -->
                 <section v-if="activeTab==='reservations'" class="content-section">
           <div class="section-header">
             <h2>{{ $t('myPass.reservations.title') }}</h2>
             <p class="section-subtitle">{{ $t('myPass.reservations.subtitle') }}</p>
           </div>
          <div class="reservation-list">
            <div class="reservation-card" v-for="reservation in reservations" :key="reservation.id">
              <div class="reservation-header">
                <h3>{{ reservation.tourName }}</h3>
                <span :class="['status-badge', reservation.payment_status]">{{ formatStatus(reservation.payment_status) }}</span>
              </div>
              <div class="reservation-details">
                <div class="detail-row">
                                     <div class="detail-item">
                     <i class="detail-icon">📅</i>
                     <span class="detail-label">{{ $t('myPass.reservations.date') }}</span>
                     <span class="detail-value">{{ formatDate(reservation.tour_date) }}</span>
                   </div>
                   <div class="detail-item">
                     <i class="detail-icon">⏰</i>
                     <span class="detail-label">{{ $t('myPass.reservations.time') }}</span>
                     <span class="detail-value">{{ reservation.tour_time || $t('myPass.reservations.tbd') }}</span>
                   </div>
                </div>
                <div class="detail-row">
                                     <div class="detail-item">
                     <i class="detail-icon">💰</i>
                     <span class="detail-label">{{ $t('myPass.reservations.total') }}</span>
                     <span class="detail-value price">{{ reservation.total }} {{ reservation.totalCurrency }}</span>
                   </div>
                   <div class="detail-item">
                     <i class="detail-icon">👥</i>
                     <span class="detail-label">{{ $t('myPass.reservations.attendees') }}</span>
                     <span class="detail-value">{{ formatAttendees(reservation) }}</span>
                   </div>
                </div>
              </div>
                             <div class="reservation-actions">
                 <button class="btn btn-edit" @click="editReservation(reservation)">
                   <i class="btn-icon">✏️</i>
                   {{ $t('myPass.reservations.edit') }}
                 </button>
                 <button class="btn btn-cancel" @click="cancelReservation(reservation)" :disabled="!canCancel(reservation.payment_status)">
                   <i class="btn-icon">❌</i>
                   {{ $t('myPass.reservations.cancel') }}
                 </button>
               </div>
            </div>
                         <div v-if="reservations.length === 0" class="empty-state">
               <div class="empty-icon">📋</div>
               <h3>{{ $t('myPass.reservations.emptyState.title') }}</h3>
               <p>{{ $t('myPass.reservations.emptyState.description') }}</p>
               <button class="btn btn-primary" @click="$router.push('/tours')">{{ $t('myPass.reservations.emptyState.browseTours') }}</button>
             </div>
          </div>
        </section>
        
                 <!-- My Info -->
         <section v-if="activeTab==='info'" class="content-section">
           <div class="section-header">
             <h2>{{ $t('myPass.profile.title') }}</h2>
             <p class="section-subtitle">{{ $t('myPass.profile.subtitle') }}</p>
           </div>
          <form @submit.prevent="saveInfo" class="profile-form">
                         <div class="form-section">
               <h3>{{ $t('myPass.profile.personalInfo') }}</h3>
               <div class="form-row">
                 <div class="form-group">
                   <label>{{ $t('myPass.profile.firstName') }}</label>
                   <input v-model="userInfo.firstName" type="text" :placeholder="$t('myPass.profile.firstNamePlaceholder')" required />
                 </div>
                 <div class="form-group">
                   <label>{{ $t('myPass.profile.lastName') }}</label>
                   <input v-model="userInfo.lastName" type="text" :placeholder="$t('myPass.profile.lastNamePlaceholder')" required />
                 </div>
               </div>
             </div>
            
                         <div class="form-section">
               <h3>{{ $t('myPass.profile.contactInfo') }}</h3>
               <div class="form-group">
                 <label>{{ $t('myPass.profile.emailAddress') }}</label>
                 <input v-model="userInfo.email" type="email" :placeholder="$t('myPass.profile.emailPlaceholder')" required disabled />
                 <small class="field-note">{{ $t('myPass.profile.emailNote') }}</small>
               </div>
               <div class="form-group">
                 <label>{{ $t('myPass.profile.mobilePhone') }}</label>
                 <input v-model="userInfo.phone" type="tel" :placeholder="$t('myPass.profile.phonePlaceholder')" />
               </div>
             </div>
            
                         <div class="form-section">
               <h3>{{ $t('myPass.profile.addressInfo') }}</h3>
               <div class="form-group">
                 <label>{{ $t('myPass.profile.address') }}</label>
                 <input v-model="userInfo.address" type="text" :placeholder="$t('myPass.profile.addressPlaceholder')" />
               </div>
               <div class="form-row">
                 <div class="form-group">
                   <label>{{ $t('myPass.profile.city') }}</label>
                   <input v-model="userInfo.city" type="text" :placeholder="$t('myPass.profile.cityPlaceholder')" />
                 </div>
                 <div class="form-group">
                   <label>{{ $t('myPass.profile.country') }}</label>
                   <input v-model="userInfo.country" type="text" :placeholder="$t('myPass.profile.countryPlaceholder')" />
                 </div>
               </div>
               <div class="form-group">
                 <label>{{ $t('myPass.profile.zipCode') }}</label>
                 <input v-model="userInfo.zip_code" type="text" :placeholder="$t('myPass.profile.zipPlaceholder')" />
               </div>
             </div>
            
                         <div class="form-actions">
               <button class="btn btn-primary" type="submit">
                 <i class="btn-icon">💾</i>
                 {{ $t('myPass.profile.saveChanges') }}
               </button>
             </div>
          </form>
        </section>
        
                 <!-- Change Password -->
         <section v-if="activeTab==='password'" class="content-section">
           <div class="section-header">
             <h2>{{ $t('myPass.password.title') }}</h2>
             <p class="section-subtitle">{{ $t('myPass.password.subtitle') }}</p>
           </div>
          <form @submit.prevent="changePassword" class="password-form">
                         <div class="form-group">
               <label>{{ $t('myPass.password.currentPassword') }}</label>
               <input v-model="oldPassword" type="password" :placeholder="$t('myPass.password.currentPasswordPlaceholder')" required />
             </div>
             <div class="form-group">
               <label>{{ $t('myPass.password.newPassword') }}</label>
               <input v-model="newPassword" type="password" :placeholder="$t('myPass.password.newPasswordPlaceholder')" required />
               <small class="field-note">{{ $t('myPass.password.passwordNote') }}</small>
             </div>
             <div class="form-group">
               <label>{{ $t('myPass.password.confirmPassword') }}</label>
               <input v-model="newPasswordRepeat" type="password" :placeholder="$t('myPass.password.confirmPasswordPlaceholder')" required />
             </div>
            
                         <div class="form-actions">
               <button class="btn btn-primary" type="submit">
                 <i class="btn-icon">🔒</i>
                 {{ $t('myPass.password.changePasswordBtn') }}
               </button>
             </div>
            
            <div v-if="passwordMsg" :class="['message', passwordSuccess ? 'success' : 'error']">
              <i :class="passwordSuccess ? '✅' : '❌'"></i>
              {{ passwordMsg }}
            </div>
          </form>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Breadcrumb from '../components/Breadcrumb.vue'

const { t } = useI18n()

const loggedIn = ref(false)
const email = ref('')
const password = ref('')
const loginError = ref('')
const activeTab = ref('reservations')
const reservations = ref([])
const userInfo = ref({ 
  firstName: '', 
  lastName: '', 
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

// Forgot Password
const showForgotPassword = ref(false)
const resetEmail = ref('')
const resetLoading = ref(false)
const resetMessage = ref('')
const resetSuccess = ref(false)

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
    const response = await fetch(`https://backend.searchyourtour.com/api/customer/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    const result = await response.json()
    
    if (result.status) {
      const fullname = result.data.fullname || ''
      const nameParts = fullname.split(' ')
      userInfo.value = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
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
    const response = await fetch(`https://backend.searchyourtour.com/api/customer/reservations/${userId}`, {
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
    
    const response = await fetch('https://backend.searchyourtour.com/api/login', {
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
      
      // Kullanıcı verilerini çek
      try {
        await fetchUserProfile(result.data.id)
        await fetchUserReservations(result.data.id)
      } catch (error) {
        console.error('Error fetching user data after login:', error)
      }
      
      // Form alanlarını temizle
      email.value = ''
      password.value = ''
         } else {
       // Login başarısız
       loginError.value = t('myPass.login.error')
     }
   } catch (error) {
     console.error('Login error:', error)
     loginError.value = t('myPass.login.generalError')
   }
}

function logout() { 
  loggedIn.value = false
  // localStorage'dan kullanıcı bilgilerini temizle
  localStorage.removeItem('user')
  localStorage.removeItem('isLoggedIn')
}

function editReservation(reservation) { 
  alert(t('myPass.messages.reservationEdit') + reservation.id) 
}

function cancelReservation(reservation) { 
  if (confirm(t('myPass.messages.confirmCancel'))) {
    // Backend'e cancel request gönder
    //cancelReservationBackend(reservation.id)
    alert(t('myPass.messages.reservationCancel') + reservation.id)
  }
}

async function saveInfo() {
     try {
     const userData = localStorage.getItem('user')
     if (!userData) {
       alert(t('myPass.messages.userNotFound'))
       return
     }

    const user = JSON.parse(userData)
    
    const response = await fetch(`https://backend.searchyourtour.com/api/customer/profile/update/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        fullname: `${userInfo.value.firstName} ${userInfo.value.lastName}`.trim(),
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
       alert(t('myPass.messages.profileUpdated'))
     } else {
       alert(t('myPass.messages.profileUpdateFailed') + (result.message || t('myPass.messages.unknownError')))
     }
   } catch (error) {
     console.error('Error updating profile:', error)
     alert(t('myPass.messages.generalError'))
   }
}

async function changePassword() {
  try {
    passwordMsg.value = ''
    passwordSuccess.value = false

         // Validation
     if (newPassword.value.length < 6) {
       passwordMsg.value = t('myPass.password.validation.tooShort')
       passwordSuccess.value = false
       return
     }
     if (newPassword.value !== newPasswordRepeat.value) {
       passwordMsg.value = t('myPass.password.validation.noMatch')
       passwordSuccess.value = false
       return
     }

         // Get user data from localStorage
     const userData = localStorage.getItem('user')
     if (!userData) {
       passwordMsg.value = t('myPass.messages.userNotFound')
       passwordSuccess.value = false
       return
     }

    const user = JSON.parse(userData)

    // Send request to backend
    const response = await fetch(`https://backend.searchyourtour.com/api/customer/change-password/${user.id}`, {
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
       passwordMsg.value = t('myPass.password.success')
       passwordSuccess.value = true
       // Clear form
       oldPassword.value = ''
       newPassword.value = ''
       newPasswordRepeat.value = ''
     } else {
       passwordMsg.value = result.message || t('myPass.password.error')
       passwordSuccess.value = false
     }
   } catch (error) {
     console.error('Error changing password:', error)
     passwordMsg.value = t('myPass.password.generalError')
     passwordSuccess.value = false
   }
}

// Backend'e reservation cancel request gönder
async function cancelReservationBackend(reservationId) {
  try {
    const response = await fetch(`https://backend.searchyourtour.com/api/customer/reservations/cancel/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    const result = await response.json()
    
         if (result.status) {
       alert(t('myPass.messages.reservationCancelled'))
       // Reservation listesini yenile
       const userData = localStorage.getItem('user')
       if (userData) {
         const user = JSON.parse(userData)
         await fetchUserReservations(user.id)
       }
     } else {
       alert(t('myPass.messages.reservationCancelFailed') + (result.message || t('myPass.messages.unknownError')))
     }
   } catch (error) {
     console.error('Error cancelling reservation:', error)
     alert(t('myPass.messages.generalError'))
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

// Attendees formatla
function formatAttendees(reservation) {
  const parts = []
  if (reservation.adult > 0) parts.push(`${t('myPass.reservations.adults')}: ${reservation.adult}`)
  if (reservation.child > 0) parts.push(`${t('myPass.reservations.children')}: ${reservation.child}`)
  if (reservation.infant > 0) parts.push(`${t('myPass.reservations.infants')}: ${reservation.infant}`)
  if (reservation.buggy > 0) parts.push(`${t('myPass.reservations.buggy')}: ${reservation.buggy}`)
  return parts.length > 0 ? parts.join(', ') : t('myPass.reservations.noAttendees')
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

// Kullanıcı adının baş harflerini al
function getUserInitials() {
  const firstName = userInfo.value.firstName || ''
  const lastName = userInfo.value.lastName || ''
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U'
}

// Kullanıcı adını al
function getUserName() {
  const firstName = userInfo.value.firstName || ''
  const lastName = userInfo.value.lastName || ''
  return (firstName + ' ' + lastName).trim() || 'User'
}

// Send password reset link
async function sendResetLink() {
  try {
    resetLoading.value = true
    resetMessage.value = ''
    resetSuccess.value = false
    
    const response = await fetch('https://backend.searchyourtour.com/api/customer/password/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        email: resetEmail.value
      })
    })

    const result = await response.json()
    
         if (result.status) {
       resetSuccess.value = true
       resetMessage.value = result.message || t('myPass.resetPassword.success')
       resetEmail.value = ''
       // 3 saniye sonra modal'ı kapat
       setTimeout(() => {
         showForgotPassword.value = false
         resetMessage.value = ''
       }, 3000)
     } else {
       resetSuccess.value = false
       resetMessage.value = result.message || t('myPass.resetPassword.error')
     }
   } catch (error) {
     console.error('Error sending reset link:', error)
     resetSuccess.value = false
     resetMessage.value = t('myPass.messages.generalError')
   } finally {
    resetLoading.value = false
  }
}
</script>

<style scoped>
.my-pass-panel { 
  min-height: 100vh;
  background: #f8f9fa;
}

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

.login-box .login-btn,
.login-box .signup-btn {
  width: 100%;
  margin-top: 8px;
  font-size: 1.1rem;
  padding: 12px 0;
  display: block;
  text-align: center;
  gap: 0;
}

.login-box .error {
  color: #fc6421;
  margin-top: 16px;
  text-align: center;
  font-size: 1rem;
}

.forgot-password {

}

.forgot-password a {
  color: #FC6421;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password a:hover {
  color: #e55a1a;
  text-decoration: underline;
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.reset-form {
  padding: 0 24px 24px;
}

.reset-form .form-group {
  margin-bottom: 20px;
}

.reset-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.reset-form input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.reset-form input:focus {
  outline: none;
  border-color: #FC6421;
  box-shadow: 0 0 0 3px rgba(252, 100, 33, 0.1);
}

.reset-form .btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
}

.reset-form .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-form .message {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.reset-form .message.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.reset-form .message.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Dashboard Layout */
.dashboard-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: #fff;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

/* Side Menu */
.side-menu {
  width: 280px;
  background: linear-gradient(135deg, #ff0000 0%, #ff5e00 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: relative;
}

.user-profile {
  padding: 40px 24px 32px;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
  font-weight: 600;
  color: white;
}

.user-info h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px;
}

.user-info p {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

.nav-menu {
  flex: 1;
  padding: 24px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  margin: 4px 0;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
  border-left-color: #FC6421;
}

.nav-item.active {
  background: rgba(255,255,255,0.15);
  border-left-color: #FC6421;
}

.nav-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 20px;
  text-align: center;
}

.nav-item span {
  font-size: 16px;
  font-weight: 500;
}

.logout-btn {
  margin: 24px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.3);
}

.logout-icon {
  font-size: 16px;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 40px;
  background: #f8f9fa;
  overflow-y: auto;
}

.content-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.section-header {
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px;
}

.section-subtitle {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

/* Reservation Cards */
.reservation-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reservation-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.reservation-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.reservation-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.paid,
.status-badge.approved,
.status-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.status-badge.canceled,
.status-badge.rejected {
  background: #fef2f2;
  color: #dc2626;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.waiting {
  background: #dbeafe;
  color: #2563eb;
}

.reservation-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  gap: 32px;
  margin-bottom: 16px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.detail-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 14px;
  min-width: 60px;
}

.detail-value {
  color: #1f2937;
  font-weight: 500;
}

.detail-value.price {
  color: #FC6421;
  font-weight: 600;
}

.reservation-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: #FC6421;
  color: white;
}

.btn-primary:hover {
  background: #e55a1a;
  transform: translateY(-1px);
}

.btn-edit {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-edit:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.btn-cancel {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-cancel:hover:not(:disabled) {
  background: #fee2e2;
  border-color: #fca5a5;
}

.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 14px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px;
}

.empty-state p {
  font-size: 16px;
  margin: 0 0 24px;
}

/* Forms */
.profile-form,
.password-form {
  max-width: 600px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-group {
  flex: 1;
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
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: #FC6421;
  box-shadow: 0 0 0 3px rgba(252, 100, 33, 0.1);
}

.form-group input:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.field-note {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.form-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.message {
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-container {
    flex-direction: column;
    max-width: 100%;
    margin: 0;
  }
  
  .side-menu {
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 16px 24px;
  }
  
  .user-profile {
    padding: 0;
    border-bottom: none;
    border-right: 1px solid rgba(255,255,255,0.1);
    margin-right: 24px;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    font-size: 16px;
    margin: 0 0 4px;
  }
  
  .user-info h3 {
    font-size: 16px;
  }
  
  .user-info p {
    font-size: 12px;
  }
  
  .nav-menu {
    flex: 1;
    padding: 0;
    display: flex;
    gap: 8px;
  }
  
  .nav-item {
    padding: 8px 12px;
    border-left: none;
    border-bottom: 3px solid transparent;
    margin: 0;
    flex-direction: column;
    text-align: center;
    min-width: 80px;
  }
  
  .nav-item.active,
  .nav-item:hover {
    border-left: none;
    border-bottom-color: #FC6421;
  }
  
  .nav-icon {
    margin-right: 0;
    margin-bottom: 4px;
  }
  
  .nav-item span {
    font-size: 12px;
  }
  
  .logout-btn {
    margin: 0 0 0 16px;
    padding: 8px 12px;
  }
  
  .main-content {
    padding: 24px;
  }
  
  .content-section {
    padding: 24px;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .side-menu {
    flex-direction: column;
    padding: 16px;
  }
  
  .user-profile {
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    margin-right: 0;
    margin-bottom: 16px;
    padding-bottom: 16px;
  }
  
  .nav-menu {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
  }
  
  .nav-item {
    flex: 1;
    min-width: auto;
  }
  
  .logout-btn {
    margin: 16px 0 0 0;
    width: 100%;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .content-section {
    padding: 20px;
  }
  
  .reservation-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .reservation-actions {
    justify-content: flex-start;
  }
  
  .section-header h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .login-box {
    margin: 16px;
    padding: 32px 24px;
  }
  
  .main-content {
    padding: 12px;
  }
  
  .content-section {
    padding: 16px;
  }
  
  .reservation-card {
    padding: 16px;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style> 