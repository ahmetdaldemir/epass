<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <h1>{{ $t('notFound.title') }}</h1>
        <h2>{{ $t('notFound.subtitle') }}</h2>
        <p>{{ $t('notFound.description') }}</p>
        
        <div class="helpful-links">
          <h3>{{ $t('notFound.helpfulLinks.title') }}</h3>
          <div class="links-grid">
            <router-link to="/" class="helpful-link">
              <i class="fas fa-home"></i>
              <span>{{ $t('notFound.helpfulLinks.home') }}</span>
            </router-link>
            <router-link to="/istanbul-pass" class="helpful-link">
              <i class="fas fa-ticket-alt"></i>
              <span>{{ $t('notFound.helpfulLinks.istanbulPass') }}</span>
            </router-link>
            <router-link to="/attractions" class="helpful-link">
              <i class="fas fa-landmark"></i>
              <span>{{ $t('notFound.helpfulLinks.attractions') }}</span>
            </router-link>
            <router-link to="/tours" class="helpful-link">
              <i class="fas fa-map-marked-alt"></i>
              <span>{{ $t('notFound.helpfulLinks.tours') }}</span>
            </router-link>
            <router-link to="/contact" class="helpful-link">
              <i class="fas fa-envelope"></i>
              <span>{{ $t('notFound.helpfulLinks.contact') }}</span>
            </router-link>
            <router-link to="/faqs" class="helpful-link">
              <i class="fas fa-question-circle"></i>
              <span>{{ $t('notFound.helpfulLinks.faqs') }}</span>
            </router-link>
          </div>
        </div>
        
        <div class="cta-section">
          <p>{{ $t('notFound.cta.text') }}</p>
          <router-link to="/istanbul-pass" class="btn btn-primary">{{ $t('notFound.cta.button') }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed for this simple component
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #df3603 0%, #fc7100 100%);
  color: white;
  text-align: center;
}

.not-found-content h1 {
  font-size: 8rem;
  margin: 0;
  font-weight: 700;
}

.not-found-content h2 {
  font-size: 2rem;
  margin: 1rem 0;
}

.not-found-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.helpful-links {
  margin: 3rem 0;
}

.helpful-links h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.helpful-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.helpful-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  color: white;
  text-decoration: none;
}

.helpful-link i {
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

.cta-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-section p {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .links-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
  
  .helpful-link {
    padding: 0.8rem;
  }
  
  .not-found-content h1 {
    font-size: 6rem;
  }
  
  .not-found-content h2 {
    font-size: 1.5rem;
  }
}
</style> 