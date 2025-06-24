<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <router-link to="/" class="btn btn-primary">Go Home</router-link>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
}
</style> 