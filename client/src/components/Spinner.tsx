import { ActivityIndicator, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export interface SpinnerProps {
  size?: 'small' | 'large';
  style?: ViewStyle;
}
export function Spinner({ size = 'large', style }: SpinnerProps) {
  const theme = useTheme();
  return <ActivityIndicator size={size} color={theme.colors.primary} style={style} />;
}