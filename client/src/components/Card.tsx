import { StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export interface CardProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}
export default function Card({ children, style }: CardProps) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    base: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.sm,
    },
  });
  return <View style={[styles.base, style]}>{children}</View>;
}
