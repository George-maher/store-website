# D_Goy E-Commerce Platform

A modern, responsive e-commerce platform built with React, Vite, and Firebase. Features include product browsing, shopping cart, admin dashboard, and promotional offers slider.

## ✨ Features

- **Product Catalog**: Browse products with filtering and sorting capabilities
- **Shopping Cart**: Add/remove items, view cart contents
- **Admin Dashboard**: Secure admin access for managing products and offers
- **Offers Slider**: Interactive promotional banner with Swiper.js
- **Dark/Light Theme**: User preference persistence
- **Multi-language Support**: English/Arabic language toggle
- **Responsive Design**: Optimized for mobile and desktop views
- **Firebase Integration**: Authentication, Firestore database, and storage

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Framer Motion** - Animations
- **Swiper.js** - Touch-enabled slider
- **Lucide Icons** - Icon library
- **Cloudinary** - Image management
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

### State Management
- React Context API (Cart, Theme, Language)

### Backend & Services
- **Firebase**:
  - Authentication (Email/Password)
  - Firestore (NoSQL Database)
  - Storage (File uploads)
- **Vite Environment Variables** - Configuration management

### Development Tools
- ESLint - Code linting
- PostCSS, Autoprefixer - CSS processing

## 📁 Project Structure

```
d_goy/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── firebase.js     # Firebase configuration
│   ├── utils/          # Utility functions (translations)
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Entry point
│   ├── index.css       # Global styles
│   └── assets/         # Static assets
├── public/             # Public assets
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── postcss.config.cjs  # PostCSS configuration
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Firebase account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd d_goy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration:
     ```env
     VITE_ADMIN_EMAIL=your-admin-email@example.com
     VITE_ADMIN_PASSWORD=your-admin-password-here
     VITE_FIREBASE_API_KEY=your-firebase-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
     VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
     VITE_FIREBASE_APP_ID=your-firebase-app-id
     ```

4. **Firebase Setup**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
   - Enable Email/Password authentication
   - Create Firestore database (start in test mode)
   - Add your web app to get the configuration values
   - Create a `products` collection in Firestore with sample data

5. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🔐 Admin Access

1. Register a user with your admin email (set in `.env`)
2. Sign in at `/super-secret-login-8392jfks`
3. Access dashboard at `/br49_Tony_Degoy45`

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: ≥ 640px
- Desktop: ≥ 1024px
- Large Desktop: ≥ 1280px

## 🌐 Multi-language Support

The application supports English and Arabic:
- Toggle language in the navbar
- Text direction automatically adjusts (LTR/RTL)
- All UI text is translatable via the `useTranslation` hook

## 🎨 Theme Customization

- Dark/light mode toggle in navbar
- Theme preference saved to localStorage
- CSS variables for easy color customization
- Tailwind CSS utility classes for rapid styling

## 📦 Building for Production

```bash
npm run build
```

Outputs optimized static assets to the `dist/` directory.

Preview the production build:
```bash
npm run preview
```

## 🔒 Security Notes

- Never commit `.env` file with real credentials
- Firebase security rules should be configured for production
- Admin route is protected by email verification
- All sensitive data is stored in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Swiper.js](https://swiperjs.com/)
- [Lucide Icons](https://lucide.dev/)

---

*Built with ❤️ for modern e-commerce experiences*