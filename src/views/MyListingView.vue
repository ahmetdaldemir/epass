<template>
  <div class="my-listing-panel">
    <div v-if="!loggedIn" class="login-outer">
      <div class="login-box">
        <h2>Operator Login</h2>
        <form @submit.prevent="login">
          <input v-model="email" type="email" placeholder="E-mail" required />
          <input v-model="password" type="password" placeholder="Password" required />
          <button class="btn btn-primary" type="submit">Login</button>
        </form>
        <div v-if="loginError" class="error">{{ loginError }}</div>
      </div>
    </div>
    <div v-else class="dashboard-flex">
      <!-- Sol Menü -->
      <aside class="side-menu">
        <div class="menu-title">My Panel</div>
        <ul>
          <li :class="{active: activeTab==='listing'}" @click="activeTab='listing'">My Listing</li>
          <li :class="{active: activeTab==='reservation'}" @click="activeTab='reservation'">My Reservation</li>
          <li :class="{active: activeTab==='earning'}" @click="activeTab='earning'">Earning</li>
        </ul>
        <button class="btn btn-secondary logout-btn" @click="logout">Logout</button>
      </aside>
      <!-- Sağ İçerik -->
      <main class="main-content">
        <!-- My Listing -->
        <section v-if="activeTab==='listing'">
          <div class="section-header">
            <h2>My Tours</h2>
            <button class="btn btn-primary" @click="showAddTour=true">Add Listing</button>
          </div>
          <div class="tour-list">
            <div class="tour-card" v-for="tour in tours" :key="tour.id">
              <div>
                <h3>{{ tour.name }}</h3>
                <p>{{ tour.date }}</p>
                <p>Status: <span :class="tour.status">{{ tour.status }}</span></p>
              </div>
              <div class="tour-actions">
                <button class="btn btn-secondary" @click="editTour(tour)">Edit</button>
                <button class="btn btn-danger" @click="deleteTour(tour)">Delete</button>
              </div>
            </div>
          </div>
        </section>
        <!-- My Reservation -->
        <section v-if="activeTab==='reservation'">
          <h2>Reservations</h2>
          <div class="reservation-list">
            <div class="reservation-card" v-for="res in reservations" :key="res.id">
              <div>
                <h4>{{ res.customer }}</h4>
                <p>{{ res.tourName }} - {{ res.date }}</p>
                <p>Status: <span :class="res.status">{{ res.status }}</span></p>
              </div>
            </div>
          </div>
        </section>
        <!-- Earning -->
        <section v-if="activeTab==='earning'">
          <h2>Earnings</h2>
          <div class="earnings-box">
            <p>Total Earnings: <b>€{{ earnings }}</b></p>
          </div>
        </section>
      </main>
      <!-- Add Listing Modal -->
      <div v-if="showAddTour" class="modal-overlay">
        <div class="modal-content">
          <span class="close-btn" @click="showAddTour=false">&times;</span>
          <h2>Add New Tour</h2>
          <form @submit.prevent="addTourSubmit" class="add-tour-form">
            <input v-model="newTour.name" type="text" placeholder="Tour Name" required />
            <input v-model="newTour.date" type="date" required />
            <select v-model="newTour.status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button class="btn btn-primary" type="submit">Add Tour</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loggedIn = ref(false)
const email = ref('')
const password = ref('')
const loginError = ref('')
const activeTab = ref('listing')
const showAddTour = ref(false)
const tours = ref([
  { id: 1, name: 'Bosphorus Cruise', date: '2024-07-10', status: 'active' },
  { id: 2, name: 'Old City Tour', date: '2024-07-12', status: 'inactive' }
])
const reservations = ref([
  { id: 1, customer: 'Jane Doe', tourName: 'Bosphorus Cruise', date: '2024-07-10', status: 'confirmed' },
  { id: 2, customer: 'John Smith', tourName: 'Old City Tour', date: '2024-07-12', status: 'pending' }
])
const earnings = ref(1240)
const newTour = ref({ name: '', date: '', status: 'active' })

function login() {
  if (email.value === 'operator@test.com' && password.value === '1234') {
    loggedIn.value = true
    loginError.value = ''
  } else {
    loginError.value = 'Invalid credentials'
  }
}
function logout() { loggedIn.value = false }
function editTour(tour) { alert('Edit tour: ' + tour.id) }
function deleteTour(tour) { tours.value = tours.value.filter(t => t.id !== tour.id) }
function addTourSubmit() {
  const id = Date.now()
  tours.value.push({ id, ...newTour.value })
  newTour.value = { name: '', date: '', status: 'active' }
  showAddTour.value = false
}
</script>

<style scoped>
.my-listing-panel { min-height: 100vh; background: #f8f9fa; }
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
  color: #e6004c;
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
  color: #e74c3c;
  margin-top: 16px;
  text-align: center;
  font-size: 1rem;
}
@media (max-width: 500px) {
  .login-box {
    min-width: 0;
    max-width: 100vw;
    padding: 32px 8px 24px 8px;
  }
}
.dashboard-flex { display: flex; max-width: 1100px; margin: 40px auto; background: #fff; border-radius: 16px; box-shadow: 0 2px 16px #0001; }
.side-menu { width: 220px; background: #f7f7f7; border-radius: 16px 0 0 16px; padding: 32px 0 0 0; display: flex; flex-direction: column; align-items: stretch; }
.menu-title { font-size: 1.3rem; font-weight: 700; color: #e6004c; text-align: center; margin-bottom: 2rem; }
.side-menu ul { list-style: none; padding: 0; margin: 0; }
.side-menu li { padding: 16px 32px; cursor: pointer; color: #222; font-size: 1.1rem; border-left: 4px solid transparent; transition: background 0.2s, border-color 0.2s; }
.side-menu li.active, .side-menu li:hover { background: #fff; border-left: 4px solid #e6004c; color: #e6004c; }
.logout-btn { margin: 32px 32px 0 32px; }
.main-content { flex: 1; padding: 40px 48px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.tour-list, .reservation-list { margin: 24px 0; }
.tour-card, .reservation-card { display: flex; justify-content: space-between; align-items: center; background: #f7f7f7; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
.tour-actions button { margin-left: 8px; }
.tour-card .active, .reservation-card .confirmed { color: #27ae60; }
.tour-card .inactive, .reservation-card .pending { color: #e67e22; }
.earnings-box { background: #f7f7f7; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 1.2rem; }
/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: #fff; border-radius: 12px; padding: 32px 24px; min-width: 320px; max-width: 400px; position: relative; }
.close-btn { position: absolute; top: 16px; right: 20px; font-size: 1.5rem; cursor: pointer; color: #e6004c; }
.add-tour-form input, .add-tour-form select { width: 100%; margin-bottom: 14px; padding: 10px; border-radius: 8px; border: 1px solid #eee; }
.add-tour-form button { width: 100%; }
@media (max-width: 900px) {
  .dashboard-flex { flex-direction: column; box-shadow: none; border-radius: 0; }
  .side-menu { width: 100%; border-radius: 0; flex-direction: row; padding: 0; }
  .side-menu ul { display: flex; flex-direction: row; }
  .side-menu li { flex: 1; text-align: center; border-left: none; border-bottom: 4px solid transparent; }
  .side-menu li.active, .side-menu li:hover { border-left: none; border-bottom: 4px solid #e6004c; }
  .main-content { padding: 24px 8px; }
}
</style> 