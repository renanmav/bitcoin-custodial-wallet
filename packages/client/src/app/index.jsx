import { Redirect, useRootNavigationState } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

import { AUTH_TOKEN_KEY } from "~/constants/auth";

export default function AuthRedirect() {
  const [isLoggedIn, setIsLoggedIn] = useState();
  const rootNavigationState = useRootNavigationState();

  useEffect(function checkLoginStatus() {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        console.log("checkLoginStatus > isLoggedIn", !!token);
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    })();
  }, []);

  if (!rootNavigationState.key || typeof isLoggedIn != "boolean") return null;

  return (
    <Redirect href={isLoggedIn ? "/(authed)/success" : "/(unauthed)/landing"} />
  );
}
