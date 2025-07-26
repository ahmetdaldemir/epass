<template>
  <div class="become-partner-page">
    
    <form class="partner-form" @submit.prevent="submitForm">
      <!-- Logo Alanı -->
      <section class="form-section">
        <div class="form-row logo-upload-row">
          <div class="logo-label">
            <span class="text-sm self-center font-medium">Logo</span>
          </div>
          <div class="logo-upload-content">
            <span class="text-sm text-gray-400 self-center">150×150px JPEG, PNG Image</span>
            <div class="logo-upload-box">
              <div class="logo-upload-preview" v-if="logoPreview">
                <img :src="logoPreview" alt="Logo Preview" style="max-width:100px;max-height:100px;border-radius:8px;" />
              </div>
              <div v-else class="logo-upload-placeholder">
                <i class="fas fa-image" style="font-size:24px;color:#bbb;"></i>
                <div class="text-xs text-center">
                  <div>SVG,PNG, JPG</div>
                  <div>(max. 800x400)</div>
                </div>
              </div>
              <input type="file" accept="image/*" @change="onLogoChange" style="position:absolute;opacity:0;top:0;left:0;width:100%;height:100%;cursor:pointer;" />
            </div>
          </div>
        </div>
      </section>
      <!-- Firma Bilgileri -->
      <section class="form-section">
        <div class="form-group-title">Firma Bilgileri *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.username" type="text" placeholder="Kullanıcı Adı *" required />
            <div class="input-desc">Sistem giriş kullanıcı adınız. Örn: acenta123</div>
          </div>
          <div class="form-group">
            <input v-model="form.companyName" type="text" placeholder="Firma Adı *" required />
            <div class="input-desc">Acentanızın resmi ticari unvanı. Örn: Harika Tur ve Seyahat Ltd. Şti.</div>
          </div>
        </div>
      </section>
      <!-- E-posta / Telefon -->
      <section class="form-section">
        <div class="form-group-title">E-posta / Telefon *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.email" type="email" placeholder="E-posta *" required pattern="[^\s@]+@[^\s@]+\.[^\s@]+" />
            <div class="input-desc">İletişim kuracağımız e-posta adresi. Örn: info@acentaniz.com</div>
          </div>
          <div class="form-group phone-group">
            <div class="country-code-select">
              <img :src="selectedCountryFlag" alt="Flag" style="width:24px;height:16px;object-fit:cover;vertical-align:middle;" />
              <select v-model="form.countryCode">
                <option v-for="c in countryCodes" :key="c.code" :value="c.code">{{ c.flag }} {{ c.code }}</option>
              </select>
            </div>
            <input v-model="form.phone" type="tel" placeholder="Telefon *" required />
            <div class="input-desc">İletişim kurabileceğimiz telefon numarası. Örn: 5XX XXX XX XX</div>
          </div>
        </div>
      </section>
      <!-- Ülke / Bölge (Şehir) -->
      <section class="form-section">
        <div class="form-group-title">Ülke / Bölge (Şehir) *</div>
        <div class="form-row">
          <div class="form-group">
            <select v-model="form.country" required>
              <option value="">Ülke Seçiniz *</option>
              <option v-for="c in countries" :key="c.code" :value="c.name">{{ c.name }}</option>
            </select>
            <div class="input-desc">Acentanızın bulunduğu ülke</div>
          </div>
          <div class="form-group">
            <select v-model="form.city" required>
              <option value="">Şehir Seçiniz *</option>
              <option v-for="city in cities" :key="city">{{ city }}</option>
            </select>
            <div class="input-desc">Acentanızın bulunduğu şehir</div>
          </div>
        </div>
      </section>
      <!-- Adres -->
      <section class="form-section">
        <div class="form-group-title">Adres *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.address" type="text" placeholder="Adres *" required />
            <div class="input-desc">Acentanızın tam adresi. Örn: Cumhuriyet Mah. Atatürk Cad. No:123 Daire:4</div>
          </div>
        </div>
      </section>
      <!-- Kuruluş Tarihi / Çalışan Sayısı -->
      <section class="form-section">
        <div class="form-group-title">Kuruluş Tarihi / Çalışan Sayısı *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.foundationDate" type="date" placeholder="Kuruluş Tarihi *" required />
            <div class="input-desc">Acentanızın resmi kuruluş tarihi</div>
          </div>
          <div class="form-group">
            <input v-model="form.employeeCount" type="number" min="1" placeholder="Çalışan Sayısı *" required />
            <div class="input-desc">Acentanızda çalışan kişi sayısı. Örn: 5</div>
          </div>
        </div>
      </section>
      <!-- Aylık Ciro / Websitesi -->
      <section class="form-section">
        <div class="form-group-title">Aylık Ciro / Websitesi *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.monthlyRevenue" type="text" placeholder="Aylık Ciro *" required />
            <div class="input-desc">Acentanızın yaklaşık aylık cirosu. Örn: 100.000</div>
          </div>
          <div class="form-group">
            <input v-model="form.website" type="url" placeholder="Website" />
            <div class="input-desc">Acentanızın web sitesi. Örn: www.acentaniz.com</div>
          </div>
        </div>
      </section>
      <!-- Vergi Dairesi / Numarası -->
      <section class="form-section">
        <div class="form-group-title">Vergi Dairesi / Numarası *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.taxOffice" type="text" placeholder="Vergi Dairesi *" required />
            <div class="input-desc">Acentanızın bağlı olduğu vergi dairesi. Örn: Kadıköy Vergi Dairesi</div>
          </div>
          <div class="form-group">
            <input v-model="form.taxNumber" type="text" placeholder="Vergi Numarası *" required />
            <div class="input-desc">10 veya 11 haneli vergi numaranız. Örn: 1234567890</div>
          </div>
        </div>
      </section>
      <!-- IBAN -->
      <section class="form-section">
        <div class="form-group-title">IBAN *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.iban" type="text" placeholder="IBAN *" required />
            <div class="input-desc">IBAN numaranız. Örn: TR12 3456 7890 1234 5678 9012 34</div>
          </div>
          <div class="form-group">
            <input v-model="form.accountHolder" type="text" placeholder="İsim Soyisim *" required />
            <div class="input-desc">Hesap sahibinin adı. Örn: Harika Tur ve Seyahat Ltd. Şti.</div>
          </div>
          <div class="form-group">
            <input v-model="form.bank" type="text" placeholder="Banka *" required />
            <div class="input-desc">Banka adı. Örn: Ziraat Bankası</div>
          </div>
        </div>
      </section>
      <!-- Swift Kodu / Hesap Numarası -->
      <section class="form-section">
        <div class="form-group-title">Swift Kodu / Hesap Numarası</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.swiftCode" type="text" placeholder="Swift Kodu" />
            <div class="input-desc">Uluslararası banka işlemleri için Swift/BIC kodu. Örn: TGBATRISXXX</div>
          </div>
          <div class="form-group">
            <input v-model="form.accountNumber" type="text" placeholder="Hesap Numarası" />
            <div class="input-desc">Banka hesap numaranız. Örn: 12345678</div>
          </div>
        </div>
      </section>
      <!-- Hizmet Alanı / Dil / Bizi Nereden Duydunuz -->
      <section class="form-section">
        <div class="form-group-title">Hizmet Alanı / Dil / Bizi Nereden Duydunuz *</div>
        <div class="form-row">
          <div class="form-group">
            <select v-model="form.serviceArea" required>
              <option value="">Hizmet Alanı Seçiniz *</option>
              <option v-for="area in serviceAreas" :key="area">{{ area }}</option>
            </select>
            <div class="input-desc">Acentanızın sunduğu hizmet kategorileri. Birden fazla seçebilirsiniz.</div>
          </div>
          <div class="form-group">
            <select v-model="form.language" required>
              <option value="">Dil Seçiniz *</option>
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
            </select>
            <div class="input-desc">Acentanızın öncelikli iletişim dili</div>
          </div>
          <div class="form-group">
            <select v-model="form.heardFrom" required>
              <option value="">Bizi Nereden Duydunuz? *</option>
              <option v-for="h in heardFromOptions" :key="h">{{ h }}</option>
            </select>
            <div class="input-desc">Bizi nereden duydunuz?</div>
          </div>
        </div>
      </section>
      <!-- Dosya Yükleme Alanları -->
      <section class="form-section">
        <div class="form-group-title">Belgeler</div>
        <div class="form-row file-upload-row">
          <label>Vergi Levhası *</label>
          <div class="file-upload-box">
            <input type="file" @change="onFileChange($event, 'taxDocument')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" required />
            <div class="input-desc">Vergi levhanızın (güncel tarihli) PDF veya resim dosyası. Zorunlu belge.</div>
          </div>
        </div>
        <div class="form-row file-upload-row">
          <label>TÜRSAB Belgesi</label>
          <div class="file-upload-box">
            <input type="file" @change="onFileChange($event, 'tursabDocument')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" />
            <div class="input-desc">TÜRSAB belgenizin PDF veya resim dosyası (varsa)</div>
          </div>
        </div>
        <div class="form-row file-upload-row">
          <label>İş / Uzmanlık Belgesi</label>
          <div class="file-upload-box">
            <input type="file" @change="onFileChange($event, 'expertiseDocument')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" />
            <div class="input-desc">Uzmanlık belgenizin PDF veya resim dosyası (varsa)</div>
          </div>
        </div>
        <div class="form-row file-upload-row">
          <label>Diğer Belgeler</label>
          <div class="file-upload-box">
            <input type="file" @change="onFileChange($event, 'otherDocuments')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" multiple />
            <div class="input-desc">Diğer belgeleriniz (varsa)</div>
          </div>
        </div>
      </section>
      <!-- Yönetici Bilgileri -->
      <section class="form-section">
        <div class="form-group-title">Yönetici</div>
        <div class="form-row">
          <div class="form-group">
            <select v-model="form.managerGender" required>
              <option value="">Cinsiyet Seçiniz *</option>
              <option value="Erkek">Erkek</option>
              <option value="Kadın">Kadın</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>
          <div class="form-group">
            <input v-model="form.managerTitle" type="text" placeholder="Ünvan *" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.managerName" type="text" placeholder="Ad *" required />
          </div>
          <div class="form-group">
            <input v-model="form.managerSurname" type="text" placeholder="Soyad *" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.managerPhone" type="tel" placeholder="Telefon Numaranız *" required />
          </div>
          <div class="form-group">
            <input v-model="form.managerBirthDate" type="date" placeholder="Doğum Tarihi *" required />
          </div>
        </div>
      </section>
      <!-- Şifre Alanı -->
      <section class="form-section">
        <div class="form-group-title">Şifre</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.password" type="password" placeholder="Şifreniz *" required minlength="6" />
            <div class="input-desc">Şifre en az 6 karakter uzunluğunda olmalı ve en az bir rakam içermelidir.</div>
          </div>
          <div class="form-group">
            <input v-model="form.passwordRepeat" type="password" placeholder="Şifre Tekrar *" required minlength="6" />
          </div>
        </div>
      </section>
      <!-- Sözleşmeler -->
      <section class="form-section">
        <div class="form-group-title">Sözleşmeler</div>
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
import { reactive, ref, computed } from 'vue'

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

const logoPreview = ref(null)
function onLogoChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      logoPreview.value = ev.target.result
    }
    reader.readAsDataURL(file)
  }
}

const countryCodes = [
  { code: '+90', flag: '🇹🇷', flagUrl: 'https://flagsapi.com/TR/flat/64.png' },
  { code: '+1', flag: '🇺🇸', flagUrl: 'https://flagsapi.com/US/flat/64.png' },
  { code: '+44', flag: '🇬🇧', flagUrl: 'https://flagsapi.com/GB/flat/64.png' },
]
const selectedCountryFlag = computed(() => {
  const found = countryCodes.find(c => c.code === form.countryCode)
  return found ? found.flagUrl : countryCodes[0].flagUrl
})
const countries = [
  { code: 'TR', name: 'Türkiye' },
  { code: 'US', name: 'ABD' },
  { code: 'DE', name: 'Almanya' },
]
const cities = ['İstanbul', 'Ankara', 'İzmir']
const serviceAreas = ['Tur', 'Transfer', 'Otel']
const languages = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
]
const heardFromOptions = ['Google', 'Sosyal Medya', 'Referans']

function onFileChange(event, key) {
  if (key === 'otherDocuments') {
    form[key] = Array.from(event.target.files)
  } else {
    form[key] = event.target.files[0]
  }
}

function submitForm() {
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
.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.input-desc {
  font-size: 12px;
  color: #bbb;
  margin-top: 4px;
  font-style: italic;
}
.logo-upload-row {
  align-items: center;
  gap: 24px;
}
.logo-upload-content {
  display: flex;
  gap: 16px;
  /*align-items: center;*/
}
.logo-upload-box {
  position: relative;
  width: 100px;
  height: 100px;
  border: 2px dashed #bbb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #23262f;
  cursor: pointer;
  transition: border 0.2s;
}
.logo-upload-box:hover {
  border-color: #f39c12;
}
.logo-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.file-upload-row label {
  min-width: 160px;
  font-size: 0.95rem;
  color: #bbb;
}
.file-upload-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.phone-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.country-code-select {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #23262f;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0 8px;
}
.country-code-select select {
  background: transparent;
  color: #fff;
  border: none;
  outline: none;
  font-size: 1rem;
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
.form-group-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
  margin-top: 8px;
  letter-spacing: 0.01em;
}
.form-section {
  margin-bottom: 0;
  padding-bottom: 0;
}
.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
}
.form-group {
  flex: 1 1 0;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}
.form-group input,
.form-group select {
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #444;
  background: #23262f;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 0;
}
.input-desc {
  font-size: 12px;
  color: #bbb;
  margin-top: 4px;
  font-style: italic;
}
@media (max-width: 900px) {
  .form-row {
    flex-direction: column;
    gap: 8px;
  }
  .form-group {
    min-width: 0;
  }
}
</style> 