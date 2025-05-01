import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export interface TooltipProps {
  text: string;
  children: React.ReactNode;
  style?: ViewStyle;
}
export function Tooltip({ text, children, style }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const styles = StyleSheet.create({
    tooltip: {
      position: 'absolute',
      bottom: '100%',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 2,
    },
  });
  return (
    <TouchableOpacity onPress={() => setVisible(v => !v)} style={style}>
      {children}
      {visible && <View style={styles.tooltip}><Text>{text}</Text></View>}
    </TouchableOpacity>
  );
}