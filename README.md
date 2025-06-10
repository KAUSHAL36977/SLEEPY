# Sleepy - Your Personal Sleep Tracking App

Sleepy is a modern, user-friendly mobile application built with React Native and Expo that helps users track and improve their sleep patterns. The app provides features for monitoring sleep duration, quality, and habits to promote better sleep health.

## Features

- **Sleep Tracking**: Monitor your sleep duration and quality
- **Sleep Journal**: Record your sleep experiences and patterns
- **Progress Analytics**: View detailed sleep statistics and trends
- **Sleep Goals**: Set and track personalized sleep goals
- **User Profile**: Manage your sleep preferences and settings

## Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation
- Expo Router
- React Native Chart Kit
- AsyncStorage for local data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KAUSHAL36977/SLEEPY.git
cd SLEEPY
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## Project Structure

```
sleepy/
├── app/                 # Main application screens
│   ├── (tabs)/         # Tab-based navigation screens
│   └── _layout.tsx     # Root layout configuration
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── assets/            # Static assets (images, fonts)
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Charts powered by [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit) 