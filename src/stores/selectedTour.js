import { defineStore } from 'pinia'

export const useSelectedTourStore = defineStore('selectedTour', {
  state: () => ({
    tour: null,
    pass: null
  }),
  actions: {
    setTour(tour) {
      this.tour = tour
      this.pass = null // Tour seçildiğinde pass'i temizle
    },
    setPass(pass) {
      this.pass = pass
      this.tour = null // Pass seçildiğinde tour'u temizle
    },
    clearTour() {
      this.tour = null
    },
    clearPass() {
      this.pass = null
    },
    clearAll() {
      this.tour = null
      this.pass = null
    }
  }
}) 