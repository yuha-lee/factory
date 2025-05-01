import { View, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export interface ProgressBarProps {
  progress: number;
  style?: ViewStyle;
}
export function ProgressBar({ progress, style }: ProgressBarProps) {
  const theme = useTheme();
  return (
    <View style={[{ height: 4, backgroundColor: theme.colors.neutral300, borderRadius: theme.base.borderRadius.sm }, style]}>
      <View style={{ flex: progress, backgroundColor: theme.colors.primary }} />
    </View>
  );
}