import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export interface PopoverProps {
  visible: boolean;
  content: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}
export function Popover({ visible, content, onClose, children, style }: PopoverProps) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    content: {
      position: 'absolute', top: '30%', left: '10%', right: '10%',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
  });
  return (
    <>
      {children}
      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.content, style]}>{content}</View>
      </Modal>
    </>
  );
}
