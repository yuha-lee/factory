import { StyleSheet, TouchableOpacity, View, ViewStyle, Modal as ReactNativeModal } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}
export default function Modal({ visible, onClose, children, style }: ModalProps) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
      position: 'absolute', top: '30%', left: '10%', right: '10%',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
  });
  return (
    <ReactNativeModal transparent visible={visible} animationType="fade">
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={[styles.content, style]}>{children}</View>
    </ReactNativeModal>
  );
}