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
    component: () => import('../views/IstanbulPassView.vue'),
    meta: {
      breadcrumb: [
        { title: 'nav.istanbulPass', path: '/istanbul-pass' }
      ]
    }
  },
  {
    path: '/attractions',
    name: 'attractions',
    component: () => import('../views/AttractionsView.vue'),
    meta: {
      breadcrumb: [
        { title: 'nav.attractions', path: '/attractions' }
      ]
    }
  },
  {
    path: '/tours',
    name: 'tours',
    component: () => import('../views/ToursView.vue'),
    meta: {
      breadcrumb: [
        { title: 'nav.tours', path: '/tours' }
      ]
    }
  },
  {
    path: '/tour/:slug/:id',
    name: 'tour-detail',
    component: () => import('../views/TourDetailView.vue'),
    meta: {
      breadcrumb: [
        { title: 'nav.tours', path: '/tours' },
        { title: 'tourDetail.title', path: '/tour/:slug/:id' }
      ]
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactView.vue'),
    meta: {
      breadcrumb: [
        { title: 'nav.contact', path: '/contact' }
      ]
    }
  },
  {
    path: '/faqs',
    name: 'faqs',
    component: () => import('../views/FAQsView.vue'),
    meta: {
      breadcrumb: [
        { title: 'nav.faqs', path: '/faqs' }
      ]
    }
  },
  {
    path: '/my-pass',
    name: 'my-pass',
    component: () => import('../views/MyPassView.vue'),
    meta: {
      breadcrumb: [
        { title: 'nav.myPass', path: '/my-pass' }
      ]
    }
  },
  {
    path: '/my-listing',
    name: 'my-listing',
    component: () => import('../views/MyListingView.vue'),
    meta: {
      breadcrumb: [
        { title: 'nav.myListing', path: '/my-listing' }
      ]
    }
  },
  {
    path: '/become-partner',
    name: 'become-partner',
    component: () => import('../views/BecomePartnerView.vue'),
    meta: {
      breadcrumb: [
        { title: 'nav.becomePartner', path: '/become-partner' }
      ]
    }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignUpView.vue'),
    meta: {
      breadcrumb: [
        { title: 'common.signup', path: '/signup' }
      ]
    }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: {
      breadcrumb: [
        { title: 'common.checkout', path: '/checkout' }
      ]
    }
  },
  {
    path: '/payment-success',
    name: 'payment-success',
    component: () => import('../views/PaymentSuccessView.vue'),
    meta: {
      breadcrumb: [
        { title: 'common.paymentSuccess', path: '/payment-success' }
      ]
    }
  },
  {
    path: '/security/terms-conditions',
    name: 'terms-conditions',
    component: () => import('../components/security/TermsAndConditions.vue'),
    meta: {
      breadcrumb: [
        { title: 'common.security', path: '/security' },
        { title: 'common.terms', path: '/security/terms-conditions' }
      ]
    }
  },
  {
    path: '/security/cookie-policy',
    name: 'cookie-policy',
    component: () => import('../components/security/CookiePolicy.vue'),
    meta: {
      breadcrumb: [
        { title: 'common.security', path: '/security' },
        { title: 'common.cookies', path: '/security/cookie-policy' }
      ]
    }
  },
  {
    path: '/security/privacy-policy',
    name: 'privacy-policy',
    component: () => import('../components/security/PrivacyPolicy.vue'),
    meta: {
      breadcrumb: [
        { title: 'common.security', path: '/security' },
        { title: 'common.privacy', path: '/security/privacy-policy' }
      ]
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../components/security/AboutUs.vue'),
    meta: {
      breadcrumb: [
        { title: 'nav.about', path: '/about' }
      ]
    }
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogView.vue'),
    meta: {
      breadcrumb: [
        { title: 'nav.blog', path: '/blog' }
      ]
    }
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('../views/BlogPostView.vue'),
    meta: {
      breadcrumb: [
        { title: 'nav.blog', path: '/blog' },
        { title: 'blog.post.title', path: '/blog/:slug' }
      ]
    }
  },
  {
    path: '/plan-save',
    name: 'plan-save',
    component: () => import('../views/PlanSaveView.vue'),
    meta: {
      breadcrumb: [
        { title: 'common.planSave', path: '/plan-save' }
      ]
    }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('../views/ResetPasswordView.vue'),
    meta: {
      breadcrumb: [
        { title: 'common.resetPassword', path: '/reset-password' }
      ]
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Her route değişiminde en başa kaydır
    return { top: 0 }
  }
})

export default router 