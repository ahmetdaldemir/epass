<template>
  <div class="mobile-accordion">
    <button class="accordion-header" @click="toggle">
      <span class="header-text"><slot name="header"></slot></span>
      <span class="arrow" :class="{ open: isOpen }">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
      </span>
    </button>
    <transition name="accordion">
      <div
        v-show="isOpen"
        class="accordion-body"
        ref="bodyRef"
        :style="showMoreLess && !showAll && isTruncated ? { maxHeight: maxHeight + 'px', overflow: 'hidden' } : {}"
      >
        <slot></slot>
        <template v-if="showMoreLess && isTruncated">
          <div class="show-more-less" @click.stop="toggleShowAll">
            <span>{{ showAll ? 'Show less' : 'Show more' }}</span>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
const props = defineProps({
  showMoreLess: Boolean,
  maxHeight: { type: Number, default: 180 },
  defaultOpen: { type: Boolean, default: false }
})
const isOpen = ref(props.defaultOpen)
const showAll = ref(false)
const bodyRef = ref(null)
const isTruncated = ref(false)
function toggle() { isOpen.value = !isOpen.value }
function toggleShowAll() { showAll.value = !showAll.value }
watch(isOpen, (val) => {
  if (val && props.showMoreLess) {
    nextTick(() => checkTruncate())
  }
})
function checkTruncate() {
  if (bodyRef.value && props.showMoreLess) {
    isTruncated.value = bodyRef.value.scrollHeight > props.maxHeight
  }
}
onMounted(() => { if (props.showMoreLess) checkTruncate() })
</script>
<style scoped>
.mobile-accordion {
  border-radius: 12px;
  box-shadow: 0 2px 12px #0001;
  background: #fff;
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid #eee;
}
.accordion-header {
  width: 100%;
  background: none;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px;
  font-size: 1.13rem;
  font-weight: 700;
  color: #222;
  cursor: pointer;
  transition: background 0.2s;
  background: #f7f7f7;
}
.accordion-header:hover {
  background: #ffe5d1;
}
.arrow {
  transition: transform 0.25s;
  display: flex;
  align-items: center;
}
.arrow.open {
  transform: rotate(180deg);
}
.accordion-body {
  padding: 16px 16px 10px 16px;
  font-size: 1.04rem;
  color: #222;
  background: #fff;
  transition: max-height 0.3s;
  overflow: hidden;
}
.show-more-less {
  text-align: center;
  color: #fc6421;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  user-select: none;
}
.accordion-enter-active, .accordion-leave-active {
  transition: max-height 0.3s cubic-bezier(.4,0,.2,1);
}
.accordion-enter-from, .accordion-leave-to {
  max-height: 0;
}
.accordion-enter-to, .accordion-leave-from {
  max-height: 800px;
}
</style> 