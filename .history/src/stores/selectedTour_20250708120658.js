import { defineStore } from 'pinia'

export const useSelectedTourStore = defineStore('selectedTour', {
  state: () => ({
    tour: null
  }),
  actions: {
    setTour(tour) {
      this.tour = tour
    },
    clearTour() {
      this.tour = null
    }
  }
}) 