import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/istanbul-pass',
    name: 'istanbul-pass',
    component: () => import('../views/IstanbulPassView.vue')
  },
  {
    path: '/attractions',
    name: 'attractions',
    component: () => import('../views/AttractionsView.vue')
  },
  {
    path: '/tours',
    name: 'tours',
    component: () => import('../views/ToursView.vue')
  },
  {
    path: '/tour/:id',
    name: 'tour-detail',
    component: () => import('../views/TourDetailView.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactView.vue')
  },
  {
    path: '/faqs',
    name: 'faqs',
    component: () => import('../views/FAQsView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 