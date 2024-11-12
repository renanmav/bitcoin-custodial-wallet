import { StyleSheet, View } from "react-native";

/**
 * @typedef {Object} VStackProps
 * @property {import('react-native').ViewStyle} [style]
 * @property {React.ReactNode} children
 */

/**
 * @param {VStackProps & import('react-native').ViewProps} props
 */
export function VStack(props) {
  const { children, style, ...rest } = props;
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
});
