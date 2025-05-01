import React from 'react';
import { Text as ReactNativeText, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export interface TextProps {
  children: string;
  style?: TextStyle;
}

export default function Text({ children, style }: TextProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    base: {
      color: theme.colors.onBackground,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily,
      lineHeight: theme.typography.lineHeight.md,
    },
  });

  return <ReactNativeText style={[styles.base, style]}>{children}</ReactNativeText>;
}
