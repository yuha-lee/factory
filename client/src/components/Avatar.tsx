import { useTheme } from "../contexts/theme/ThemeContext";
import { Image as ReactNativeImage, ImageStyle, StyleSheet } from 'react-native';

export interface AvatarProps {
  uri: string;
  size?: number;
  style?: ImageStyle;
}
export default function Avatar({ uri, size = 40, style }: AvatarProps) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    image: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: theme.colors.neutral200,
    },
  });
  return <ReactNativeImage source={{ uri }} style={[styles.image, style]} />;
}