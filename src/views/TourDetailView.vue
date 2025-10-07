<template>
  <div class="tour-detail">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>{{ $t('tourDetail.loading') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchTourData" class="btn btn-primary">{{ $t('tourDetail.tryAgain') }}</button>
    </div>

    <!-- Tour Content -->
    <div v-else-if="tour">
      <!-- Hero Section -->
      <section class="tour-hero">
        <div class="container">
          <div class="tour-hero-content">
            <div class="tour-images">
              <!-- Masaüstü için mevcut yapı -->
              <div class="main-image desktop-only">
                <img :src="getTourImage(tour)" :alt="getTourName(tour)" @click="openModal(0)" style="cursor: zoom-in;">
              </div>
              <div class="image-gallery desktop-only" v-if="tour.files && tour.files.length > 1">
                <div class="gallery-item" v-for="(file, index) in tour.files.slice(1, 5)" :key="file.id">
                  <img :src="file.url" :alt="`${getTourName(tour)} - Image ${index + 2}`" @click="openModal(index+1)" style="cursor: zoom-in;">
                </div>
              </div>

              <!-- Mobil için carousel -->
              <div class="mobile-carousel mobile-only" v-if="tour.files && tour.files.length > 0">
                <button class="carousel-arrow left" @click="prevCarouselImg" aria-label="Previous">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="white" fill-opacity="0.7"/>
                    <path d="M19.5 10L13 16L19.5 22" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <img
                  :src="tour.files[carouselIndex].url"
                  class="carousel-img"
                  @touchstart="handleTouchStart"
                  @touchend="handleTouchEnd"
                  :alt="getTourName(tour) + ' - Carousel'"
                />
                <button class="carousel-arrow right" @click="nextCarouselImg" aria-label="Next">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="white" fill-opacity="0.7"/>
                    <path d="M13 10L19.5 16L13 22" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <div class="carousel-indicator">{{ carouselIndex + 1 }} / {{ tour.files.length }}</div>
              </div>
            </div>
            <div class="tour-info">
              <nav class="breadcrumb">
                <router-link to="/">{{ $t('nav.home') }}</router-link>
                <span>/</span>
                <router-link to="/tours">{{ $t('nav.tours') }}</router-link>
                <span>/</span>
                <span>{{ getTourName(tour) }}</span>
              </nav>
              <h1 class="tour-title">{{ getTourName(tour) }}</h1>
              <div class="tour-meta">
                <div class="rating">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>4.5</span>
                  <span class="review-count">(New)</span>
                </div>
                <!-- Likely to sell out badge for tour detail -->
                <div v-if="isLikelyToSellOut" class="sell-out-badge-detail">
                  {{ $t('tourDetail.likelyToSellOut') }}
                </div>
                                 <div class="duration">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fc6421" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                     <circle cx="12" cy="12" r="10"/>
                     <polyline points="12,6 12,12 16,14"/>
                   </svg>
                   <span>{{ formatDuration(tour.tour_duraction, tour.tour_duraction_type) }}
                   </span>
                 </div>
                <div class="destination">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fc6421">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>{{ getDestinationName(tour) }}</span>
                </div>
              </div>
              <div class="tour-description">
                <p>{{ getTourDescription(tour) }}</p>
              </div>
           
                             <div class="info-card">
                 <h4>{{ $t('tourDetail.tourInformation') }}</h4>
                                    <div class="info-item">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="#fc6421">
                       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                     </svg>
                     <span>{{ $t('tourDetail.destination') }}: {{ getDestinationName(tour) }}</span>
                   </div>
                                                      <div class="info-item">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fc6421" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                       <circle cx="12" cy="12" r="10"/>
                       <polyline points="12,6 12,12 16,14"/>
                     </svg>
                     <span>{{ $t('tourDetail.duration') }}: {{ formatDuration(tour.tour_duraction, tour.tour_duraction_type) }}
                     </span>
                   </div>
                   <div class="info-item">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fc6421" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                       <circle cx="12" cy="12" r="10"/>
                       <polyline points="12,6 12,12 16,14"/>
                     </svg>
                     <span>{{ $t('tourDetail.time') }}: {{ formatTourTime(tour.tour_time) || $t('tourDetail.notSpecified') }}
                     </span>
                   </div>
                 <div class="info-item">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="#fc6421">
                     <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26V16h-1.5v6h5zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
                   </svg>
                   <span>{{ $t('tourDetail.maxGroupSize') }}: {{ tour.pax || $t('tourDetail.notSpecified') }}</span>
                 </div>
                 <div class="info-item">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="#fc6421">
                     <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                   </svg>
                   <span>{{ $t('tourDetail.availableDays') }}: {{ getAvailableDays(tour) }}</span>
                 </div>
                 <div class="info-item" v-if="tour.min_age">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="#fc6421">
                     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                   </svg>
                   <span>{{ $t('tourDetail.minimumAge') }}: {{ tour.min_age }}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tour Details Tabs -->
      <section class="tour-details">
        <div class="container">
          <div class="content-row">
            <div class="content-row-tabs">
              <div class="tabs" v-if="!isMobile">
                <button 
                  class="tab-btn" 
                  :class="{ active: activeTab === 'overview' }"
                  @click="activeTab = 'overview'"
                >
                  {{ $t('tourDetail.tabs.overview') }}
                </button>
                <button 
                  class="tab-btn" 
                  :class="{ active: activeTab === 'inclusions' }"
                  @click="activeTab = 'inclusions'"
                >
                  {{ $t('tourDetail.tabs.whatsIncluded') }}
                </button>
                <button 
                  class="tab-btn" 
                  :class="{ active: activeTab === 'additional' }"
                  @click="activeTab = 'additional'"
                >
                  {{ $t('tourDetail.tabs.additionalInfo') }}
                </button>
              </div>
    
              <div class="tab-content">
                <!-- Mobilde Accordionlar -->
                <template v-if="isMobile">
                  <MobileAccordion :showMoreLess="true" :maxHeight="aboutMaxHeight" :defaultOpen="true">
                    <template #header>Overview</template>
                    <div class="overview-content">
                      <div class="overview-text">
                        <h3>About This Tour</h3>
                        <div class="tour-description-html" v-html="getTourFullDescription(tour)"></div>
                      </div>
                     
                    </div>
                  </MobileAccordion>
                  <MobileAccordion>
                    <template #header>Includes</template>
                    <div>
                      <div v-if="tour.tour_include_service && tour.tour_include_service.length > 0">
                        <h4>What's Included</h4>
                        <ul class="inclusions-list">
                          <li v-for="service in tour.tour_include_service" :key="service.id">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#27ae60">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                            {{ service.include_service }}
                          </li>
                        </ul>
                      </div>
                      <div v-if="tour.tour_outside_service && tour.tour_outside_service.length > 0">
                        <h4>Not Included</h4>
                        <ul class="exclusions-list">
                          <li v-for="service in tour.tour_outside_service" :key="service.id">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e74c3c">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                            {{ service.outside_service }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </MobileAccordion>
                  <MobileAccordion>
                    <template #header>Additional Info</template>
                    <div>
                      <div class="additional-info">
                        <div class="info-section">
                          
                          <div class="tour-additional-html" v-html="getTourFullAdditionalInfo(tour)"></div>
                         
                        </div>
                      </div>
                    </div>
                  </MobileAccordion>
                </template>
                <!-- Masaüstünde eski sekmeli yapı -->
                <template v-else>
                  <!-- Overview Tab -->
                  <div v-if="activeTab === 'overview'" class="tab-panel">
                    <div class="overview-content">
                      <div class="overview-text">
                        <h3>About This Tour</h3>

                        <div class="tour-description-html" v-html="getTourFullDescription(tour)"></div>
                      </div>
                      
                      <div class="overview-sidebar">
                      
                      
                      </div>
                    </div>
                  </div>
    
                  <!-- Inclusions Tab -->
                  <div v-if="activeTab === 'inclusions'" class="tab-panel">
                    <div class="inclusions-grid">
                      <div class="inclusions-section" v-if="tour.tour_include_service && tour.tour_include_service.length > 0">
                        <h3>What's Included</h3>
                        <ul class="inclusions-list">
                          <li v-for="service in tour.tour_include_service" :key="service.id">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#27ae60">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                           </svg> 
                            {{ service.include_service }}
                          </li>
                        </ul>
                      </div>
                      <div class="inclusions-section" v-if="tour.tour_outside_service && tour.tour_outside_service.length > 0">
                        <h3>Not Included</h3>
                        <ul class="exclusions-list">
                          <li v-for="service in tour.tour_outside_service" :key="service.id">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e74c3c">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                            {{ service.outside_service }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
    
                  <!-- Additional Info Tab -->
                  <div v-if="activeTab === 'additional'" class="tab-panel">
                    <div class="additional-info">
                      <div class="info-section">              
                        <div class="detail-item">
                          <div class="tour-additional-html" v-html="getTourFullAdditionalInfo(tour)"></div>
                        </div>              
                        <div class="detail-item" v-if="tour.ask_for_price">
                          <strong>Pricing:</strong> Price on request
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div class="content-row-booking">
                               <div v-if="tour" class="pass-box" ref="bookingBox">
                                <h2 style="cursor:pointer" @click="scrollToBookingBox">{{ $t('tourDetail.bookNow') }}</h2>
                                <div class="pass-select-row">
                                  <div class="pass-select">{{ getTourName(tour) }}</div>
                                  <template v-if="!isPrivateTour">
                                    <span class="pass-price">{{ currentCurrencySymbol }}{{ adultPrice }}<small>{{ $t('tourDetail.pricePerAdult') }}</small></span>
                                    <span class="pass-price" style="margin-left:12px;">{{ currentCurrencySymbol }}{{ childPrice }}<small>{{ $t('tourDetail.pricePerChild') }}</small></span>
                                    <span class="pass-price" style="margin-left:12px;">{{ currentCurrencySymbol }}{{ infantPrice }}<small>{{ $t('tourDetail.pricePerInfant') }}</small></span>
                                  </template>
                                  <template v-else>
                                    <span class="pass-price">{{ currentCurrencySymbol }}{{ adultPrice }}<small>{{ $t('tourDetail.privateTourPrice') }}</small></span>
                                  </template>
                                </div>
                                <div v-if="!isPrivateTour" class="quantity-row" style="display: flex; gap: 16px; align-items: flex-start; justify-content: flex-start; margin-bottom: 12px;">
                                   <!-- Desktop layout -->
                                   <div class="desktop-quantity-controls" style="display:flex;flex-direction:column;gap:3px; min-width: 110px;">
                                     <div style="display:flex;align-items:center;gap:6px;">
                                       <span style="width:50px; font-size: 1.1rem; font-weight: 500;">{{ $t('tourDetail.adult') }}</span>
                                       <button @click="decrement('adult')" :disabled="adultQuantity <= 0" style="width:32px; height:32px; font-size: 18px; padding: 0; border-radius: 6px; background: #f2f2f2; border: none; cursor: pointer; transition: background 0.2s;">-</button>
                                       <span style="width:30px; text-align:center; font-size: 1.1rem; font-weight: 500;">{{ adultQuantity }}</span>
                                       <button @click="increment('adult')" style="width:32px; height:32px; font-size: 18px; padding: 0; border-radius: 6px; background: #f2f2f2; border: none; cursor: pointer; transition: background 0.2s;">+</button>
                                     </div>
                                     <div style="color: #888; font-size: 0.85rem; margin-left: 50px;">
                                       {{ $t('tourDetail.age7plus') }}
                                     </div>
                                   </div>
                                   <div class="desktop-quantity-controls" style="display:flex;flex-direction:column;gap:3px; min-width: 110px;">
                                     <div style="display:flex;align-items:center;gap:6px;">
                                       <span style="width:50px; font-size: 1.1rem; font-weight: 500;">{{ $t('tourDetail.child') }}</span>
                                       <button @click="decrement('child')" :disabled="childQuantity <= 0" style="width:32px; height:32px; font-size: 18px; padding: 0; border-radius: 6px; background: #f2f2f2; border: none; cursor: pointer; transition: background 0.2s;">-</button>
                                       <span style="width:30px; text-align:center; font-size: 1.1rem; font-weight: 500;">{{ childQuantity }}</span>
                                       <button @click="increment('child')" style="width:32px; height:32px; font-size: 18px; padding: 0; border-radius: 6px; background: #f2f2f2; border: none; cursor: pointer; transition: background 0.2s;">+</button>
                                     </div>
                                     <div style="color: #888; font-size: 0.85rem; margin-left: 50px;">
                                       {{ $t('tourDetail.age3to6') }}
                                     </div>
                                   </div>
                                                                        <div class="desktop-quantity-controls" style="display:flex;flex-direction:column;gap:3px; min-width: 110px;">
                                       <div style="display:flex;align-items:center;gap:6px;">
                                         <span style="width:50px; font-size: 1.1rem; font-weight: 500;">{{ $t('tourDetail.infant') }}</span>
                                       <button @click="decrement('infant')" :disabled="infantQuantity <= 0" style="width:32px; height:32px; font-size: 18px; padding: 0; border-radius: 6px; background: #f2f2f2; border: none; cursor: pointer; transition: background 0.2s;">-</button>
                                       <span style="width:30px; text-align:center; font-size: 1.1rem; font-weight: 500;">{{ infantQuantity }}</span>
                                       <button @click="increment('infant')" style="width:32px; height:32px; font-size: 18px; padding: 0; border-radius: 6px; background: #f2f2f2; border: none; cursor: pointer; transition: background 0.2s;">+</button>
                                     </div>
                                     <div style="color: #888; font-size: 0.85rem; margin-left: 50px;">
                                       {{ $t('tourDetail.age0to2') }}
                                     </div>
                                   </div>
                                   
                                   <!-- Mobile layout -->
                                   <div class="mobile-quantity-controls" style="display: none; flex-direction: column; width: 100%;">
                                     <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0;">
                                       <span style="font-size: 1.1rem; font-weight: 500;">{{ $t('tourDetail.adult') }}</span>
                                       <div style="display: flex; align-items: center; gap: 12px;">
                                         <button @click="decrement('adult')" :disabled="adultQuantity <= 0" style="width:44px; height:44px; font-size: 20px; padding: 0; border-radius: 8px; background: #f2f2f2; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center;">-</button>
                                         <span style="width:40px; text-align:center; font-size: 1.2rem; font-weight: 600;">{{ adultQuantity }}</span>
                                         <button @click="increment('adult')" style="width:44px; height:44px; font-size: 20px; padding: 0; border-radius: 8px; background: #f2f2f2; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center;">+</button>
                                       </div>
                                     </div>
                                     <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0;">
                                       <span style="font-size: 1.1rem; font-weight: 500;">{{ $t('tourDetail.child') }}</span>
                                       <div style="display: flex; align-items: center; gap: 12px;">
                                         <button @click="decrement('child')" :disabled="childQuantity <= 0" style="width:44px; height:44px; font-size: 20px; padding: 0; border-radius: 8px; background: #f2f2f2; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center;">-</button>
                                         <span style="width:40px; text-align:center; font-size: 1.2rem; font-weight: 600;">{{ childQuantity }}</span>
                                         <button @click="increment('child')" style="width:44px; height:44px; font-size: 20px; padding: 0; border-radius: 8px; background: #f2f2f2; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center;">+</button>
                                       </div>
                                     </div>
                                     <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0;">
                                       <div style="display: flex; flex-direction: column; gap: 2px;">
                                         <span style="font-size: 1.1rem; font-weight: 500;">{{ $t('tourDetail.infant') }}</span>
                                         <span style="color: #888; font-size: 0.85rem;">{{ $t('tourDetail.age0to2') }}</span>
                                       </div>
                                       <div style="display: flex; align-items: center; gap: 12px;">
                                         <button @click="decrement('infant')" :disabled="infantQuantity <= 0" style="width:44px; height:44px; font-size: 20px; padding: 0; border-radius: 8px; background: #f2f2f2; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center;">-</button>
                                         <span style="width:40px; text-align:center; font-size: 1.2rem; font-weight: 600;">{{ infantQuantity }}</span>
                                         <button @click="increment('infant')" style="width:44px; height:44px; font-size: 20px; padding: 0; border-radius: 8px; background: #f2f2f2; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center;">+</button>
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                                 
                                 <div v-else class="private-tour-info" style="padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 12px; text-align: center; color: #666;">
                                   <p style="margin: 0; font-size: 0.95rem;">{{ $t('tourDetail.privateTourInfo') }}</p>
                                 </div>
                                <div class="price-summary">
                                  <div class="old-price" v-if="getOldTourPrice(tour)"><s>{{ getOldTourPrice(tour) }}</s></div>
                                  <div class="discount" v-if="getDiscount(tour)"><span>Sale Discount</span><span>-{{ getDiscount(tour) }}</span></div>
                                </div>
                                <hr />                    
                                <div class="order-total-row">
                                  <span>{{ $t('tourDetail.orderTotal') }}</span>
                                  <span class="order-total">{{ orderTotal }}</span>
                                </div>
                                <div class="tax-note">{{ $t('tourDetail.taxesIncluded') }}</div>
                                <input type="email" :placeholder="$t('tourDetail.emailAddress')" class="input" v-model="email" />
                                <div class="date-input-wrapper" ref="dateInputWrapper">
                                  <input
                                    type="text"
                                    class="input date-input"
                                    :value="startDate"
                                    placeholder="gg.aa.yyyy"
                                    readonly
                                    @click="openDatePicker"
                                    style="background:#f7f7f7; color:#222; padding-right:36px;"
                                  />
                                  <span class="calendar-icon" @click="openDatePicker">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                                      <rect x="3" y="5" width="18" height="16" rx="2" stroke="#FC6421" stroke-width="2"/>
                                      <path d="M16 3v4M8 3v4" stroke="#FC6421" stroke-width="2" stroke-linecap="round"/>
                                      <path d="M3 9h18" stroke="#FC6421" stroke-width="2"/>
                                    </svg>
                                  </span>
                                  <ElDatePicker
                                    v-if="!isMobile"
                                    ref="pickerRef"
                                    v-model="startDate"
                                    type="date"
                                    format="YYYY-MM-DD"
                                    value-format="YYYY-MM-DD"
                                    :teleported="false"
                                    :editable="false"
                                    :input-visible="false"
                                    :disabled-date="disablePastDates"
                                    popper-class="custom-datepicker-popper"
                                    :popper-options="{ placement: 'bottom-start' }"
                                    style="opacity:0; pointer-events:none; position:absolute; left:0; top:0; width:100%;"
                                    @change="onDateChange"
                                  />
                                  <!-- Mobilde tam ekran ve scrollable v-calendar -->
                                  <div v-if="isMobile && showDatePicker" class="mobile-calendar-modal">
                                    <div class="calendar-modal-header">
                                      <span>{{ $t('tourDetail.pickDate') }}</span>
                                      <button class="calendar-modal-close" @click="showDatePicker = false">&times;</button>
                                    </div>
                                    <div class="calendar-scroll-container">
                                      <Calendar
                                        :columns="1"
                                        :rows="9"
                                        :min-date="todayStr"
                                        :locale="'en-US'"
                                        @dayclick="onDayClick"
                                        class="vcalendar-mobile"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <button 
                                  class="pay-btn" 
                                  @click="proceedToBooking"
                                  :disabled="!isDateSelected"
                                  :class="{ 'disabled': !isDateSelected }"
                                >
                                  {{ isDateSelected ? $t('tourDetail.bookNow') : $t('tourDetail.pleaseSelectDate') }}
                                </button>
                                <div class="save-note" v-if="getDiscount(tour)"><b>{{ $t('tourDetail.save') }} {{ getDiscount(tour) }}</b> {{ $t('tourDetail.onThisTour') }}</div>
                              </div>
                              <!-- Rezervasyon/Ödeme Kutusu Son -->
            </div>
          </div>
       
        </div>
      </section>
    </div>

    <!-- Checkout Form Modal ve ilgili kodları tamamen kaldırıldı -->
    <!-- Lightbox Modal -->
    <div v-if="lightboxOpen" class="lightbox-modal" @click.self="closeModal">
      <button class="lightbox-arrow left" @click.stop="prevImg">&#8592;</button>
      <img :src="lightboxImages[lightboxIndex]" class="lightbox-img" />
      <button class="lightbox-arrow right" @click.stop="nextImg">&#8594;</button>
      <button class="lightbox-close" @click="closeModal">&times;</button>
    </div>

    <!-- Mobilde sabit Book this tour butonu -->
    <button
      v-if="showStickyBookBtn && isMobile"
      class="sticky-book-btn"
      @click="scrollToBookingBox"
    >
      {{ $t('tourDetail.bookNow') }}
    </button>

    <!-- Mobilde Element Plus DatePicker tam ekran modal -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSelectedTourStore } from '../stores/selectedTour'
import { useCurrencyStore } from '../stores/currency'
import { useI18n } from 'vue-i18n'
import { ElDatePicker } from 'element-plus'
import 'element-plus/dist/index.css'
import { Calendar } from 'v-calendar';
import 'v-calendar/style.css';
import { onClickOutside } from '@vueuse/core'
import MobileAccordion from '../components/MobileAccordion.vue'

const { t } = useI18n()
const selectedTourStore = useSelectedTourStore()
const currencyStore = useCurrencyStore()

const route = useRoute()
const router = useRouter()
const activeTab = ref('overview')
const tour = ref(null)
const loading = ref(false)
const error = ref(null)

// Rezervasyon kutusu için state
const adultQuantity = ref(1)
const childQuantity = ref(0)
const infantQuantity = ref(0)

// Private tour kontrolü
const isPrivateTour = computed(() => {
  if (!tour.value) return false
  const tourName = getTourName(tour.value).toLowerCase()
  return tourName.includes('private')
})

const adultPrice = computed(() => {
  const price = tour.value?.tour_price?.[0]?.price
  return price ? parseFloat(price) : 0
})
const childPrice = computed(() => {
  const price = tour.value?.tour_price?.[0]?.price_child
  return price ? parseFloat(price) : 0
})
const infantPrice = computed(() => {
  const price = tour.value?.tour_price?.[0]?.price_child_infant
  return price ? parseFloat(price) : 0
})
const email = ref('')
const startDate = ref('')
const instantFee = computed(() => {
  // Instant fee şimdilik 0, testlerden sonra tekrar açılacak
  const instantFeeInEUR = 0
  const currentCurrencyCode = currencyStore.getCurrentCurrency()
  const convertedInstantFee = currencyStore.convertPrice(instantFeeInEUR, currentCurrencyCode)
  return currencyStore.formatPrice(convertedInstantFee, currentCurrencyCode)
})

const showDatePicker = ref(false)
const pickerRef = ref(null)
const isMobile = ref(false)
const todayStr = new Date().toISOString().slice(0, 10);
const aboutMaxHeight = 800 // px, show more/less için artırıldı
const bookingBox = ref(null)
const showStickyBookBtn = ref(true)

// Likely to sell out system
const sellOutInterval = ref(null)
const currentSellOutTourId = ref(null)

// Fetch tour data from API
const fetchTourData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'en'
    const currentCurrency = localStorage.getItem('selectedCurrency') || 'EUR'
    const languageId = getLanguageId(currentLanguage)
    const currencyId = getCurrencyId(currentCurrency)
    
    const url = `https://backend.searchyourtour.com/api/tours?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1&language_id=${languageId}&currency_id=${currencyId}&limit=100&IpAdrress=78.177.166.135`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch tour data')
    }
    
    const data = await response.json()
    const tourData = data.find(t => t.id.toString() === route.params.id)
    
    if (!tourData) {
      error.value = 'Tour not found'
      return
    }
    
    tour.value = tourData
    

  } catch (err) {
    error.value = 'Failed to load tour details. Please try again later.'
    console.error('Error fetching tour:', err)
  } finally {
    loading.value = false
  }
}

// Helper function to get language ID from language code
const getLanguageId = (langCode) => {
  const languageMap = {
    'tr': 2,    // Türkçe
    'de': 6,    // Deutsch
    'en': 1,    // English
    'ar': 3,    // العربية
    'es': 4,    // Español
    'fr': 5,    // Français
    'it': 7,    // Italiano
    'pt': 8,    // Português
    'zh': 10,   // 中文
    'ja': 11,   // 日本語
    'ru': 9     // Русский
  }
  return languageMap[langCode] || 1
}

// Helper function to get currency ID from currency code
const getCurrencyId = (currencyCode) => {
  const currencyMap = {
    'EUR': 4,
    'USD': 5,
    'GBP': 6,
    'TRY': 7
  }
  return currencyMap[currencyCode] || 4
}

// Helper function to get currency symbol from currency code
const getCurrencySymbol = (currencyCode) => {
  const currencyMap = {
    'TRY': '₺',
    'EUR': '€',
    'USD': '$',
    'GBP': '£',
    'RUB': '₽'
  }
  return currencyMap[currencyCode] || '€'
}

// Get current currency symbol - reactive
const currentCurrencySymbol = computed(() => {
  const currentCurrency = currencyStore.getCurrentCurrency()
  return getCurrencySymbol(currentCurrency)
})

// Check if we should add plural 's' to duration unit (only for English)
const shouldAddPluralS = computed(() => {
  const currentLanguage = localStorage.getItem('selectedLanguage') || 'en'
  return currentLanguage === 'en' && tour.value?.tour_duraction > 1
})

// Handle currency change
const handleCurrencyChange = () => {
  console.log('Currency changed, updating prices...')
  // Currency store'dan güncel kurları çek
  currencyStore.fetchCurrencies()
  // Tour data'yı yeniden çek (yeni currency ile)
  fetchTourData()
}

// Helper functions to extract data from API response
const getTourName = (tour) => {
  return tour.content?.[0]?.name || 'Unnamed Tour'
}

const getTourDescription = (tour) => {
  const metaContent = tour.content?.[0]?.meta_content
  if (!metaContent) return 'No description available'
  
  // Remove HTML tags and extract plain text
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = metaContent
  const text = tempDiv.textContent || tempDiv.innerText || ''
  return text.length > 200 ? text.substring(0, 200) + '...' : text
}

const getTourFullDescription = (tour) => {
  return tour.content?.[0]?.description || 'No detailed description available'
}
const getTourFullAdditionalInfo = (tour) => {
  return tour.content?.[0]?.additional || 'No additional info available'
}

const getTourImage = (tour) => {
  return tour.files?.[0]?.url || 'https://via.placeholder.com/800x500?text=No+Image'
}

const getDestinationName = (tour) => {
  return tour.destination?.name || 'Unknown Destination'
}

const getTourPrice = (tour) => {
  const price = tour.tour_price?.[0]
  if (!price) return 'Price on request'
  
  // Backend'den gelen fiyat zaten seçili currency'de, sadece formatla
  const currentCurrencyCode = currencyStore.getCurrentCurrency()
  const formattedPrice = currencyStore.formatPrice(price.price, currentCurrencyCode)
  
  return formattedPrice
}

const getOldTourPrice = (tour) => {
  const price = tour.tour_price?.[0]
  if (price && price.old_price && price.old_price > price.price) {
    // Backend'den gelen eski fiyat zaten seçili currency'de, sadece formatla
    const currentCurrencyCode = currencyStore.getCurrentCurrency()
    const formattedOldPrice = currencyStore.formatPrice(price.old_price, currentCurrencyCode)
    
    return formattedOldPrice
  }
  return null
}

const getDiscount = (tour) => {
  const price = tour.tour_price?.[0]
  if (price && price.old_price && price.old_price > price.price) {
    // Backend'den gelen fiyatlar zaten seçili currency'de, direkt hesapla
    const discount = price.old_price - price.price
    const currentCurrencyCode = currencyStore.getCurrentCurrency()
    const formattedDiscount = currencyStore.formatPrice(discount, currentCurrencyCode)
    
    return formattedDiscount
  }
  return null
}

const orderTotal = computed(() => {
  // Private tour ise sabit fiyat göster
  if (isPrivateTour.value) {
    const currentCurrencyCode = currencyStore.getCurrentCurrency()
    const formattedTotal = currencyStore.formatPrice(adultPrice.value, currentCurrencyCode)
    return formattedTotal
  }
  
  // Normal tour için mevcut hesaplama
  const adultTotal = parseFloat(adultQuantity.value) * parseFloat(adultPrice.value || 0)
  const childTotal = parseFloat(childQuantity.value) * parseFloat(childPrice.value || 0)
  const infantTotal = parseFloat(infantQuantity.value) * parseFloat(infantPrice.value || 0)
  
  // Instant fee şimdilik 0, testlerden sonra tekrar açılacak
  const instantFeeInEUR = 0
  const currentCurrencyCode = currencyStore.getCurrentCurrency()
  const convertedInstantFee = parseFloat(currencyStore.convertPrice(instantFeeInEUR, currentCurrencyCode))
  
  const total = adultTotal + childTotal + infantTotal + convertedInstantFee
  
  console.log('Price calculation:', {
    adultQuantity: adultQuantity.value,
    adultPrice: adultPrice.value,
    adultTotal,
    childQuantity: childQuantity.value,
    childPrice: childPrice.value,
    childTotal,
    infantQuantity: infantQuantity.value,
    infantPrice: infantPrice.value,
    infantTotal,
    instantFeeInEUR,
    convertedInstantFee,
    total,
    currentCurrencyCode
  })
  
  // Önyüzde gösterim için 2 basamak
  const formattedTotal = currencyStore.formatPrice(total, currentCurrencyCode)
  return formattedTotal
})

// Tarih seçilip seçilmediğini kontrol eden computed property
const isDateSelected = computed(() => {
  return startDate.value && startDate.value !== '' && startDate.value.trim() !== ''
})

const proceedToBooking = () => {
  if (!startDate.value || startDate.value === '' || startDate.value.trim() === '') {
    alert('Please select a date before proceeding to checkout');
    return;
  }
  if (tour.value) {
    // Private tour için participants bilgisini farklı göster
    let participantsText
    if (isPrivateTour.value) {
      participantsText = 'Private Tour'
    } else {
      participantsText = `${adultQuantity.value} adult${adultQuantity.value > 1 ? 's' : ''}${childQuantity.value > 0 ? ', ' + childQuantity.value + ' child' + (childQuantity.value > 1 ? 'ren' : '') : ''}${infantQuantity.value > 0 ? ', ' + infantQuantity.value + ' infant' + (infantQuantity.value > 1 ? 's' : '') : ''}`
    }
    
    selectedTourStore.setTour({
      id: tour.value.id,
      image: getTourImage(tour.value),
      title: getTourName(tour.value),
      description: getTourDescription(tour.value),
      date: startDate.value ? startDate.value : 'Select date',
      participants: participantsText,
      adult: isPrivateTour.value ? 1 : adultQuantity.value,
      child: isPrivateTour.value ? 0 : childQuantity.value,
      infant: isPrivateTour.value ? 0 : infantQuantity.value,
      rating: tour.value.rating || 4.6,
      reviewCount: tour.value.reviewCount || 1200,
      price: orderTotal.value,
      email: email.value,
      bookingDate: startDate.value,
      isPrivate: isPrivateTour.value
    })
    router.push('/checkout')
  }
}

// Methods
const bookTour = () => {
  console.log('Booking tour:', tour.value.id)
  // Implement booking logic
}

const addToWishlist = () => {
  console.log('Adding to wishlist:', tour.value.id)
  // Implement wishlist logic
}

const getAvailableDays = (tour) => {
  if (!tour.days || tour.days.length === 0) return 'Not specified'
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return tour.days.map(day => dayNames[day - 1]).join(', ')
}

const formatTourTime = (timeString) => {
  if (!timeString) return null
  
  // Eğer zaten HH:MM formatındaysa direkt döndür
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    return timeString
  }
  
  // Eğer HH:MM:SS formatındaysa saniye kısmını kaldır
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
    return timeString.substring(0, 5)
  }
  
  // Diğer durumlarda orijinal değeri döndür
  return timeString
}

const formatDuration = (duration, durationType) => {
  if (!duration) return null

  // Eğer zaten saat cinsindense direkt döndür
  if (durationType === 'hour') {
    const hours = Math.floor(duration)
    const minutes = Math.round((duration - hours) * 60)

    if (minutes === 0) {
      return `${hours} ${hours === 1 ? t('hour') : t('hours')}`
    } else {
      return `${hours} ${hours === 1 ? t('hour') : t('hours')} ${minutes} ${minutes === 1 ? t('minute') : t('minutes')}`
    }
  }

  // Eğer dakika cinsindense saate çevir
  if (durationType === 'minutes') {
    const totalMinutes = parseInt(duration)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours === 0) {
      return `${minutes} ${minutes === 1 ? t('minute') : t('minutes')}`
    } else if (minutes === 0) {
      return `${hours} ${hours === 1 ? t('hour') : t('hours')}`
    } else {
      return `${hours} ${hours === 1 ? t('hour') : t('hours')} ${minutes} ${minutes === 1 ? t('minute') : t('minutes')}`
    }
  }

  // Diğer durumlarda orijinal değeri döndür
  return `${duration} ${durationType}`
}

// Likely to sell out functions
const isLikelyToSellOut = computed(() => {
  return currentSellOutTourId.value === tour.value?.id
})

const rotateSellOutBadge = () => {
  if (!tour.value) return
  
  // Only set badge if this tour is the one selected in HomeView
  const existingBadgeData = localStorage.getItem('sellOutBadge')
  if (existingBadgeData) {
    try {
      const badgeData = JSON.parse(existingBadgeData)
      if (badgeData.tourId === tour.value.id) {
        currentSellOutTourId.value = tour.value.id
        console.log(`Tour detail "Likely to sell out" badge shown for tour ID: ${tour.value.id}`)
      } else {
        currentSellOutTourId.value = null
        console.log(`Tour detail "Likely to sell out" badge hidden - different tour selected`)
      }
    } catch (error) {
      console.warn('Error parsing badge data:', error)
      currentSellOutTourId.value = null
    }
  } else {
    currentSellOutTourId.value = null
    console.log(`Tour detail "Likely to sell out" badge hidden - no badge data`)
  }
}

const startSellOutRotation = () => {
  if (!tour.value) return
  
  // Clear any existing interval first
  if (sellOutInterval.value) {
    clearInterval(sellOutInterval.value)
    sellOutInterval.value = null
  }
  
  // Check if there's existing badge data in localStorage
  const existingBadgeData = localStorage.getItem('sellOutBadge')
  let interval = 0
  
  if (existingBadgeData) {
    try {
      const badgeData = JSON.parse(existingBadgeData)
      const timeElapsed = Date.now() - badgeData.timestamp
      
      // If the interval hasn't passed yet and it's the same tour, keep showing
      if (timeElapsed < badgeData.interval && badgeData.tourId === tour.value.id) {
        currentSellOutTourId.value = tour.value.id
        interval = badgeData.interval - timeElapsed
        
        const remainingHours = Math.round(interval / (60 * 60 * 1000) * 10) / 10
        console.log(`Tour detail "Likely to sell out" badge continuing for tour ID: ${tour.value.id}, remaining time: ${remainingHours} hours`)
      } else {
        // Either interval has passed or different tour - hide badge
        currentSellOutTourId.value = null
        console.log(`Tour detail "Likely to sell out" badge hidden - interval passed or different tour`)
      }
    } catch (error) {
      console.warn('Error parsing badge data from localStorage:', error)
      currentSellOutTourId.value = null
    }
  } else {
    // No badge data - hide badge
    currentSellOutTourId.value = null
    console.log(`Tour detail "Likely to sell out" badge hidden - no badge data`)
  }
  
  // Set up the interval for checking badge status (check every 30 seconds)
  sellOutInterval.value = setInterval(() => {
    rotateSellOutBadge()
  }, 30000) // Check every 30 seconds
  
  console.log(`Tour detail sell out badge monitoring started`)
}

function increment(type) {
  if (type === 'adult') adultQuantity.value++
  else if (type === 'child') childQuantity.value++
  else if (type === 'infant') infantQuantity.value++
}

function decrement(type) {
  if (type === 'adult' && adultQuantity.value > 0) adultQuantity.value--
  else if (type === 'child' && childQuantity.value > 0) childQuantity.value--
  else if (type === 'infant' && infantQuantity.value > 0) infantQuantity.value--
}

// Lightbox state
const lightboxOpen = ref(false)
const lightboxImages = ref([])
const lightboxIndex = ref(0)
function openModal(imgOrIndex) {
  // Fotoğraf dizisini oluştur
  if (tour.value && tour.value.files && tour.value.files.length > 0) {
    lightboxImages.value = tour.value.files.map(f => f.url)
  } else if (tour.value && tour.value.files) {
    lightboxImages.value = [getTourImage(tour.value)]
  }
  // index veya url ile aç
  if (typeof imgOrIndex === 'number') {
    lightboxIndex.value = imgOrIndex
  } else {
    lightboxIndex.value = lightboxImages.value.indexOf(imgOrIndex)
  }
  if (lightboxIndex.value < 0) lightboxIndex.value = 0
  lightboxOpen.value = true
}
function closeModal() {
  lightboxOpen.value = false
}
function nextImg() {
  if (lightboxIndex.value < lightboxImages.value.length - 1) lightboxIndex.value++
  else lightboxIndex.value = 0
}
function prevImg() {
  if (lightboxIndex.value > 0) lightboxIndex.value--
  else lightboxIndex.value = lightboxImages.value.length - 1
}
// Klavye ile gezinme
function handleKeydown(e) {
  if (!lightboxOpen.value) return
  if (e.key === 'ArrowRight') nextImg()
  if (e.key === 'ArrowLeft') prevImg()
  if (e.key === 'Escape') closeModal()
}

const carouselIndex = ref(0)
const startX = ref(0)

function nextCarouselImg() {
  if (!tour.value || !tour.value.files) return
  if (carouselIndex.value < tour.value.files.length - 1) carouselIndex.value++
  else carouselIndex.value = 0
}
function prevCarouselImg() {
  if (!tour.value || !tour.value.files) return
  if (carouselIndex.value > 0) carouselIndex.value--
  else carouselIndex.value = tour.value.files.length - 1
}
function handleTouchStart(e) {
  startX.value = e.touches[0].clientX
}
function handleTouchEnd(e) {
  const endX = e.changedTouches[0].clientX
  if (startX.value - endX > 50) nextCarouselImg()
  else if (endX - startX.value > 50) prevCarouselImg()
}

// DatePicker'ı input ile tetiklemek için fonksiyonlar
function openDatePicker() {
  if (isMobile.value) {
    showDatePicker.value = true;
  } else {
    nextTick(() => {
      if (pickerRef.value) pickerRef.value.handleOpen();
    });
  }
}
function onDateChange(val) {
  showDatePicker.value = false;
}

function onDayClick(day) {
  if (!day || !day.id) return;
  // Seçilen gün bugünden küçükse izin verme
  if (day.id < todayStr) return;
  startDate.value = day.id;
  showDatePicker.value = false;
}

// Masaüstü için bugünden önceki tarihleri devre dışı bırak
function disablePastDates(date) {
  const today = new Date();
  today.setHours(0,0,0,0);
  return date < today;
}

function scrollToBookingBox() {
  nextTick(() => {
    if (bookingBox.value) {
      bookingBox.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

function handleScroll() {
  if (!isMobile.value || !bookingBox.value) return;
  const rect = bookingBox.value.getBoundingClientRect();
  // bookingBox görünürse butonu gizle, değilse göster
  showStickyBookBtn.value = !(rect.top < window.innerHeight && rect.bottom > 0);
}

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 1150;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', handleScroll);
  // Temizlik
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('scroll', handleScroll);
  });
})
// Listen for language change events
const handleLanguageChange = (event) => {
  if (event.detail && event.detail.language) {
    console.log('Language changed to:', event.detail.language)
    // Clear existing badge data for new language
    localStorage.removeItem('sellOutBadge')
    fetchTourData() // Refetch tour data with new language
  }
}



// Lifecycle
onMounted(() => {
  // Initialize currency store
  currencyStore.fetchCurrencies()
  fetchTourData()
  // Add event listeners for language and currency changes
  window.addEventListener('language-changed', handleLanguageChange)
  window.addEventListener('currency-changed', handleCurrencyChange)
  
  // Start sell out badge rotation after tour is loaded
  watch(tour, (newTour) => {
    if (newTour && !sellOutInterval.value) {
      startSellOutRotation()
    }
  }, { immediate: true })
})

onUnmounted(() => {
  // Remove event listeners
  window.removeEventListener('language-changed', handleLanguageChange)
  window.removeEventListener('currency-changed', handleCurrencyChange)
  
  // Clear sell out interval
  if (sellOutInterval.value) {
    clearInterval(sellOutInterval.value)
    sellOutInterval.value = null
  }
})
</script>

<style scoped>
.tour-detail {
  min-height: 100vh;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #fc6421;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 4rem 0;
  color: #fc6421;
}

.error-state p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

/* Hero Section */
.tour-hero {
  background: #f8f9fa;
  padding: 2rem 0;
}

.tour-hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}


.content-row {
  display: grid;
  grid-template-columns: 2.5fr 1.5fr;
  gap: 3rem;
  align-items: start;
}
.content-row-tabs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-row-booking {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


.tour-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.image-gallery.desktop-only {
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-top: 12px;
  justify-content: flex-start;
}
.gallery-item img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.3s ease, box-shadow 0.2s;
  border: 2px solid #fff;
  box-shadow: 0 1px 6px #0001;
}
.gallery-item img:hover {
  opacity: 0.8;
  box-shadow: 0 2px 12px #fc642133;
  border: 2px solid #fc6421;
}

.tour-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.breadcrumb a {
  color: #fc6421;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.tour-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  line-height: 0.8;
}

.tour-meta {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.tour-meta > div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.sell-out-badge-detail{
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff !important;
  background-color: #ff0000;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.rating {
  color: #fc6421;
  font-weight: 600;
}

.review-count {
  color: #666;
  font-weight: normal;
}

.tour-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
}

.tour-highlights h3 {
  margin-bottom: 1rem;
  color: #333;
}

.tour-highlights ul {
  list-style: none;
  padding: 0;
}

.tour-highlights li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.tour-highlights li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #27ae60;
  font-weight: bold;
}

.tour-price-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.price-info {
  margin-bottom: 1.5rem;
}

.price {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #fc6421;
}

.price-per-person {
  color: #666;
  font-size: 0.9rem;
}

.tour-actions {
  display: flex;
  gap: 1rem;
}

.book-btn {
  flex: 1;
  padding: 1rem;
  font-size: 1.1rem;
}

/* Tabs */
.tour-details {
  padding: 3rem 0;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #eee;
  margin-bottom: 2rem;
}

.tab-btn {
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: #fc6421;
}

.tab-btn.active {
  color: #fc6421;
  border-bottom-color: #fc6421;
}

.tab-panel {
  min-height: 400px;
}

/* Overview Tab */
.overview-content {
  display: block;
}

.overview-text h3 {
  margin-bottom: 1rem;
  color: #333;
}

.overview-text :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #555;
}

.overview-text :deep(h2) {
  margin: 2rem 0 1rem;
  color: #333;
  font-size: 1.5rem;
}

.overview-text :deep(h3) {
  margin: 1.5rem 0 1rem;
  color: #333;
  font-size: 1.2rem;
}

.overview-text :deep(ul) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.overview-text :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}


.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.info-card h4 {
  margin-bottom: 1rem;
  color: #333;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: #666;
}

.info-item i {
  color: #fc6421;
  width: 20px;
}

/* Inclusions Tab */
.inclusions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.inclusions-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.inclusions-list,
.exclusions-list {
  list-style: none;
  padding: 0;
}

.inclusions-list li,
.exclusions-list li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.inclusions-list li::before {
  content: none;
}

.exclusions-list li::before {
  content: none;
}

/* Additional Info Tab */
.additional-info {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.info-section h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.detail-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item strong {
  color: #333;
}

.status-active {
  color: #27ae60;
  font-weight: 600;
}

.status-inactive {
  color: #fc6421;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 1150px) {
  .tour-detail {
    min-height: 100vh;
    padding: 0;
    background: #f8f9fa;
  }
  .tour-hero {
    padding: 0.7rem 0 0.2rem 0;
  }
  .tour-hero-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .main-image img {
    width: calc(100vw - 8px);
    max-width: calc(100vw - 8px);
    margin-left: 4px;
    margin-right: 4px;
    height: 160px;
    border-radius: 12px;
    object-fit: cover;
    display: block;
  }
  .image-gallery {
    display: flex;
    gap: 0.3rem;
    margin-top: 0.3rem;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-left: 4px;
  }
  .gallery-item img {
    width: 80px;
    max-width: 80vw;
    height: 48px;
    border-radius: 7px;
    object-fit: cover;
    display: block;
  }
  .tour-info {
    gap: 0.7rem;
    padding: 0.2rem 0.1rem;
  }
  .breadcrumb {
    font-size: 0.85rem;
    gap: 0.3rem;
  }
  .tour-title {
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
    line-height: 1.2;
  }
  .tour-meta {
    flex-direction: row;
    gap: 0.4rem;
    font-size: 0.93rem;
    margin-bottom: 0.4rem;
    flex-wrap: wrap;
  }
  .tour-description {
    font-size: 0.98rem;
    line-height: 1.4;
    margin-bottom: 0.7rem;
  }
  .info-card {
    padding: 0.7rem;
    border-radius: 9px;
    font-size: 0.93rem;
    margin-bottom: 0.7rem;
  }
  .tour-details {
    padding: 0.7rem 0 0.2rem 0;
  }
  .content-row {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }
  .content-row-tabs, .content-row-booking {
    width: 100%;
    padding: 0;
    margin: 0;
  }
  .tabs {
    flex-wrap: wrap;
    border-bottom-width: 1px;
    margin-bottom: 0.7rem;
    gap: 0.2rem;
  }
  .tab-btn {
    flex: 1;
    min-width: 90px;
    font-size: 0.98rem;
    padding: 0.5rem 0.2rem;
  }
  .tab-panel {
    min-height: 120px;
    padding: 0.2rem 0;
  }
  .overview-content {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .overview-text h3 {
    font-size: 1rem;
    margin-bottom: 0.4rem;
  }
  .inclusions-grid {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .inclusions-section h3 {
    font-size: 1rem;
    margin-bottom: 0.4rem;
  }
  .inclusions-list li, .exclusions-list li {
    font-size: 0.93rem;
    padding-left: 0.7rem;
  }
  .additional-info {
    padding: 0.7rem;
    border-radius: 9px;
    font-size: 0.93rem;
  }
  .info-section h3 {
    font-size: 1rem;
    margin-bottom: 0.7rem;
  }
  .detail-item {
    font-size: 0.93rem;
    padding: 0.3rem 0;
  }
  .pass-box {
    padding: 10px 4px;
    border-radius: 10px;
    margin-top: 0.7rem;
    max-width: 100%;
    min-width: 0;
    box-shadow: 0 1px 6px #0001;
  }
  .pass-box h2 {
    font-size: 1rem;
    padding: 7px;
    height: auto;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  }
  .pass-select-row, .fee-row, .eco-row, .order-total-row {
    font-size: 0.98rem;
    gap: 0.2rem;
  }
  .input {
    font-size: 0.98rem;
    padding: 6px 7px;
    border-radius: 6px;
  }
  .pay-btn {
    font-size: 0.98rem;
    padding: 7px 0;
    border-radius: 6px;
    margin: 7px 0;
  }
  .save-note {
    font-size: 0.93rem;
    padding: 4px 6px;
    border-radius: 6px;
  }
  .checkout-content {
    padding: 0.5rem;
    border-radius: 6px;
    max-width: 99vw;
    min-width: 0;
  }
  /* Tarih inputu artık pointer-events: none değil, tıklanabilir ve readonly olacak */
}

/* IstanbulPassView.vue ile uyumlu ödeme kutusu stilleri */
.pass-box {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 32px 24px;
  max-width: 100%;
  min-width: 100%;
  font-family: 'GT-Eesti', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-top: 0.5rem;
  border: 1px solid #FC6421;
}
.pass-box h2 {
  font-size: 2rem;
  margin-bottom: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  color: #fff;
  background: #FC6421;
  padding: 20px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  font-size: 32px;
  font-weight: 700;
  height: 63px;
}
.pass-select-row {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.pass-select {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  font-size: 1rem;
  background: #f7f7f7;
}
.pass-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
}
.quantity-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.quantity-row button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f2f2f2;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
}
.quantity-row button:disabled {
  background: #eee;
  cursor: not-allowed;
}
.price-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}
.old-price {
  color: #aaa;
  font-size: 1rem;
}
.new-price {
  color: #FC6421;
  font-size: 1.3rem;
  font-weight: 700;
}
.discount {
  color: #FC6421;
  font-size: 1rem;
}
.fee-row, .eco-row, .order-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}
.eco-icon {
  font-size: 1.2rem;
}
.order-total {
  font-size: 1.4rem;
  font-weight: 700;
  color: #222;
}
.tax-note {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 10px;
}
.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  margin-bottom: 10px;
  font-size: 1rem;
  font-family: 'GT-Eesti', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.pay-btn {
  width: 100%;
  background: #FC6421;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'GT-Eesti', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border: none;
  border-radius: 10px;
  padding: 14px 0;
  margin: 12px 0;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(230,0,76,0.08);
}
.pay-btn:hover {
  background: #c4003c;
}
.save-note {
  background: #f7f7f7;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1rem;
  color: #222;
  margin-top: 8px;
  text-align: center;
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 12px 0;
}
.info {
  font-size: 0.9em;
  color: #888;
  cursor: pointer;
  margin-left: 4px;
}
@media (max-width: 900px) {
  .tour-hero-content { flex-direction: column; display: flex; }
  .pass-box { max-width: 100%; min-width: 0; }
}

/* Checkout Form Modal */
.checkout-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkout-content {
  position: relative;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 32px 24px;
  min-width: 1500px;
  max-width: 1000px;
  min-height: 800px;
  max-height: 400vh;
  overflow: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.close-btn-modal {
  position: absolute;
  top: 24px;
  right: 36px;
  font-size: 2.2rem;
  color: #888;
  cursor: pointer;
  z-index: 1001;
  background: none;
  border: none;
  transition: color 0.2s;
}

.close-btn-modal:hover {
  color: #e6004c;
}

.checkout-content h2 {
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 700;
}
.lightbox-modal {
  position: fixed;
  left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.lightbox-img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: 0 4px 32px #000a;
}
.lightbox-close {
  position: absolute;
  top: 32px;
  right: 48px;
  font-size: 2.5rem;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10000;
}
.lightbox-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2.5rem;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10001;
  padding: 0 18px;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.lightbox-arrow.left { left: 24px; }
.lightbox-arrow.right { right: 24px; }
.lightbox-arrow:hover { opacity: 1; }

.desktop-only { display: block; }
.mobile-only { display: none; }

/* Quantity controls responsive styles */
.desktop-quantity-controls { display: flex; }
.mobile-quantity-controls { display: none; }
@media (max-width: 1150px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: block !important; }
  
  /* Quantity controls mobile styles */
  .desktop-quantity-controls { display: none !important; }
  .mobile-quantity-controls { display: flex !important; }
  .mobile-carousel {
    position: relative;
    width: 100%;
    text-align: center;
    margin-bottom: 8px;
  }
  .carousel-img {
    width: 100vw;
    height: 280px;
    object-fit: cover;
    border-radius: 4px;
    display: block;
    margin: 0 auto;
  }
  .carousel-arrow {
    width: 40px;
    height: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    cursor: pointer;
    transition: box-shadow 0.2s;
  }
  .carousel-arrow svg {
    display: block;
  }
  .carousel-arrow:hover svg circle {
    fill-opacity: 1;
    stroke: #fc6421;
    stroke-width: 1.5;
  }
  .carousel-arrow.left { left: 8px; }
  .carousel-arrow.right { right: 8px; }
  .carousel-indicator {
    position: absolute;
    bottom: 8px;
    right: 16px;
    background: #000a;
    color: #fff;
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 0.9rem;
  }
     .quantity-row button {
     width: 36px;
     height: 36px;
     border-radius: 6px;
     border: none;
     background: #f2f2f2;
     font-size: 1.4rem;
     cursor: pointer;
     transition: background 0.2s;
     display: flex;
     align-items: center;
     justify-content: center;
     padding: 0;
   }
}
.date-input-wrapper {
  position: relative;
  width: 100%;
}
.date-input-wrapper .date-input {
  width: 100%;
  box-sizing: border-box;
  background: #f7f7f7;
  color: #222;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 1rem;
  padding: 10px 36px 10px 12px;
  margin-bottom: 0;
  transition: border 0.2s;
}
.date-input-wrapper .date-input:focus {
  border: 1.5px solid #fc6421;
  outline: none;
}
.calendar-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  padding: 2px;
  transition: background 0.2s;
}
.calendar-icon:hover {
  background: #ffe5d1;
}
.mobile-calendar-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  margin: 0;
  padding: 0;
  border-radius: 0;
  box-sizing: border-box;
  z-index: 99999;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.calendar-modal-header {
  width: 100vw;
  padding: 18px 0 8px 0;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 2;
  border-bottom: 1px solid #eee;
}
.calendar-modal-close {
  position: absolute;
  right: 12px;
  top: 8px;
  font-size: 2rem;
  background: none;
  border: none;
  color: #fc6421;
  cursor: pointer;
  z-index: 3;
  padding: 0;
  line-height: 1;
}
.calendar-scroll-container {
  flex: 1;
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  padding: 0;
}
.vcalendar-mobile {
  width: 100vw !important;
  min-width: 100vw !important;
  max-width: 100vw !important;
  font-size: 0.98rem;
  box-sizing: border-box;
  padding: 0;
}
.vcalendar-mobile .vc-pane,
.vcalendar-mobile .vc-month {
  width: 100vw !important;
  min-width: 100vw !important;
  max-width: 100vw !important;
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0 !important;
}
.vcalendar-mobile .vc-weeks,
.vcalendar-mobile .vc-container {
  min-width: 100vw !important;
  width: 100vw !important;
  max-width: 100vw !important;
  box-sizing: border-box !important;
}
.mobile-calendar-modal,
.calendar-scroll-container,
.vcalendar-mobile {
  width: 100vw !important;
  min-width: 100vw !important;
  max-width: 100vw !important;
  height: 100vh !important;
  min-height: 100vh !important;
  max-height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 0 !important;
  box-sizing: border-box !important;
  background: #fff !important;
  overflow: auto !important;
}
html, body {
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.tour-description-html,
.tour-description-html *,
.tour-additional-html,
.tour-additional-html * {
  font-family: 'GT-Eesti', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
  font-size: 1.08rem;
  color: #222;
}

/* Disabled button styles */
.pay-btn.disabled {
  background: #ccc !important;
  cursor: not-allowed !important;
  opacity: 0.6;
}

.pay-btn.disabled:hover {
  background: #ccc !important;
  box-shadow: none !important;
}
.sticky-book-btn {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  z-index: 9999;
  background: #FC6421;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  border: none;
  border-radius: 12px 12px 12px 12px;
  padding: 18px 0;
  box-shadow: 0 -2px 12px #0002;
  transition: opacity 0.2s;
  display: none;
}
@media (max-width: 1150px) {
  .sticky-book-btn {
    display: block;
  }
}

.sell-out-badge-detail {
  background-color: #ff0000 !important;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
  margin-left: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>

<style>
.vcalendar-mobile .vc-weeks {
  min-width: 100vw !important;
  width: 100vw !important;
  max-width: 100vw !important;
  box-sizing: border-box !important;
}
</style>
