import { useMutation } from "@tanstack/react-query";

import { API_URL } from "~/constants/env";

const endpoint = "signup";

export function useSignupMutation({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  return useMutation({
    mutationKey: [endpoint],
    mutationFn: async (newUser) => {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
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
      onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error("Signup error", error.message);
      console.log("Error details", { error, variables, context });
      onError(error, variables, context);
    },
  });
}
