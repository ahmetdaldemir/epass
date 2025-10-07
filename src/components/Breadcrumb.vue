<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li 
        v-for="(item, index) in breadcrumbItems" 
        :key="item.path"
        class="breadcrumb-item"
        :class="{ 'breadcrumb-item--active': index === breadcrumbItems.length - 1 }"
      >
        <router-link 
          v-if="index < breadcrumbItems.length - 1"
          :to="item.path" 
          class="breadcrumb-link"
        >
          <svg v-if="index === 0" class="breadcrumb-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
          {{ item.title }}
        </router-link>
        <span v-else class="breadcrumb-current">
          {{ item.title }}
        </span>
        <svg 
          v-if="index < breadcrumbItems.length - 1"
          class="breadcrumb-separator" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
        >
          <polyline points="9,18 15,12 9,6"/>
        </svg>
      </li>
    </ol>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Breadcrumb',
  setup() {
    const route = useRoute()
    const { t } = useI18n()

    const breadcrumbItems = computed(() => {
      const items = []
      const pathSegments = route.path.split('/').filter(segment => segment)
      
      // Ana sayfa her zaman ilk sırada
      items.push({
        title: t('nav.home'),
        path: '/'
      })

      // Route meta bilgilerinden breadcrumb oluştur
      if (route.meta?.breadcrumb) {
        route.meta.breadcrumb.forEach(breadcrumb => {
          items.push({
            title: t(breadcrumb.title),
            path: breadcrumb.path
          })
        })
      } else {
        // Meta bilgi yoksa path'den otomatik oluştur
        let currentPath = ''
        pathSegments.forEach((segment, index) => {
          currentPath += `/${segment}`
          
          // Özel durumlar için title mapping
          let title = segment
          switch (segment) {
            case 'istanbul-pass':
              title = t('nav.istanbulPass')
              break
            case 'attractions':
              title = t('nav.attractions')
              break
            case 'tours':
              title = t('nav.tours')
              break
            case 'contact':
              title = t('nav.contact')
              break
            case 'faqs':
              title = t('nav.faqs')
              break
            case 'about':
              title = t('nav.about')
              break
            case 'become-partner':
              title = t('nav.becomePartner')
              break
            case 'my-pass':
              title = t('nav.myPass')
              break
            case 'my-listing':
              title = t('nav.myListing')
              break
            case 'blog':
              title = t('nav.blog')
              break
            case 'security':
              title = t('common.security')
              break
            case 'terms-conditions':
              title = t('common.terms')
              break
            case 'privacy-policy':
              title = t('common.privacy')
              break
            case 'cookie-policy':
              title = t('common.cookies')
              break
            default:
              // Parametreli route'lar için (örn: /tour/:id)
              if (route.params[segment]) {
                title = route.params[segment]
              } else {
                // İlk harfi büyük yap
                title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
              }
          }

          items.push({
            title,
            path: currentPath
          })
        })
      }

      return items
    })

    return {
      breadcrumbItems
    }
  }
}
</script>

<style scoped>
.breadcrumb {
  padding: 12px 0;
  margin-bottom: 20px;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 1.5;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;
}

.breadcrumb-link:hover {
  color: #3b82f6;
  background-color: #f3f4f6;
}

.breadcrumb-current {
  color: #374151;
  font-weight: 500;
  padding: 4px 8px;
}

.breadcrumb-icon {
  flex-shrink: 0;
  color: #6b7280;
}

.breadcrumb-separator {
  flex-shrink: 0;
  color: #9ca3af;
  margin: 0 4px;
}

.breadcrumb-item--active .breadcrumb-current {
  color: #1f2937;
}

/* Responsive */
@media (max-width: 768px) {
  .breadcrumb {
    padding: 8px 0;
    margin-bottom: 16px;
  }
  
  .breadcrumb-list {
    font-size: 13px;
  }
  
  .breadcrumb-link,
  .breadcrumb-current {
    padding: 2px 6px;
  }
  
  .breadcrumb-icon,
  .breadcrumb-separator {
    width: 14px;
    height: 14px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .breadcrumb-link {
    color: #9ca3af;
  }
  
  .breadcrumb-link:hover {
    color: #60a5fa;
    background-color: #374151;
  }
  
  .breadcrumb-current {
    color: #d1d5db;
  }
  
  .breadcrumb-item--active .breadcrumb-current {
    color: #f9fafb;
  }
  
  .breadcrumb-icon {
    color: #9ca3af;
  }
  
  .breadcrumb-separator {
    color: #6b7280;
  }
}
</style>
