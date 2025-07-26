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
    path: '/my-pass',
    name: 'my-pass',
    component: () => import('../views/MyPassView.vue')
  },
  {
    path: '/my-listing',
    name: 'my-listing',
    component: () => import('../views/MyListingView.vue')
  },
  {
    path: '/become-partner',
    name: 'become-partner',
    component: () => import('../views/BecomePartnerView.vue')
  },
  {
    path: '/security/terms-conditions',
    name: 'terms-conditions',
    component: () => import('../components/security/TermsAndConditions.vue')
  },
  {
    path: '/security/cookie-policy',
    name: 'cookie-policy',
    component: () => import('../components/security/CookiePolicy.vue')
  },
  {
    path: '/security/privacy-policy',
    name: 'privacy-policy',
    component: () => import('../components/security/PrivacyPolicy.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../components/security/AboutUs.vue')
  },
  {
    path: '/things-to-do-in-istanbul',
    name: 'things-to-do-in-istanbul',
    component: () => import('../components/pages/ThingsToDoInIstanbul.vue')
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