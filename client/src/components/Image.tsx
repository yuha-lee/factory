import React from 'react';
import { Image as ReactNativeImage, ImageStyle, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export interface ImageProps {
  src: string;
  style?: ImageStyle;
}

export function Image({ src, style }: ImageProps) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    base: {
      width: style?.width ?? '100%',
      height: style?.height ?? 200,
      resizeMode: 'cover',
      borderRadius: theme.borderRadius.sm,
    },
  });
  return <ReactNativeImage source={{ uri: src }} style={[styles.base, style]} />;
}