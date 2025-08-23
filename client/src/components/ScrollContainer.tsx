import React from 'react';
import { ScrollView as ReactNativeScrollView, ScrollViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/theme/ThemeContext';

export default function ScrollView(props: ScrollViewProps) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    base: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
  });
  return <ReactNativeScrollView contentContainerStyle={[styles.base, props.contentContainerStyle]} {...props} />;
}