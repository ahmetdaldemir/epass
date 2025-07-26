<template>
  <div class="things-container">
    <h1>Things to Do in Istanbul</h1>
    <div class="subtitle">Explore the best places to visit and see in Istanbul</div>
    <div class="photo-placeholder">
      <!-- Replace the src below with your actual photo URL -->
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="Istanbul" />
    </div>
    <section>
      <h2>Must-See Places</h2>
      <ul>
        <li>Hagia Sophia</li>
        <li>Blue Mosque (Sultanahmet Camii)</li>
        <li>Topkapi Palace</li>
        <li>Grand Bazaar</li>
        <li>Bosphorus Cruise</li>
        <li>Galata Tower</li>
        <li>Dolmabahçe Palace</li>
        <li>Basilica Cistern</li>
        <li>Spice Bazaar</li>
        <li>Ortaköy Mosque & Square</li>
        <li>Balat & Fener Districts</li>
        <li>Princes' Islands</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.things-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 16px #0001;
  color: #222;
}
h1, h2 {
  color: #c0392b;
}
.subtitle {
  font-size: 1.1rem;
  color: #555;
  opacity: 0.8;
  margin-bottom: 1.5rem;
  font-weight: 500;
}
.photo-placeholder {
  text-align: center;
  margin-bottom: 2rem;
}
.photo-placeholder img {
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 16px #0001;
}
ul {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}
li {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}
section {
  margin-bottom: 2rem;
}
</style> 