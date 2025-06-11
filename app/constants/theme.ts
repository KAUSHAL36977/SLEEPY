import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const COLORS = {
  primary: '#6200EE',
  secondary: '#03DAC6',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#B00020',
  text: {
    primary: '#000000',
    secondary: '#666666',
    disabled: '#999999',
    hint: '#666666',
  },
  status: {
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
  },
  sleep: {
    deep: '#1A237E',
    light: '#3949AB',
    rem: '#5C6BC0',
    awake: '#9FA8DA',
  },
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 6,
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
  maxWidth: 1200,
  containerPadding: 16,
  cardPadding: 16,
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
    background: COLORS.background,
    text: COLORS.text.primary,
    textSecondary: COLORS.text.secondary,
  },
  shadows: SHADOWS.small,
};

export const darkTheme = {
  colors: {
    ...COLORS,
    background: COLORS.background,
    text: COLORS.text.primary,
    textSecondary: COLORS.text.secondary,
  },
  shadows: SHADOWS.medium,
}; 