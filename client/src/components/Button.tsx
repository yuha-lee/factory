import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export interface ButtonProps {
  text: string;
  onPress?: (e: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({ text, onPress, style, textStyle }: ButtonProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    defaultButton: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    defaultText: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily,
      fontWeight: theme.typography.fontWeight.medium,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.defaultButton, style]}
    >
      <Text style={[styles.defaultText, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
