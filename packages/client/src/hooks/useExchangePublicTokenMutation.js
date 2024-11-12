import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { AUTH_TOKEN_KEY } from "~/constants/auth";
import { API_URL } from "~/constants/env";

const endpoint = "plaid/item/public_token/exchange";

export function useExchangePublicTokenMutation({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  return useMutation({
    mutationKey: [endpoint],
    mutationFn: async (publicToken) => {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "User-Agent": Platform.OS,
        },
        body: JSON.stringify({ publicToken }),
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
      console.log("Exchange public token successful", {
        data,
        variables,
        context,
      });
      onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error("Exchange public token error", error.message);
      console.log("Error details", { error, variables, context });
      onError(error, variables, context);
    },
  });
}
