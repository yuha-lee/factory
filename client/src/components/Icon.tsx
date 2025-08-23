import React from "react";
import { ViewStyle } from "react-native";
import { useTheme } from "../contexts/theme/ThemeContext";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}
export default function Icon({ name, size, color, style }: IconProps) {
  const theme = useTheme();
  return (
    <MaterialIcons
      name={name}
      size={size ?? theme.typography.fontSize.lg}
      color={color ?? theme.colors.primary}
      style={style}
    />
  );
}