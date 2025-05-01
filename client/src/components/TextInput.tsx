import React from 'react';
import { TextInput as ReactNativeTextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function TextInput(props: TextInputProps) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    base: {
      borderWidth: 1,
      borderColor: theme.colors.neutral400,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.onBackground,
      fontFamily: theme.typography.fontFamily,
    },
  });
  return <ReactNativeTextInput placeholderTextColor={theme.colors.neutral500} style={[styles.base, props.style]} {...props} />;
}