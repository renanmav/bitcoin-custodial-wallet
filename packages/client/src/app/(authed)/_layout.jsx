import { Stack } from "expo-router";

export default function AuthedLayout() {
  // TODO: Do not allow unauthed users to access any of these screens

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="success" options={{ title: "" }} />
      <Stack.Screen name="add-bank-account" />
      <Stack.Screen
        name="purchase-bitcoin"
        options={{ headerShown: true, title: "Purchase bitcoin" }}
      />
    </Stack>
  );
}
