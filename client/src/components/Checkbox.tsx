import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { ToggleProps } from "./Toggle";

interface CheckboxProps extends ToggleProps {}

export function Checkbox({ value, onValueChange, style }: CheckboxProps) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    box: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: theme.colors.neutral400,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mark: {
      width: 12,
      height: 12,
      backgroundColor: theme.colors.primary,
    },
  });
  return (
    <TouchableOpacity onPress={() => onValueChange(!value)} style={[styles.box, style]}>
      {value && <View style={styles.mark} />}
    </TouchableOpacity>
  );
}