import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { AUTH_TOKEN_KEY } from "~/constants/auth";
import { API_URL } from "~/constants/env";

const endpoint = "bitcoin/generate_address";

export function useGenerateBitcoinAddressMutation({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  return useMutation({
    mutationKey: [endpoint],
    mutationFn: async () => {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "User-Agent": Platform.OS,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          statusText: response.statusText,
          message: errorData.error || "Something went wrong",
        };
      }

      return response.json();
    },
    onSuccess: (data, variables, context) => {
      console.log("Generated bitcoin address successfully", {
        data,
        variables,
        context,
      });
      onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error("Failed to generate bitcoin address", error.message);
      console.log("Error details", { error, variables, context });
      onError(error, variables, context);
    },
  });
}
