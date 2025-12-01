# Charlie Party

**AI Travel Concierge System** - A React Native mobile application built with Expo that helps users discover and explore events around the world.

## 🚀 Overview

Charlie Party is a comprehensive event discovery platform that leverages AI to provide personalized event recommendations based on user preferences, location, and interests. The app features a modern, intuitive interface with robust authentication, location services, and real-time event data.

## ✨ Features

### 🔐 Authentication & User Management

- **Multi-platform Sign-in**: Email/password, Google Sign-in, and Apple Sign-in
- **User Profiles**: Comprehensive user profiles with preferences and location data
- **KYC Integration**: Identity verification system for enhanced security
- **Account Management**: Profile customization and preference settings

### 🎯 Event Discovery

- **Smart Recommendations**: AI-powered event suggestions based on user preferences
- **Advanced Filtering**: Filter events by category, subcategory, vibe, venue type, and location
- **Real-time Search**: Live search functionality with instant results
- **Location-based Discovery**: Find events near you or in specific locations
- **Event Details**: Comprehensive event information including pricing, dates, and venue details

### 🗺️ Location Services

- **Interactive Maps**: Google Maps integration for location selection
- **Country & Region Selection**: Comprehensive location picker with country/region data
- **Address Search**: Google Places API integration for precise location input
- **Coordinate Support**: GPS coordinate handling for accurate positioning

### 🎨 User Experience

- **Modern UI/UX**: Clean, intuitive design with smooth animations
- **Responsive Design**: Optimized for various screen sizes
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Smooth Navigation**: Expo Router for seamless navigation experience
- **Loading States**: Comprehensive loading indicators and error handling

### 📱 Technical Features

- **Cross-platform**: iOS, Android, and Web support
- **Offline Support**: AsyncStorage for data persistence
- **Real-time Updates**: Live data synchronization
- **Image Handling**: Photo library and camera integration
- **Push Notifications**: Real-time event updates and notifications

## 🛠️ Tech Stack

### Frontend

- **React Native** (0.81.4) - Cross-platform mobile development
- **Expo** (~54.0.12) - Development platform and tools
- **Expo Router** (~6.0.10) - File-based routing system
- **TypeScript** (~5.9.2) - Type-safe JavaScript
- **NativeWind** (^4.2.1) - Tailwind CSS for React Native

### State Management

- **Redux Toolkit** (^2.9.0) - Predictable state container
- **React Redux** (^9.2.0) - React bindings for Redux

### UI Components

- **Expo Vector Icons** - Comprehensive icon library
- **Lottie React Native** - Smooth animations
- **React Native Reanimated** - Advanced animations
- **Expo Linear Gradient** - Gradient backgrounds

### Authentication & Services

- **Google Sign-in** - Google authentication
- **Apple Authentication** - Apple Sign-in support
- **JWT Decode** - Token handling
- **Axios** - HTTP client for API requests

### Location & Maps

- **Google Maps API** - Interactive maps and location services
- **React Native Country Picker** - Country selection component
- **Country Region Data** - Comprehensive location data

### Development Tools

- **ESLint** - Code linting and formatting
- **Babel** - JavaScript compiler
- **Metro** - React Native bundler
- **PostCSS** - CSS processing

## 📁 Project Structure

```
app/
├── api/                    # API configuration and scripts
│   ├── apis.ts            # API endpoint definitions
│   ├── AxiosInstance.ts   # HTTP client configuration
│   └── scripts/           # API service functions
│       ├── auth.ts        # Authentication services
│       ├── event.ts       # Event-related API calls
│       ├── user.ts        # User management APIs
│       └── upload.ts      # File upload services
├── app/                   # Application screens (Expo Router)
│   ├── auth/              # Authentication screens
│   ├── onboarding/       # User onboarding flow
│   ├── home.tsx          # Main home screen
│   └── start.tsx         # Welcome screen
├── components/            # Reusable UI components
│   ├── common/           # Basic UI components
│   ├── molecules/        # Composite components
│   ├── organisms/        # Complex components
│   └── providers/        # Context providers
├── constants/             # Application constants
├── hooks/                 # Custom React hooks
├── redux/                 # State management
│   ├── actions/          # Redux actions
│   ├── slices/           # Redux slices
│   └── store.ts          # Store configuration
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd charlie-party-v2/app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   - Update `constants/env.ts` with your API keys and endpoints
   - Configure Google Maps API key
   - Set up authentication credentials

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Run on specific platforms**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 🔧 Configuration

### Environment Setup

Update the following in `constants/env.ts`:

```typescript
export const GOOGLE_API_KEY = "your-google-maps-api-key";
export const SERVER_API_ENDPOINT = "your-backend-api-endpoint";
```

### Google Services Configuration

- Configure Google Sign-in credentials
- Set up Google Maps API
- Configure OAuth clients for different platforms

### App Configuration

Update `app.json` with your app-specific settings:

- Bundle identifiers
- App icons and splash screens
- Permissions and capabilities

## 📱 Platform Support

### iOS

- Minimum iOS version: 13.0
- Supports iPhone and iPad
- Apple Sign-in integration
- Location services support

### Android

- Minimum Android API level: 21
- Adaptive icons support
- Google Play Services integration
- Edge-to-edge display support

### Web

- Static web output
- Responsive design
- Progressive Web App capabilities

## 🔐 Authentication Flow

1. **Welcome Screen**: Users can choose to login or explore events
2. **Authentication**: Multiple sign-in options (Email, Google, Apple)
3. **Onboarding**: 5-step user preference setup
4. **Home Screen**: Personalized event feed

## 🎯 Event Discovery Flow

1. **Location Setup**: Country, region, and address selection
2. **Preferences**: Category, vibe, and venue type preferences
3. **Event Feed**: Personalized recommendations
4. **Filtering**: Advanced search and filter options
5. **Event Details**: Comprehensive event information

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📦 Building for Production

### iOS

```bash
# Build for iOS
eas build --platform ios
```

### Android

```bash
# Build for Android
eas build --platform android
```

### Web

```bash
# Build for web
npm run web
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation for common issues

## 🔮 Future Enhancements

- [ ] Social features and event sharing
- [ ] Advanced AI recommendations
- [ ] Event creation and management
- [ ] Chat and messaging features
- [ ] Payment integration
- [ ] Offline event caching
- [ ] Multi-language support

---

**Charlie Party** - Discover amazing events around the world with AI-powered recommendations! 🎉
