import { ViewStyle } from "react-native";
import { useTheme } from "../contexts/theme/ThemeContext";
import { Picker as ReactNativePicker } from '@react-native-picker/picker';

export interface PickerProps {
  selectedValue: any;
  onValueChange: (itemValue: any) => void;
  items: { label: string; value: any }[];
  style?: ViewStyle;
}
export default function Picker({ selectedValue, onValueChange, items, style }: PickerProps) {
  const theme = useTheme();
  return (
    <ReactNativePicker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={[{ color: theme.colors.onBackground }, style]}
    >
      {items.map(item => (
        <ReactNativePicker.Item key={item.value} label={item.label} value={item.value} />
      ))}
    </ReactNativePicker>
  );
}