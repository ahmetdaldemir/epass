# Istanbul Tourist Pass - Vue 3 Application

This project has been completely converted from a legacy HTML/jQuery structure to a modern Vue 3 application using the Composition API.

## 🚀 Features

- **Vue 3 Composition API**: Modern reactive programming with `ref`, `computed`, and lifecycle hooks
- **Vue Router 4**: Client-side routing with history mode
- **Component-Based Architecture**: Modular, reusable components
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Modern Styling**: Clean, modern UI with smooth animations
- **TypeScript Ready**: Easy to add TypeScript support

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── Header.vue      # Main navigation header
│   ├── Footer.vue      # Site footer
│   ├── LanguageSwitcher.vue  # Language selection component
│   └── MegaMenu.vue    # Navigation menu
├── views/              # Page components
│   ├── HomeView.vue    # Homepage
│   ├── IstanbulPassView.vue  # Pass selection page
│   ├── AttractionsView.vue   # Attractions listing
│   ├── ContactView.vue       # Contact form
│   ├── FAQsView.vue          # FAQ page
│   └── NotFoundView.vue      # 404 page
├── router/             # Vue Router configuration
│   └── index.js
├── assets/             # Static assets
│   └── main.css        # Global styles
├── App.vue             # Root component
└── main.js             # Application entry point
```

## 🛠️ Technologies Used

- **Vue 3.4+**: Latest Vue.js with Composition API
- **Vue Router 4**: Official router for Vue.js
- **Vite**: Fast build tool and dev server
- **Font Awesome**: Icon library
- **Flag Icons**: Country flag icons for language switcher

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd epass
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔧 Key Improvements Made

### 1. Modern Vue 3 Architecture
- Replaced Options API with Composition API
- Used `<script setup>` syntax for cleaner code
- Implemented proper reactive data management

### 2. Component-Based Structure
- Broke down the monolithic HTML into reusable components
- Created dedicated components for Header, Footer, LanguageSwitcher
- Implemented proper component communication with props and emits

### 3. Vue Router Integration
- Added client-side routing with Vue Router 4
- Replaced all `<a>` tags with `<router-link>` components
- Implemented proper navigation between pages

### 4. Modern Styling
- Removed inline styles and external CDN dependencies
- Implemented scoped CSS for components
- Added responsive design with CSS Grid and Flexbox
- Used modern CSS features like custom properties and transitions

### 5. Performance Optimizations
- Lazy loading of route components
- Optimized bundle size with tree shaking
- Removed unnecessary jQuery dependencies
- Implemented proper asset loading

## 🎨 Component Features

### Header Component
- Responsive navigation
- Language switcher integration
- Mobile menu support
- Sticky positioning

### LanguageSwitcher Component
- 25+ language options
- Flag icons for visual identification
- Local storage for language persistence
- Dropdown with click-outside handling

### HomeView Component
- Hero section with call-to-action
- Features grid with icons
- Attractions showcase
- Pass type comparison
- Customer testimonials

## 🔄 Migration Notes

### From Legacy to Vue 3
- **jQuery Removal**: Replaced jQuery DOM manipulation with Vue reactivity
- **Event Handling**: Converted inline `onclick` handlers to Vue event listeners
- **Data Management**: Moved from global variables to reactive refs
- **Styling**: Converted inline styles to scoped component styles
- **Navigation**: Replaced HTML links with Vue Router navigation

### External Dependencies
- **Font Awesome**: Loaded dynamically in App.vue
- **Flag Icons**: Added for language switcher
- **jQuery Plugins**: Kept for compatibility but loaded dynamically

## 🚀 Future Enhancements

- [ ] Add TypeScript support
- [ ] Implement state management with Pinia
- [ ] Add unit tests with Vitest
- [ ] Implement PWA features
- [ ] Add internationalization (i18n)
- [ ] Implement dark mode
- [ ] Add animations with Vue Transition

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This project has been successfully converted from a legacy HTML/jQuery application to a modern Vue 3 application while maintaining all original functionality and improving the user experience with modern web development practices. 