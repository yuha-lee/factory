import { ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { Picker as ReactNativePicker } from '@react-native-picker/picker';

export interface PickerSelectProps {
  selectedValue: any;
  onValueChange: (itemValue: any) => void;
  items: { label: string; value: any }[];
  style?: ViewStyle;
}
export function PickerSelect({ selectedValue, onValueChange, items, style }: PickerSelectProps) {
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