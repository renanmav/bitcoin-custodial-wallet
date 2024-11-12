import { useQuery } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";

import { AUTH_TOKEN_KEY } from "~/constants/auth";
import { API_URL } from "~/constants/env";

export const endpoint = "me";

export function useUserQuery() {
  return useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return response.json();
    },
    enabled: !!SecureStore.getItem(AUTH_TOKEN_KEY),
    staleTime: Infinity,
  });
}
