import { View, ViewStyle } from "react-native";
import { useTheme } from "../contexts/theme/ThemeContext";

export interface ProgressBarProps {
  progress: number;
  style?: ViewStyle;
}
export default function ProgressBar({ progress, style }: ProgressBarProps) {
  const theme = useTheme();
  return (
    <View style={[{ height: 4, backgroundColor: theme.colors.neutral300, borderRadius: theme.borderRadius.sm }, style]}>
      <View style={{ flex: progress, backgroundColor: theme.colors.primary }} />
    </View>
  );
}