import { Text as NativeText, StyleSheet, useColorScheme } from "react-native";

/**
 * @typedef {Object} ThemedTextProps
 * @property {import('react-native').TextStyle} [style]
 * @property {'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link'} [type='default']
 * @property {'left' | 'center' | 'right'} [align='left']
 */

/**
 * @param {ThemedTextProps & import('react-native').TextProps} props
 */
export function ThemedText({
  style,
  type = "default",
  align = "left",
  ...props
}) {
  const colorScheme = useColorScheme();
  const colorStyle = colorScheme === "dark" ? styles.dark : styles.light;

  return (
    <NativeText
      style={[
        colorStyle,
        { textAlign: align },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "destructive" ? styles.destructive : undefined,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  light: {
    color: "#000",
  },
  dark: {
    color: "#fff",
  },
  default: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  defaultSemiBold: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  link: {
    fontSize: 16,
    color: "#007AFF",
    fontFamily: "Inter_500Medium",
  },
  destructive: {
    fontSize: 16,
    color: "#FF0000",
    fontFamily: "Inter_500Medium",
  },
});
