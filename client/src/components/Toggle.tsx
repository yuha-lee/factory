import { ViewStyle } from "react-native";
import { useTheme } from "../contexts/theme/ThemeContext";
import { Switch } from "react-native";

export interface ToggleProps {
  value: boolean;
  onValueChange: (v: boolean) => void;
  style?: ViewStyle;
}

export default function Toggle({ value, onValueChange, style }: ToggleProps) {
  const theme = useTheme();
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: theme.colors.neutral400, true: theme.colors.primary }}
      thumbColor={theme.colors.surface}
      style={style}
    />
  );
}