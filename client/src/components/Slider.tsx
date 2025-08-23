import { ViewStyle } from "react-native";
import { useTheme } from "../contexts/theme/ThemeContext";
import Slider from '@react-native-community/slider';

export interface SliderProps {
  value: number;
  onValueChange: (v: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  style?: ViewStyle;
}
export default function Slideraaa({ value, onValueChange, minimumValue = 0, maximumValue = 1, style }: SliderProps) {
  const theme = useTheme();
  return (
    <Slider
      value={value}
      onValueChange={onValueChange}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      style={style}
      minimumTrackTintColor={theme.colors.primary}
      maximumTrackTintColor={theme.colors.neutral400}
      thumbTintColor={theme.colors.surface}
    />
  );
}