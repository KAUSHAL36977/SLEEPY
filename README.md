# Sleepy - Your Personal Sleep Assistant

Sleepy is a comprehensive sleep tracking and improvement application built with React Native and Expo. It helps users monitor their sleep patterns, track sleep habits, and receive personalized recommendations for better sleep quality.

## 🌟 Features

### Sleep Tracking
- Real-time sleep phase detection
- Snore detection and analysis
- Heart rate monitoring during sleep
- Sleep quality scoring
- Detailed sleep statistics and visualizations

### Sleep Habits Analysis
- Sleep schedule consistency tracking
- Bedtime routine monitoring
- Screen time tracking
- Physical activity correlation
- Stimulant intake tracking
- Sleep environment analysis
- Personalized recommendations

### User Interface
- Beautiful, modern design
- Dark/Light theme support
- Responsive layout
- Intuitive navigation
- Interactive visualizations

## 🚀 Getting Started

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
npx expo start
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## 📱 App Structure

```
app/
├── (tabs)/                 # Tab-based navigation
│   ├── _layout.tsx        # Tab navigation configuration
│   ├── index.tsx          # Home screen
│   ├── sleep-tracking.tsx # Sleep tracking screen
│   └── profile.tsx        # User profile screen
├── components/            # Reusable components
│   ├── styled/           # Styled components
│   ├── SleepTracking.tsx # Sleep tracking component
│   └── SleepVisualization.tsx # Sleep data visualization
├── constants/            # App constants
│   └── theme.ts         # Theme configuration
├── context/             # React Context
│   └── ThemeContext.tsx # Theme management
├── services/            # Business logic
│   ├── SleepTrackingService.ts  # Sleep tracking logic
│   └── SleepHabitsService.ts    # Sleep habits analysis
└── utils/              # Utility functions
    └── permissions.ts  # Permission handling
```

## 🎨 Design System

The app uses a comprehensive design system with:
- Consistent color palette
- Typography system
- Spacing and layout rules
- Component variants
- Animation presets
- Accessibility guidelines

## 🔧 Technical Stack

- React Native
- Expo
- TypeScript
- React Navigation
- Victory Native (Charts)
- React Native Sensors
- AsyncStorage
- React Native Voice

## 📊 Data Management

- Local storage for user preferences
- Real-time sensor data processing
- Sleep data analysis and scoring
- Habit tracking and recommendations

## 🔐 Permissions

The app requires the following permissions:
- Motion sensors
- Microphone (for snore detection)
- Notifications
- Background processing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under a Commercial Software License Agreement. All rights reserved. The software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

For licensing inquiries, please contact:
- Kaushal - [KAUSHAL36977](https://github.com/KAUSHAL36977)

## 👥 Authors

- Kaushal - Initial work - [KAUSHAL36977](https://github.com/KAUSHAL36977)

## 🙏 Acknowledgments

- React Native community
- Expo team
- All contributors and supporters 