<template>
  <div class="become-partner-page">
    <h1 class="form-title">SearchYourTour - Dünyayı Keşfet, Maceranı Seç</h1>
    <form class="partner-form" @submit.prevent="submitForm">
      <!-- Firma Bilgileri -->
      <section class="form-section">
        <h2>Firma Bilgileri</h2>
        <div class="form-row">
          <input v-model="form.username" type="text" placeholder="Kullanıcı Adı *" required />
          <input v-model="form.companyName" type="text" placeholder="Firma Adı *" required />
        </div>
        <div class="form-row">
          <input v-model="form.email" type="email" placeholder="E-posta *" required />
          <div class="phone-group">
            <select v-model="form.countryCode">
              <option value="+90">🇹🇷 +90</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <!-- Diğer ülke kodları eklenebilir -->
            </select>
            <input v-model="form.phone" type="tel" placeholder="Telefon *" required />
          </div>
        </div>
        <div class="form-row">
          <select v-model="form.country" required>
            <option value="">Ülke Seçiniz *</option>
            <option value="Türkiye">Türkiye</option>
            <option value="ABD">ABD</option>
            <option value="Almanya">Almanya</option>
            <!-- Diğer ülkeler eklenebilir -->
          </select>
          <select v-model="form.city" required>
            <option value="">Şehir Seçiniz *</option>
            <option value="İstanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="İzmir">İzmir</option>
            <!-- Diğer şehirler eklenebilir -->
          </select>
        </div>
        <div class="form-row">
          <input v-model="form.address" type="text" placeholder="Adres *" required />
        </div>
        <div class="form-row">
          <input v-model="form.foundationDate" type="text" placeholder="Kuruluş Tarihi (gg.aa.yyyy) *" required />
          <input v-model="form.employeeCount" type="number" min="1" placeholder="Çalışan Sayısı *" required />
        </div>
        <div class="form-row">
          <input v-model="form.monthlyRevenue" type="text" placeholder="Aylık Ciro *" required />
          <input v-model="form.website" type="url" placeholder="Website" />
        </div>
        <div class="form-row">
          <input v-model="form.taxOffice" type="text" placeholder="Vergi Dairesi *" required />
          <input v-model="form.taxNumber" type="text" placeholder="Vergi Numarası *" required />
        </div>
        <div class="form-row">
          <input v-model="form.iban" type="text" placeholder="IBAN *" required />
          <input v-model="form.accountHolder" type="text" placeholder="İsim Soyisim *" required />
          <input v-model="form.bank" type="text" placeholder="Banka *" required />
        </div>
        <div class="form-row">
          <input v-model="form.swiftCode" type="text" placeholder="Swift Kodu" />
          <input v-model="form.accountNumber" type="text" placeholder="Hesap Numarası" />
        </div>
        <div class="form-row">
          <select v-model="form.serviceArea" required>
            <option value="">Hizmet Alanı Seçiniz *</option>
            <option value="Tur">Tur</option>
            <option value="Transfer">Transfer</option>
            <option value="Otel">Otel</option>
            <!-- Diğer hizmetler eklenebilir -->
          </select>
        </div>
        <div class="form-row">
          <select v-model="form.language" required>
            <option value="">Dil Seçiniz *</option>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
          <select v-model="form.heardFrom" required>
            <option value="">Bizi Nereden Duydunuz? *</option>
            <option value="Google">Google</option>
            <option value="Sosyal Medya">Sosyal Medya</option>
            <option value="Referans">Referans</option>
          </select>
        </div>
        <!-- Dosya Yükleme Alanları -->
        <div class="form-row file-upload-row">
          <label>Vergi Levhası *</label>
          <input type="file" @change="onFileChange($event, 'taxDocument')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" required />
        </div>
        <div class="form-row file-upload-row">
          <label>TÜRSAB Belgesi</label>
          <input type="file" @change="onFileChange($event, 'tursabDocument')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" />
        </div>
        <div class="form-row file-upload-row">
          <label>İş / Uzmanlık Belgesi</label>
          <input type="file" @change="onFileChange($event, 'expertiseDocument')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" />
        </div>
        <div class="form-row file-upload-row">
          <label>Diğer Belgeler</label>
          <input type="file" @change="onFileChange($event, 'otherDocuments')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" multiple />
        </div>
      </section>
      <!-- Yönetici Bilgileri -->
      <section class="form-section">
        <h2>Yönetici</h2>
        <div class="form-row">
          <select v-model="form.managerGender" required>
            <option value="">Cinsiyet Seçiniz *</option>
            <option value="Erkek">Erkek</option>
            <option value="Kadın">Kadın</option>
            <option value="Diğer">Diğer</option>
          </select>
          <input v-model="form.managerTitle" type="text" placeholder="Ünvan *" required />
        </div>
        <div class="form-row">
          <input v-model="form.managerName" type="text" placeholder="Ad *" required />
          <input v-model="form.managerSurname" type="text" placeholder="Soyad *" required />
        </div>
        <div class="form-row">
          <input v-model="form.managerPhone" type="tel" placeholder="Telefon Numaranız *" required />
          <input v-model="form.managerBirthDate" type="text" placeholder="Doğum Tarihi (gg.aa.yyyy) *" required />
        </div>
      </section>
      <!-- Şifre Alanı -->
      <section class="form-section">
        <h2>Şifre</h2>
        <div class="form-row">
          <input v-model="form.password" type="password" placeholder="Şifreniz *" required minlength="6" />
          <input v-model="form.passwordRepeat" type="password" placeholder="Şifre Tekrar *" required minlength="6" />
        </div>
      </section>
      <!-- Sözleşmeler -->
      <section class="form-section">
        <h2>Sözleşmeler</h2>
        <div class="form-row agreements">
          <label><input type="checkbox" v-model="form.agreeCookies" required /> SearchYourTour Çerez Politikasını okudum ve kabul ediyorum.</label>
          <label><input type="checkbox" v-model="form.agreeContract" required /> SearchYourTour E-Ticaret Aracılık Sözleşmesini okudum ve kabul ediyorum.</label>
        </div>
      </section>
      <button class="submit-btn" type="submit">Başvuruyu Tamamla</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  username: '',
  companyName: '',
  email: '',
  countryCode: '+90',
  phone: '',
  country: '',
  city: '',
  address: '',
  foundationDate: '',
  employeeCount: '',
  monthlyRevenue: '',
  website: '',
  taxOffice: '',
  taxNumber: '',
  iban: '',
  accountHolder: '',
  bank: '',
  swiftCode: '',
  accountNumber: '',
  serviceArea: '',
  language: '',
  heardFrom: '',
  taxDocument: null,
  tursabDocument: null,
  expertiseDocument: null,
  otherDocuments: [],
  managerGender: '',
  managerTitle: '',
  managerName: '',
  managerSurname: '',
  managerPhone: '',
  managerBirthDate: '',
  password: '',
  passwordRepeat: '',
  agreeCookies: false,
  agreeContract: false
})

function onFileChange(event, key) {
  if (key === 'otherDocuments') {
    form[key] = Array.from(event.target.files)
  } else {
    form[key] = event.target.files[0]
  }
}

function submitForm() {
  // Şimdilik sadece validasyon ve console.log
  if (form.password !== form.passwordRepeat) {
    alert('Şifreler eşleşmiyor!')
    return
  }
  alert('Başvurunuz alınmıştır!')
  console.log('Form:', JSON.parse(JSON.stringify(form)))
}
</script>

<style scoped>
.become-partner-page {
  max-width: 900px;
  margin: 40px auto;
  background: #181a20;
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  padding: 32px 24px;
}
.form-title {
  text-align: center;
  margin-bottom: 32px;
  font-size: 2rem;
  font-weight: 700;
}
.partner-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.form-section {
  background: #23262f;
  border-radius: 8px;
  padding: 24px 16px;
  margin-bottom: 8px;
}
.form-section h2 {
  font-size: 1.2rem;
  margin-bottom: 16px;
  color: #f39c12;
}
.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.form-row input,
.form-row select {
  flex: 1;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #444;
  background: #23262f;
  color: #fff;
  font-size: 1rem;
}
.form-row input[type="file"] {
  background: #23262f;
  color: #fff;
  border: none;
}
.file-upload-row label {
  min-width: 160px;
  font-size: 0.95rem;
  color: #bbb;
}
.phone-group {
  display: flex;
  gap: 8px;
  align-items: center;
}
.agreements {
  flex-direction: column;
  gap: 8px;
}
.submit-btn {
  width: 100%;
  padding: 14px;
  background: #f39c12;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  transition: background 0.2s;
}
.submit-btn:hover {
  background: #e67e22;
}
@media (max-width: 700px) {
  .become-partner-page {
    padding: 8px 2px;
  }
  .form-section {
    padding: 12px 4px;
  }
  .form-row {
    flex-direction: column;
    gap: 8px;
  }
}
</style> 