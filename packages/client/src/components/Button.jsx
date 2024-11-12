import { ActivityIndicator, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "./ThemedText";

import {
  BORDER_COLOR,
  BORDER_RADIUS,
  BORDER_WIDTH,
  INNER_INPUT_PADDING,
} from "~/constants/style";

/**
 * @param {import('react-native').ButtonProps & { type?: import('./ThemedText').ThemedTextProps['type'], loading?: boolean }} props
 */
export function Button({ style, disabled, type = "link", loading, ...props }) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      style={[styles.default, style, isDisabled && styles.disabled]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size={20} />
      ) : (
        <ThemedText type={type}>{props.title}</ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  default: {
    alignItems: "center",
    paddingVertical: INNER_INPUT_PADDING,
    backgroundColor: "transparent",
    borderRadius: BORDER_RADIUS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
  },
  disabled: {
    opacity: 0.5,
  },
});
