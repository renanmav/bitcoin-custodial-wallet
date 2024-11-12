import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { AUTH_TOKEN_KEY } from "~/constants/auth";
import { API_URL } from "~/constants/env";

const endpoint = "bitcoin/purchase";

export function usePurchaseBitcoinMutation({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  return useMutation({
    mutationKey: [endpoint],
    mutationFn: async (amountUSD) => {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "User-Agent": Platform.OS,
        },
        body: JSON.stringify({ amountUSD }),
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
      console.log("Bitcoin purchase successful", {
        data,
        variables,
        context,
      });
      onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error("Failed to purchase bitcoin", error.message);
      console.log("Error details", { error, variables, context });
      onError(error, variables, context);
    },
  });
}
