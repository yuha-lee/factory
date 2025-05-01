import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export interface ContainerProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

export default function Container({ style, children }: ContainerProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    base: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
  });

  return <View style={[styles.base, style]}>{children}</View>;
}
