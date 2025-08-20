<template>
  <div class="become-partner-page">
    
    <form class="partner-form" @submit.prevent="submitForm">
      <!-- Logo Area -->
      <section class="form-section">
        <div class="logo-upload-grid">
          <div class="logo-upload-info">
            <div class="logo-label form-group-title">Logo</div>
            <span class="logo-desc">150×150px JPEG, PNG Image</span>
          </div>
          <div class="custom-upload-box">
            <label class="upload-label">
              <input type="file" accept="image/*" @change="onLogoChange" />
              <div class="upload-placeholder">
                <span class="emoji-icon">📷</span>
                <div class="upload-desc">SVG, PNG, JPG</div>
                <div class="upload-desc">(max. 800x400)</div>
                <div v-if="logoPreview" class="upload-filename">Selected file</div>
              </div>
            </label>
            <div v-if="logoPreview" class="logo-upload-preview" style="margin-top:4px; text-align:center;">
              <img :src="logoPreview" alt="Logo Preview" style="max-width:60px;max-height:60px;border-radius:8px;" />
            </div>
          </div>
        </div>
      </section>
      <!-- Company Information -->
      <section class="form-section">
        <div class="form-group-title">Company Information *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.username" type="text" placeholder="Username *" required />
            <div class="input-desc">Your system login username. Ex: agency123</div>
          </div>
          <div class="form-group">
            <input v-model="form.companyName" type="text" placeholder="Company Name *" required />
            <div class="input-desc">Your agency's official trade name. Ex: Amazing Tours and Travel Ltd.</div>
          </div>
        </div>
      </section>
      <!-- Email / Phone -->
      <section class="form-section">
        <div class="form-group-title">Email / Phone *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.email" type="email" placeholder="Email *" required pattern="[^\s@]+@[^\s@]+\.[^\s@]+" />
            <div class="input-desc">Email address for communication. Ex: info@youragency.com</div>
          </div>
          <div class="form-group phone-group">
            <div class="phone-input-combined">
              <div class="country-code-select">
                <img :src="selectedCountryFlag" alt="Flag" style="width:24px;height:16px;object-fit:cover;vertical-align:middle;" />
                <select v-model="form.countryCode">
                  <option v-for="c in countryCodes" :key="c.code" :value="c.code">{{ c.flag }} {{ c.code }}</option>
                </select>
              </div>
              <input v-model="form.phone" type="tel" placeholder="Phone *" required />
            </div>
            <div class="input-desc">Phone number for communication. Ex: 5XX XXX XX XX</div>
          </div>
        </div>
      </section>
      <!-- Country / Region (City) -->
      <section class="form-section">
        <div class="form-group-title">Country / Region (City) *</div>
        <div class="form-row">
          <div class="form-group">
            <div class="custom-country-select" ref="countryDropdownRef">
              <div class="custom-country-input" @click="toggleCountryDropdown">
                <span v-if="selectedCountry">
                  <img :src="selectedCountry.flagUrl" :alt="selectedCountry.name" class="lang-flag" />
                  <span>{{ selectedCountry.name }}</span>
                </span>
                <span v-else class="lang-placeholder">Select Country *</span>
                <span class="dropdown-arrow">▼</span>
              </div>
              <div v-if="countryDropdownOpen" class="custom-country-dropdown">
                <div v-for="c in countries" :key="c.code" class="custom-country-option" @click="selectCountry(c.name)">
                  <img :src="c.flagUrl" :alt="c.name" class="lang-flag" />
                  <span>{{ c.name }}</span>
                </div>
              </div>
            </div>
            <div class="input-desc">Country where your agency is located</div>
          </div>
          <div class="form-group">
            <select v-model="form.city" :disabled="!form.country" required>
              <option value="">Select City *</option>
              <option v-for="city in cities" :key="city">{{ city }}</option>
            </select>
            <div class="input-desc">City where your agency is located</div>
          </div>
        </div>
      </section>
      <!-- Address -->
      <section class="form-section">
        <div class="form-group-title">Address *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.address" type="text" placeholder="Address *" required />
            <div class="input-desc">Complete address of your agency. Ex: Republic St. Ataturk Ave. No:123 Apt:4</div>
          </div>
        </div>
      </section>
      <!-- Foundation Date / Employee Count -->
      <section class="form-section">
        <div class="form-group-title">Foundation Date / Employee Count *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.foundationDate" type="date" placeholder="Foundation Date *" required />
            <div class="input-desc">Official foundation date of your agency</div>
          </div>
          <div class="form-group">
            <input v-model="form.employeeCount" type="number" min="1" placeholder="Employee Count *" required />
            <div class="input-desc">Number of employees in your agency. Ex: 5</div>
          </div>
        </div>
      </section>
      <!-- Monthly Revenue / Website -->
      <section class="form-section">
        <div class="form-group-title">Monthly Revenue / Website *</div>
        <div class="form-row">
          <div class="form-group ciro-group">
            <div class="ciro-input-row">
              <input v-model="form.monthlyRevenue" type="text" placeholder="Monthly Revenue *" required />
              <select v-model="form.currency" class="currency-select">
                <option v-for="opt in currencyOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
            <div class="input-desc">Approximate monthly revenue of your agency. Ex: 100,000</div>
          </div>
          <div class="form-group">
            <input v-model="form.website" type="url" placeholder="Website" />
            <div class="input-desc">Your agency's website. Ex: www.youragency.com</div>
          </div>
        </div>
      </section>
      <!-- Tax Office / Number -->
      <section class="form-section" v-if="form.country !== 'Montenegro'">
        <div class="form-group-title">Tax Office / Number *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.taxOffice" type="text" placeholder="Tax Office *" required />
            <div class="input-desc">Tax office your agency is registered with. Ex: Kadikoy Tax Office</div>
          </div>
          <div class="form-group">
            <input v-model="form.taxNumber" type="text" placeholder="Tax Number *" required />
            <div class="input-desc">Your 10 or 11-digit tax number. Ex: 1234567890</div>
          </div>
        </div>
      </section>

      <!-- PIB Number for Montenegro -->
      <section class="form-section" v-else>
        <div class="form-group-title">PIB Number *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.pibNumber" type="text" placeholder="PIB Number *" required />
            <div class="input-desc">P.I.B. Number example: 1234567890</div>
          </div>
        </div>
      </section>
      
      <!-- IBAN -->
      <section class="form-section">
        <div class="form-group-title">IBAN *</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.iban" type="text" placeholder="IBAN *" required />
            <div class="input-desc">Your IBAN number. Ex: TR12 3456 7890 1234 5678 9012 34</div>
          </div>
          <div class="form-group">
            <input v-model="form.accountHolder" type="text" placeholder="Full Name *" required />
            <div class="input-desc">Account holder's name. Ex: Amazing Tours and Travel Ltd.</div>
          </div>
          <div class="form-group">
            <input v-model="form.bank" type="text" placeholder="Bank *" required />
            <div class="input-desc">Bank name. Ex: Ziraat Bank</div>
          </div>
        </div>
      </section>
      <!-- Swift Code / Account Number -->
      <section class="form-section">
        <div class="form-group-title">Swift Code / Account Number</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.swiftCode" type="text" placeholder="Swift Code" />
            <div class="input-desc">Swift/BIC code for international bank transactions. Ex: TGBATRISXXX</div>
          </div>
          <div class="form-group">
            <input v-model="form.accountNumber" type="text" placeholder="Account Number" />
            <div class="input-desc">Your bank account number. Ex: 12345678</div>
          </div>
        </div>
      </section>
      <!-- Service Area / Language / How Did You Hear About Us -->
      <section class="form-section">
        <div class="form-group-title">Service Area / Language / How Did You Hear About Us *</div>
        <div class="form-row">
          <div class="form-group" style="position:relative;">
            <div class="multi-select-input" @click="toggleServiceAreaDropdown" :class="{open: serviceAreaDropdownOpen}" ref="dropdownRef">
              <div class="chips">
                <span v-if="!form.serviceAreas.length" class="placeholder">Select Service Area *</span>
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
            <div class="input-desc">Service categories your agency offers. You can select multiple options.</div>
          </div>
          <div class="form-group">
            <div class="custom-language-select" ref="languageDropdownRef">
              <div class="custom-language-input" @click="toggleLanguageDropdown">
                <span v-if="selectedLanguage">
                  <img :src="selectedLanguage.flagUrl" :alt="selectedLanguage.name" class="lang-flag" />
                  <span>{{ selectedLanguage.name }}</span>
                </span>
                <span v-else class="lang-placeholder">🌐 Select Language</span>
                <span class="dropdown-arrow">▼</span>
              </div>
              <div v-if="languageDropdownOpen" class="custom-language-dropdown">
                <div v-for="lang in languages" :key="lang.code" class="custom-language-option" @click="selectLanguage(lang.code)">
                  <img :src="lang.flagUrl" :alt="lang.name" class="lang-flag" />
                  <span>{{ lang.name }}</span>
                </div>
              </div>
            </div>
            <div class="input-desc">Your agency's preferred communication language</div>
          </div>
          <div class="form-group">
            <select v-model="form.heardFrom" required>
              <option value="">How Did You Hear About Us? *</option>
              <option v-for="h in heardFromOptions" :key="h">{{ h }}</option>
            </select>
            <div class="input-desc">How did you hear about us?</div>
          </div>
        </div>
      </section>
      <!-- Document Upload Areas -->
      <section class="form-section">
        <div class="form-group-title">Documents</div>
        <div class="form-row file-upload-row">
          <label>{{ form.country === 'Montenegro' ? 'License Document *' : 'Tax Certificate *' }}</label>
          <div class="file-upload-box custom-upload-box">
            <label class="upload-label">
              <input type="file" @change="onFileChange($event, 'taxDocument')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" required />
              <div class="upload-placeholder">
                <span class="emoji-icon">📁</span>
                <div class="upload-desc">PDF, JPG, PNG, DOC, DOCX, XLS, XLSX</div>
                <div class="upload-desc">(max. 10MB)</div>
                <div v-if="form.taxDocument" class="upload-filename">{{ form.taxDocument.name }}</div>
              </div>
            </label>
            <div class="input-desc">{{ form.country === 'Montenegro' ? 'Your license document in PDF or image format. Required document.' : 'Your tax certificate (current dated) in PDF or image format. Required document.' }}</div>
          </div>
        </div>
        <div class="form-row file-upload-row" v-if="form.country !== 'Montenegro'">
          <label>TÜRSAB Certificate</label>
          <div class="file-upload-box custom-upload-box">
            <label class="upload-label">
              <input type="file" @change="onFileChange($event, 'tursabDocument')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" />
              <div class="upload-placeholder">
                <span class="emoji-icon">📁</span>
                <div class="upload-desc">PDF, JPG, PNG, DOC, DOCX, XLS, XLSX</div>
                <div class="upload-desc">(if available)</div>
                <div v-if="form.tursabDocument" class="upload-filename">{{ form.tursabDocument.name }}</div>
              </div>
            </label>
            <div class="input-desc">Your TÜRSAB certificate in PDF or image format (if available)</div>
          </div>
        </div>
        <div class="form-row file-upload-row" v-if="form.country !== 'Montenegro'">
          <label>Business / Expertise Certificate</label>
          <div class="file-upload-box custom-upload-box">
            <label class="upload-label">
              <input type="file" @change="onFileChange($event, 'expertiseDocument')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" />
              <div class="upload-placeholder">
                <span class="emoji-icon">📁</span>
                <div class="upload-desc">PDF, JPG, PNG, DOC, DOCX, XLS, XLSX</div>
                <div class="upload-desc">(if available)</div>
                <div v-if="form.expertiseDocument" class="upload-filename">{{ form.expertiseDocument.name }}</div>
              </div>
            </label>
            <div class="input-desc">Your expertise certificate in PDF or image format (if available)</div>
          </div>
        </div>
        <div class="form-row file-upload-row">
          <label>Other Documents</label>
          <div class="file-upload-box custom-upload-box">
            <label class="upload-label">
              <input type="file" @change="onFileChange($event, 'otherDocuments')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" multiple />
              <div class="upload-placeholder">
                <span class="emoji-icon">📁</span>
                <div class="upload-desc">PDF, JPG, PNG, DOC, DOCX, XLS, XLSX</div>
                <div class="upload-desc">(if available)</div>
                <div v-if="form.otherDocuments && form.otherDocuments.length" class="upload-filename">
                  <div v-for="file in form.otherDocuments" :key="file.name">{{ file.name }}</div>
                </div>
              </div>
            </label>
            <div class="input-desc">Other documents (if available)</div>
          </div>
        </div>
      </section>
      <!-- Manager Information -->
      <section class="form-section">
        <div class="form-group-title">Manager</div>
        <div class="form-row">
          <div class="form-group">
            <select v-model="form.managerGender" required>
              <option value="">Select Gender *</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to specify">Prefer not to specify</option>
            </select>
          </div>
          <div class="form-group">
            <input v-model="form.managerTitle" type="text" placeholder="Title *" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.managerName" type="text" placeholder="First Name *" required />
          </div>
          <div class="form-group">
            <input v-model="form.managerSurname" type="text" placeholder="Last Name *" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.managerPhone" type="tel" placeholder="Phone Number *" required />
          </div>
          <div class="form-group">
            <input v-model="form.managerBirthDate" type="date" placeholder="Date of Birth *" required />
          </div>
        </div>
      </section>
      <!-- Password Field -->
      <section class="form-section">
        <div class="form-group-title">Password</div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.password" type="password" placeholder="Your Password *" required minlength="6" />
            <div class="input-desc">Password must be at least 6 characters long and contain at least one number.</div>
          </div>
          <div class="form-group">
            <input v-model="form.passwordRepeat" type="password" placeholder="Repeat Password *" required minlength="6" />
          </div>
        </div>
      </section>
      <!-- Agreements -->
      <section class="form-section">
        <div class="form-group-title">Agreements</div>
        <div class="form-row agreements">
          <label><input type="checkbox" v-model="form.agreeCookies" required /> I have read and accept the SearchYourTour Cookie Policy.
            <br>
            <a href="/docs/cookie-policy.pdf" target="_blank" style="color:#3498db;">Read SearchYourTour Cookie Policy</a>
          </label>
          <label><input type="checkbox" v-model="form.agreeContract" required /> I have read and accept the SearchYourTour E-Commerce Intermediary Agreement.
            <br>
            <a href="/docs/e-commerce-agreement.pdf" target="_blank" style="color:#3498db;">Read E-Commerce Intermediary Agreement</a>
          </label>
        </div>
      </section>
      <button class="submit-btn" type="submit">Complete Application</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'

// Header yüksekliğini dinamik olarak hesapla
const headerHeight = ref(100)

const updateHeaderHeight = () => {
  const header = document.querySelector('.main-header')
  if (header) {
    headerHeight.value = header.offsetHeight
    document.documentElement.style.setProperty('--header-height', `${headerHeight.value}px`)
  }
}

onMounted(() => {
  updateHeaderHeight()
  window.addEventListener('resize', updateHeaderHeight)
  
  // Sayfa yüklendikten sonra tekrar kontrol et
  setTimeout(updateHeaderHeight, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeaderHeight)
})

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
  pibNumber: '',
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
  { code: 'TR', name: 'Turkey', flagUrl: 'https://flagsapi.com/TR/flat/32.png' },
  { code: 'CY', name: 'Northern Cyprus', flagUrl: 'https://flagsapi.com/CY/flat/32.png' },
  { code: 'AE', name: 'United Arab Emirates', flagUrl: 'https://flagsapi.com/AE/flat/32.png' },
  { code: 'ME', name: 'Montenegro', flagUrl: 'https://flagsapi.com/ME/flat/32.png' },
  { code: 'GE', name: 'Georgia', flagUrl: 'https://flagsapi.com/GE/flat/32.png' },
]
const countryCities = {
  'Turkey': [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın',
    'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
    'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
    'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir',
    'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
    'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir',
    'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas',
    'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
  ],
  'Northern Cyprus': ['Lefkoşa', 'Gazimağusa', 'Girne', 'Güzelyurt', 'İskele', 'Lefke'],
  'United Arab Emirates': [
    'Abu Dhabi', 'Al-Ain', 'Al-Khabb', 'Arada', 'Dasah', 'Dibba', 'Dubai', 'Fujairah', 'Ghewelfat', 'Hamim',
    'Jabal Dhanna', 'Liwa Oasis', 'Mizaira\'a', 'Ras al-Khaimah', 'Sharjah', 'Tarif', 'Umm al-Quwain'
  ],
  'Montenegro': [
    'Akova', 'Andrijevica', 'Bar', 'Bečići', 'Berane', 'Bijela', 'Budva', 'Çetine', 'Danilovgrad', 'Dobrota',
    'Donja Lastva', 'Gradac', 'Gusinje', 'Herceg Novi', 'Igalo', 'Kolaşin', 'Kotor', 'Mojkovac', 'Nikšić', 'Perast',
    'Petrovaç', 'Plav', 'Plužine', 'Podgorica', 'Prčanj', 'Rijeka Crnojevića', 'Risan', 'Rožaje', 'Šavnik', 'Spuž',
    'Stari Bar', 'Sutomore', 'Sveti Stefan', 'Taşlıca', 'Tivat', 'Tuz', 'Ülgün', 'Virpazar', 'Žabljak', 'Zelenika'
  ],
  'Georgia': [
    'Ahılkelek', 'Ahıska', 'Ahmeta', 'Ambrolauri', 'Batum', 'Bolnisi', 'Borcomi', 'Çiatura', 'Duşeti', 'Gagra',
    'Gori', 'Gudauta', 'Cava', 'Cvari', 'Kobuleti', 'Kutaisi', 'Kazreti', 'Haşuri', 'Kvareli', 'Lagodehi',
    'Marneuli', 'Mtsheta', 'Ninotsminda', 'Oçamçire', 'Ozurgeti', 'Pasanauri', 'Poti', 'Rustavi', 'Samtredia', 'Senaki',
    'Şuahevi', 'Sohum', 'Supsa', 'Tiflis', 'Telavi', 'Tetritskaro', 'Tianeti', 'Tkibuli', 'Tkvarçeli', 'Tshinvali',
    'Tsalka', 'Tsiteli-Tskaro', 'Tsnori', 'Vale', 'Vani', 'Zugdidi'
  ]
}
const cities = computed(() => countryCities[form.country] || [])
const languages = [
  { code: 'tr', name: 'Turkish', flagUrl: 'https://flagsapi.com/TR/flat/32.png' },
  { code: 'en', name: 'English', flagUrl: 'https://flagsapi.com/GB/flat/32.png' },
  { code: 'de', name: 'German', flagUrl: 'https://flagsapi.com/DE/flat/32.png' },
  { code: 'ru', name: 'Russian', flagUrl: 'https://flagsapi.com/RU/flat/32.png' },
  { code: 'ar', name: 'Arabic', flagUrl: 'https://flagsapi.com/SA/flat/32.png' },
  { code: 'fr', name: 'French', flagUrl: 'https://flagsapi.com/FR/flat/32.png' },
  { code: 'es', name: 'Spanish', flagUrl: 'https://flagsapi.com/ES/flat/32.png' },
  { code: 'it', name: 'Italian', flagUrl: 'https://flagsapi.com/IT/flat/32.png' },
  { code: 'ka', name: 'Georgian', flagUrl: 'https://flagsapi.com/GE/flat/32.png' },
  { code: 'me', name: 'Montenegrin', flagUrl: 'https://flagsapi.com/ME/flat/32.png' },
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
  'Website',
  'Regional Representative',
  'Other'
]

const currencyOptions = [
  { value: 'TL', label: '₺ TL' },
  { value: 'USD', label: '$ Dollar' },
  { value: 'EUR', label: '€ Euro' },
  { value: 'GBP', label: '£ Sterling' },
  { value: 'SAR', label: '﷼ Riyal' },
]

const serviceAreaOptions = [
  { group: 'Tour Categories', options: [
    'Culture', 'Day Trip', 'Ship', 'Experience', 'Nature', 'Accommodation', 'Hajj / Umrah', 'Sacred Places', 'Adventure', 'Tasting', 'Guided', 'VIP', 'With Visa', 'Visa Free', 'International', 'Package', 'Trekking'
  ]},
  { group: 'Activity Categories', options: [
    'Golf', 'Rowing', 'Airsoft', 'Helicopter', 'Microlight', 'Turkish Bath', 'Glider', 'Paragliding', 'Parasailing', 'Jetski', 'Paragliding', 'Bungee Jumping', 'Balloon', 'Diving', 'Horseback Riding', 'Rafting', 'Skydiving', 'Boat', 'SUP', 'Zipline', 'Workshop', 'Buggy', 'Adventure Park', 'Camping', 'Spa & Massage', 'Golf Cart', 'Shooting Range', 'ATV-UTV', 'Jeep Safari', 'Skiing', 'Canoe', 'Swing', 'Horse Safari', 'Canal'
  ]},
  { group: 'Course Categories', options: [
    'Paragliding', 'Glider', 'Paragliding', 'Skating', 'Airsoft', 'Tennis', 'Workshop', 'Horseback Riding', 'Swimming', 'Golf', 'Rowing', 'Yoga', 'Sailing', 'Diving', 'Surfing', 'Skydiving', 'Skiing', 'Dance', 'Kiteboarding', 'Motorcycle', 'Nature', 'Adventure', 'Yacht Captain'
  ]},
  { group: 'Other Categories', options: [
    'Transfer', 'Car Rental', 'Museum Ticket', 'E-sim', 'Ferry', 'Entrance Ticket', 'Event', 'Organization'
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

const countryDropdownOpen = ref(false)
const selectedCountry = computed(() => countries.find(c => c.name === form.country))
function toggleCountryDropdown() { countryDropdownOpen.value = !countryDropdownOpen.value }
function selectCountry(name) { form.country = name; countryDropdownOpen.value = false }
const countryDropdownRef = ref(null)
function handleCountryClickOutside(e) {
  if (countryDropdownRef.value && !countryDropdownRef.value.contains(e.target)) {
    countryDropdownOpen.value = false
  }
}
onMounted(() => {
  document.addEventListener('mousedown', handleCountryClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', handleCountryClickOutside)
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
  margin: 0 auto;
  background: #fff;
  color: #222;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  padding: 40px 36px;
  margin-top: calc(var(--header-height, 100px) + 2rem);
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
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px 16px;
  margin-bottom: 8px;
}
.form-section h2 {
  font-size: 1.2rem;
  margin-bottom: 16px;
  color: #fc6421;
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
  color: #888;
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
  border: 2px dashed #ccc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  cursor: pointer;
  transition: border 0.2s;
  margin-left: auto;
}
.logo-upload-box:hover {
  border-color: #fc6421;
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
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 8px;
}
.country-code-select select {
  background: transparent;
  color: #222;
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
  background: #fc6421;
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
  background: #c0392b;
}
@media (max-width: 700px) {
  .become-partner-page {
    padding: 8px 2px;
    margin-top: calc(var(--header-height, 80px) + 1rem);
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
  color: #fc6421;
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
  border: 1px solid #ddd;
  background: #fff;
  color: #222;
  font-size: 1rem;
  margin-bottom: 0;
}
.input-desc {
  font-size: 12px;
  color: #888;
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
  border: 2px dashed #ccc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  cursor: pointer;
  transition: border 0.2s;
  margin-bottom: 8px;
  margin-left: 0;
  margin-right: auto;
}
.custom-upload-box:hover {
  border-color: #fc6421;
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
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #bbb;
  font-size: 13px;
}

.upload-placeholder .emoji-icon {
  font-size: 24px;
  margin-bottom: 2px;
}
.upload-desc {
  font-size: 12px;
  color: #bbb;
  text-align: center;
}
.upload-filename {
  color: #fc6421;
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
  border: 1px solid #ddd;
  background: #fff;
  color: #222;
  font-size: 1rem;
  min-width: 90px;
  height: 40px;
}
.multi-select-input {
  min-height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #222;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;
  position: relative;
}
.multi-select-input.open {
  border-color: #fc6421;
}
.multi-select-input .chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}
.multi-select-input .chip {
  background: #fc6421;
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
  color: #888;
  font-size: 15px;
}
.multi-select-input .dropdown-arrow {
  margin-left: auto;
  font-size: 13px;
  color: #888;
}
.multi-select-dropdown {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
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
  background: #f8f9fa;
  color: #fc6421;
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
  background: #f5f5f5;
}
.dropdown-option input[type="checkbox"] {
  accent-color: #fc6421;
}
.custom-language-select {
  position: relative;
  width: 100%;
}
.custom-language-input {
  min-height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #222;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 15px;
}
.custom-language-input .lang-placeholder {
  color: #888;
}
.custom-language-input .dropdown-arrow {
  margin-left: auto;
  font-size: 13px;
  color: #888;
}
.custom-language-dropdown {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
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
  background: #f5f5f5;
}
.lang-flag {
  width: 22px;
  height: 16px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}
.custom-country-select {
  position: relative;
  width: 100%;
}
.custom-country-input {
  min-height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #222;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.custom-country-input > span {
  display: flex;
  align-items: center;
  gap: 8px;
}
.custom-country-input .lang-placeholder {
  color: #888;
}
.custom-country-input .dropdown-arrow {
  margin-left: auto;
  font-size: 13px;
  color: #888;
}
.custom-country-dropdown {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  z-index: 100;
  max-height: 320px;
  overflow-y: auto;
  margin-top: 2px;
}
.custom-country-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
}
.custom-country-option:hover {
  background: #f5f5f5;
}
.logo-label.form-group-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fc6421;
  margin-bottom: 0;
  margin-top: 0;
  letter-spacing: 0.01em;
}
.logo-desc {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
  font-style: italic;
}
.hero-section {
  background: #FC6421;
  color: white;
  padding: 4rem 0;
  text-align: center;
}
.phone-input-combined {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  height: 40px;
}
.phone-input-combined .country-code-select {
  display: flex;
  align-items: center;
  border: none;
  padding: 0 8px;
  border-right: 1px solid #ddd;
  height: 100%;
}
.phone-input-combined select {
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
  min-width: 60px;
}
.phone-input-combined input[type="tel"] {
  border: none;
  padding: 0 12px;
  font-size: 1rem;
  height: 100%;
  flex: 1;
}
.phone-input-combined input[type="tel"]:focus {
  outline: none;
  background: #fff;
}
</style> 