import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  TouchableOpacityProps,
  TextProps,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/theme';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// Styled Container
interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      {children}
    </View>
  );
};

// Styled Card
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  const { colors, shadows } = useTheme();
  return (
    <View 
      style={[
        styles.card,
        { 
          backgroundColor: colors.background.card.light,
          ...shadows.medium,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Styled Button
interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium',
  children,
  style,
  ...props 
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary.main,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary.main,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary.main,
        };
      default:
        return {};
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return styles.buttonSmall;
      case 'large':
        return styles.buttonLarge;
      default:
        return styles.buttonMedium;
    }
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.button,
          getButtonSize(),
          getButtonStyle(),
          style,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Styled Text
interface StyledTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: string;
}

export const StyledText: React.FC<StyledTextProps> = ({ 
  variant = 'body',
  color,
  style,
  ...props 
}) => {
  const { colors } = useTheme();

  const getTextStyle = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'caption':
        return styles.caption;
      default:
        return styles.body;
    }
  };

  return (
    <Text
      style={[
        getTextStyle(),
        { color: color || colors.text.primary.light },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  button: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  buttonMedium: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  buttonLarge: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  h1: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    lineHeight: TYPOGRAPHY.lineHeight.xxxl,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    lineHeight: TYPOGRAPHY.lineHeight.xxl,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    lineHeight: TYPOGRAPHY.lineHeight.xl,
    fontWeight: '600',
  },
  body: {
    fontSize: TYPOGRAPHY.fontSize.md,
    lineHeight: TYPOGRAPHY.lineHeight.md,
  },
  caption: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
  },
}); 