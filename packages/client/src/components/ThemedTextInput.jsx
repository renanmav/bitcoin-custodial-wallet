import {
  TextInput as NativeTextInput,
  StyleSheet,
  useColorScheme,
} from "react-native";

import {
  BORDER_COLOR,
  BORDER_RADIUS,
  BORDER_WIDTH,
  INNER_INPUT_PADDING,
  PLACEHOLDER_COLOR,
} from "~/constants/style";

/**
 * @param {import('react-native').TextInputProps} props
 */
export function ThemedTextInput({ style, ...props }) {
  const colorScheme = useColorScheme();
  const colorStyle = colorScheme === "dark" ? styles.dark : styles.light;
  return (
    <NativeTextInput
      placeholderTextColor={PLACEHOLDER_COLOR}
      style={[colorStyle, styles.input, style]}
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
  input: {
    marginBottom: 10,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    borderRadius: BORDER_RADIUS,
    padding: INNER_INPUT_PADDING,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
});
