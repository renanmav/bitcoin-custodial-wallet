import { Stack } from "expo-router";

export default function UnauthedLayout() {
  // TODO: Add passkey auth
  // TODO: Do not allow authenticated users to access unauthed routes

  return (
    <Stack>
      <Stack.Screen
        name="landing"
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signin"
        options={{
          title: "Sign in",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Sign up",
        }}
      />
    </Stack>
  );
}
