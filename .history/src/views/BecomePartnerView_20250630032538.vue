<template>
  <div class="become-partner-page">
    
    <form class="partner-form" @submit.prevent="submitForm">
      <!-- Logo Alanı -->
      <section class="form-section">
        <div class="logo-upload-grid">
          <div class="logo-upload-info">
            <div class="logo-label"><span class="text-sm self-center font-medium">Logo</span></div>
            <span class="text-sm text-gray-400 self-center">150×150px JPEG, PNG Image</span>
          </div>
          <div class="custom-upload-box">
            <label class="upload-label">
              <input type="file" accept="image/*" @change="onLogoChange" />
              <div class="upload-placeholder">
                <i class="fas fa-image"></i>
                <div class="upload-desc">SVG, PNG, JPG</div>
                <div class="upload-desc">(max. 800x400)</div>
                <div v-if="logoPreview" class="upload-filename">Seçili dosya</div>
              </div>
            </label>
            <div v-if="logoPreview" class="logo-upload-preview" style="margin-top:4px; text-align:center;">
              <img :src="logoPreview" alt="Logo Preview" style="max-width:60px;max-height:60px;border-radius:8px;" />
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
            <div class="phone-input-row">
              <div class="country-code-select">
                <img :src="selectedCountryFlag" alt="Flag" style="width:24px;height:16px;object-fit:cover;vertical-align:middle;" />
                <select v-model="form.countryCode">
                  <option v-for="c in countryCodes" :key="c.code" :value="c.code">{{ c.flag }} {{ c.code }}</option>
                </select>
              </div>
              <input v-model="form.phone" type="tel" placeholder="Telefon *" required />
            </div>
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
          <div class="form-group ciro-group">
            <div class="ciro-input-row">
              <input v-model="form.monthlyRevenue" type="text" placeholder="Aylık Ciro *" required />
              <select v-model="form.currency" class="currency-select">
                <option v-for="opt in currencyOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
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
          <div class="form-group" style="position:relative;">
            <div class="multi-select-input" @click="toggleServiceAreaDropdown" :class="{open: serviceAreaDropdownOpen}" ref="dropdownRef">
              <div class="chips">
                <span v-if="!form.serviceAreas.length" class="placeholder">Hizmet Alanı Seçiniz *</span>
                <span v-for="area in form.serviceAreas" :key="area" class="chip">{{ area }} <span class="remove-chip" @click.stop="toggleServiceArea(area)">&times;</span></span>
              </div>
              <span class="dropdown-arrow">▼</span>
            </div>
            <div v-if="serviceAreaDropdownOpen" class="multi-select-dropdown">
              <div v-for="group in serviceAreaOptions" :key="group.group">
                <div class="dropdown-group-title">{{ group.group }}</div>
                <div v-for="area in group.options" :key="area" class="dropdown-option" @click.stop="toggleServiceArea(area)">
                  <input type="checkbox" :checked="isServiceAreaSelected(area)" readonly />
                  <span>{{ area }}</span>
                </div>
              </div>
            </div>
            <div class="input-desc">Acentanızın sunduğu hizmet kategorileri. Birden fazla seçebilirsiniz.</div>
          </div>
          <div class="form-group">
            <div class="custom-language-select" ref="languageDropdownRef">
              <div class="custom-language-input" @click="toggleLanguageDropdown">
                <template v-if="selectedLanguage">
                  <img :src="selectedLanguage.flagUrl" :alt="selectedLanguage.name" class="lang-flag" />
                  <span>{{ selectedLanguage.name }}</span>
                </template>
                <template v-else>
                  <span class="lang-placeholder">🌐 Dil Seçiniz</span>
                </template>
                <span class="dropdown-arrow">▼</span>
              </div>
              <div v-if="languageDropdownOpen" class="custom-language-dropdown">
                <div v-for="lang in languages" :key="lang.code" class="custom-language-option" @click="selectLanguage(lang.code)">
                  <img :src="lang.flagUrl" :alt="lang.name" class="lang-flag" />
                  <span>{{ lang.name }}</span>
                </div>
              </div>
            </div>
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
          <div class="file-upload-box custom-upload-box">
            <label class="upload-label">
              <input type="file" @change="onFileChange($event, 'taxDocument')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" required />
              <div class="upload-placeholder">
                <i class="fas fa-file-upload"></i>
                <div class="upload-desc">PDF, JPG, PNG, DOC, DOCX, XLS, XLSX</div>
                <div class="upload-desc">(max. 10MB)</div>
                <div v-if="form.taxDocument" class="upload-filename">{{ form.taxDocument.name }}</div>
              </div>
            </label>
            <div class="input-desc">Vergi levhanızın (güncel tarihli) PDF veya resim dosyası. Zorunlu belge.</div>
          </div>
        </div>
        <div class="form-row file-upload-row">
          <label>TÜRSAB Belgesi</label>
          <div class="file-upload-box custom-upload-box">
            <label class="upload-label">
              <input type="file" @change="onFileChange($event, 'tursabDocument')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" />
              <div class="upload-placeholder">
                <i class="fas fa-file-upload"></i>
                <div class="upload-desc">PDF, JPG, PNG, DOC, DOCX, XLS, XLSX</div>
                <div class="upload-desc">(varsa)</div>
                <div v-if="form.tursabDocument" class="upload-filename">{{ form.tursabDocument.name }}</div>
              </div>
            </label>
            <div class="input-desc">TÜRSAB belgenizin PDF veya resim dosyası (varsa)</div>
          </div>
        </div>
        <div class="form-row file-upload-row">
          <label>İş / Uzmanlık Belgesi</label>
          <div class="file-upload-box custom-upload-box">
            <label class="upload-label">
              <input type="file" @change="onFileChange($event, 'expertiseDocument')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" />
              <div class="upload-placeholder">
                <i class="fas fa-file-upload"></i>
                <div class="upload-desc">PDF, JPG, PNG, DOC, DOCX, XLS, XLSX</div>
                <div class="upload-desc">(varsa)</div>
                <div v-if="form.expertiseDocument" class="upload-filename">{{ form.expertiseDocument.name }}</div>
              </div>
            </label>
            <div class="input-desc">Uzmanlık belgenizin PDF veya resim dosyası (varsa)</div>
          </div>
        </div>
        <div class="form-row file-upload-row">
          <label>Diğer Belgeler</label>
          <div class="file-upload-box custom-upload-box">
            <label class="upload-label">
              <input type="file" @change="onFileChange($event, 'otherDocuments')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" multiple />
              <div class="upload-placeholder">
                <i class="fas fa-file-upload"></i>
                <div class="upload-desc">PDF, JPG, PNG, DOC, DOCX, XLS, XLSX</div>
                <div class="upload-desc">(varsa)</div>
                <div v-if="form.otherDocuments && form.otherDocuments.length" class="upload-filename">
                  <div v-for="file in form.otherDocuments" :key="file.name">{{ file.name }}</div>
                </div>
              </div>
            </label>
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
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'

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
  currency: 'TL',
  website: '',
  taxOffice: '',
  taxNumber: '',
  iban: '',
  accountHolder: '',
  bank: '',
  swiftCode: '',
  accountNumber: '',
  serviceAreas: [],
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
const languages = [
  { code: 'tr', name: 'Türkçe', flagUrl: 'https://flagsapi.com/TR/flat/32.png' },
  { code: 'en', name: 'İngilizce', flagUrl: 'https://flagsapi.com/GB/flat/32.png' },
  { code: 'de', name: 'Almanca', flagUrl: 'https://flagsapi.com/DE/flat/32.png' },
  { code: 'ru', name: 'Rusça', flagUrl: 'https://flagsapi.com/RU/flat/32.png' },
  { code: 'ar', name: 'Arapça', flagUrl: 'https://flagsapi.com/SA/flat/32.png' },
  { code: 'fr', name: 'Fransızca', flagUrl: 'https://flagsapi.com/FR/flat/32.png' },
  { code: 'es', name: 'İspanyolca', flagUrl: 'https://flagsapi.com/ES/flat/32.png' },
  { code: 'it', name: 'İtalyanca', flagUrl: 'https://flagsapi.com/IT/flat/32.png' },
  { code: 'ka', name: 'Gürcüce', flagUrl: 'https://flagsapi.com/GE/flat/32.png' },
  { code: 'me', name: 'Karadağca', flagUrl: 'https://flagsapi.com/ME/flat/32.png' },
]
const heardFromOptions = [
  'Instagram',
  'Facebook',
  'Twitter',
  'LinkedIn',
  'YouTube',
  'TikTok',
  'WhatsApp',
  'Telegram',
  'Web Sitesi',
  'Bölge Temsilcisi',
  'Diğer'
]

const currencyOptions = [
  { value: 'TL', label: '₺ TL' },
  { value: 'USD', label: '$ Dolar' },
  { value: 'EUR', label: '€ Euro' },
  { value: 'GBP', label: '£ Sterlin' },
  { value: 'SAR', label: '﷼ Riyal' },
]

const serviceAreaOptions = [
  { group: 'Tur Kategorileri', options: [
    'Kültür', 'Günübirlik', 'Gemi', 'Deneyim', 'Doğa', 'Konaklamalı', 'Hac / Umre', 'Kutsal Yerler', 'Macera', 'Tadım', 'Rehberli', 'VIP', 'Vizeli', 'Vizesiz', 'Yurtdışı', 'Paket', 'Trekking'
  ]},
  { group: 'Aktivite Kategorileri', options: [
    'Golf', 'Kürek', 'Airsoft', 'Helikopter', 'Microlight', 'Hamam', 'Planör', 'Yelken Kanat', 'Parasailing', 'Jetski', 'Yamaç Paraşütü', 'Bungee Jumping', 'Balon', 'Dalış', 'Binicilik', 'Rafting', 'Serbest Paraşüt', 'Tekne', 'Sup', 'Zipline', 'Workshop', 'Buggy', 'Macera Park', 'Kamp', 'Spa & Masaj', 'Golf Aracı', 'Poligon', 'ATV-UTV', 'Jeep Safari', 'Kayak', 'Kano', 'Salıncak', 'Atlı Safari', 'Kanal'
  ]},
  { group: 'Kurs Kategorileri', options: [
    'Yamaç Paraşütü', 'Planör', 'Yelken Kanat', 'Paten', 'Airsoft', 'Tenis', 'Atölye', 'Binicilik', 'Yüzme', 'Golf', 'Kürek', 'Yoga', 'Yelkenli', 'Dalış', 'Sörf', 'Serbest Paraşüt', 'Kayak', 'Dans', 'Kiteboard', 'Motorsiklet', 'Doğa', 'Macera', 'Yat Kaptanlığı'
  ]},
  { group: 'Diğer Kategoriler', options: [
    'Transfer', 'Araç Kiralama', 'Müze Bileti', 'E-sim', 'Feribot', 'Giriş Bileti', 'Etkinlik', 'Organizasyon'
  ]}
]

const serviceAreaDropdownOpen = ref(false)
function toggleServiceAreaDropdown() {
  serviceAreaDropdownOpen.value = !serviceAreaDropdownOpen.value
}
function closeServiceAreaDropdown() {
  serviceAreaDropdownOpen.value = false
}
function toggleServiceArea(area) {
  const idx = form.serviceAreas.indexOf(area)
  if (idx === -1) form.serviceAreas.push(area)
  else form.serviceAreas.splice(idx, 1)
}
function isServiceAreaSelected(area) {
  return form.serviceAreas.includes(area)
}
// Dışarı tıklayınca menüyü kapat
const dropdownRef = ref(null)
function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    closeServiceAreaDropdown()
  }
}
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

function onFileChange(event, key) {
  if (key === 'otherDocuments') {
    form[key] = Array.from(event.target.files)
  } else {
    form[key] = event.target.files[0]
  }
}

const languageDropdownOpen = ref(false)
const selectedLanguage = computed(() => languages.find(l => l.code === form.language))
function toggleLanguageDropdown() { languageDropdownOpen.value = !languageDropdownOpen.value }
function selectLanguage(code) { form.language = code; languageDropdownOpen.value = false }
const languageDropdownRef = ref(null)
function handleLanguageClickOutside(e) {
  if (languageDropdownRef.value && !languageDropdownRef.value.contains(e.target)) {
    languageDropdownOpen.value = false
  }
}
onMounted(() => {
  document.addEventListener('mousedown', handleLanguageClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', handleLanguageClickOutside)
})

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
  max-width: 1200px;
  margin: 40px auto;
  background: #181a20;
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  padding: 40px 36px;
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
.logo-upload-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 24px;
  width: 100%;
  min-height: 140px;
}
.logo-upload-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  margin-left: auto;
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
.file-upload-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
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
  margin-left: 0;
  margin-right: auto;
}
.form-group.phone-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.phone-input-row {
  display: flex;
  flex-direction: row;
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
.custom-upload-box {
  position: relative;
  width: 160px;
  height: 100px;
  border: 2px dashed #bbb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #23262f;
  cursor: pointer;
  transition: border 0.2s;
  margin-bottom: 8px;
  margin-left: 0;
  margin-right: auto;
}
.custom-upload-box:hover {
  border-color: #f39c12;
}
.upload-label {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.upload-label input[type="file"] {
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #bbb;
  font-size: 13px;
}
.upload-placeholder i {
  font-size: 24px;
  margin-bottom: 2px;
}
.upload-desc {
  font-size: 12px;
  color: #bbb;
  text-align: center;
}
.upload-filename {
  color: #f39c12;
  font-size: 12px;
  margin-top: 2px;
  text-align: center;
}
.ciro-group {
  min-width: 0;
}
.ciro-input-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}
.currency-select {
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #444;
  background: #23262f;
  color: #fff;
  font-size: 1rem;
  min-width: 90px;
  height: 40px;
}
.multi-select-input {
  min-height: 40px;
  border: 1px solid #444;
  border-radius: 4px;
  background: #23262f;
  color: #fff;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;
  position: relative;
}
.multi-select-input.open {
  border-color: #f39c12;
}
.multi-select-input .chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}
.multi-select-input .chip {
  background: #f39c12;
  color: #fff;
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.multi-select-input .remove-chip {
  cursor: pointer;
  font-weight: bold;
  margin-left: 2px;
}
.multi-select-input .placeholder {
  color: #bbb;
  font-size: 15px;
}
.multi-select-input .dropdown-arrow {
  margin-left: auto;
  font-size: 13px;
  color: #bbb;
}
.multi-select-dropdown {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  background: #23262f;
  border: 1px solid #444;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  z-index: 100;
  max-height: 260px;
  overflow-y: auto;
  margin-top: 2px;
}
.dropdown-group-title {
  font-weight: 600;
  font-size: 14px;
  padding: 8px 12px;
  background: #23262f;
  color: #f39c12;
}
.dropdown-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}
.dropdown-option:hover {
  background: #292c36;
}
.dropdown-option input[type="checkbox"] {
  accent-color: #f39c12;
}
.custom-language-select {
  position: relative;
  width: 100%;
}
.custom-language-input {
  min-height: 40px;
  border: 1px solid #444;
  border-radius: 4px;
  background: #23262f;
  color: #fff;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 15px;
}
.custom-language-input .lang-placeholder {
  color: #bbb;
}
.custom-language-input .dropdown-arrow {
  margin-left: auto;
  font-size: 13px;
  color: #bbb;
}
.custom-language-dropdown {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  background: #23262f;
  border: 1px solid #444;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  z-index: 100;
  max-height: 320px;
  overflow-y: auto;
  margin-top: 2px;
}
.custom-language-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
}
.custom-language-option:hover {
  background: #292c36;
}
.lang-flag {
  width: 22px;
  height: 16px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}
</style> 