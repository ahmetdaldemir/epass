<template>
  <div class="accordion">
    <div class="accordion-header" @click="toggle">
      <slot name="header"></slot>
      <span class="arrow" :class="{ open: isOpen }">&#9660;</span>
    </div>
    <div class="accordion-body" v-show="isOpen">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
function toggle() { isOpen.value = !isOpen.value }
</script>
<style scoped>
.accordion-header { cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f7f7f7; border-radius: 8px; }
.accordion-body { padding: 12px; }
.arrow { transition: transform 0.2s; }
.arrow.open { transform: rotate(180deg); }
</style> 