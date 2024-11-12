import { StyleSheet, View } from "react-native";

/**
 * @typedef {Object} HStackProps
 * @property {import('react-native').ViewStyle} [style]
 * @property {React.ReactNode} children
 */

/**
 * @param {HStackProps & import('react-native').ViewProps} props
 */
export function HStack(props) {
  const { children, style, ...rest } = props;
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
