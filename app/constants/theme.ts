import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const COLORS = {
  // Primary colors
  primary: {
    light: '#6B8AFE',
    main: '#4A6CF7',
    dark: '#2A4CDB',
  },
  // Secondary colors
  secondary: {
    light: '#B4A5FD',
    main: '#8A6CF7',
    dark: '#6A4CDB',
  },
  // Background colors
  background: {
    light: '#FFFFFF',
    dark: '#121212',
    card: {
      light: 'rgba(255, 255, 255, 0.9)',
      dark: 'rgba(30, 30, 30, 0.9)',
    },
  },
  // Text colors
  text: {
    primary: {
      light: '#1A1A1A',
      dark: '#FFFFFF',
    },
    secondary: {
      light: '#666666',
      dark: '#B3B3B3',
    },
    disabled: {
      light: '#999999',
      dark: '#666666',
    },
  },
  // Status colors
  status: {
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
  },
  // Sleep-specific colors
  sleep: {
    deep: '#2C3E50',
    light: '#3498DB',
    rem: '#9B59B6',
    awake: '#E74C3C',
  },
};

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const SHADOWS = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  dark: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};

export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
  },
};

export const LAYOUT = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
};

export const ACCESSIBILITY = {
  minimumTapArea: 44,
  minimumTextSize: 16,
  minimumContrastRatio: 4.5,
};

// Theme configuration
export const lightTheme = {
  colors: {
    ...COLORS,
    background: COLORS.background.light,
    text: COLORS.text.primary.light,
    textSecondary: COLORS.text.secondary.light,
  },
  shadows: SHADOWS.light,
};

export const darkTheme = {
  colors: {
    ...COLORS,
    background: COLORS.background.dark,
    text: COLORS.text.primary.dark,
    textSecondary: COLORS.text.secondary.dark,
  },
  shadows: SHADOWS.dark,
}; 