import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useMemo, useReducer } from "react";
import { StyleSheet } from "react-native";

import { Button, Text, TextInput, VStack } from "~/components";
import { AUTH_TOKEN_KEY } from "~/constants/auth";
import { CONTAINER_WIDTH } from "~/constants/style";
import { useSigninMutation } from "~/hooks/useSigninMutation";

const initialState = {
  email: "",
  password: "",
  errors: {
    email: "",
    password: "",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "VALIDATE_FORM":
      const { email, password } = state;
      const errors = {};

      if (!email) errors.email = "Email is required";
      if (!password) errors.password = "Password is required";

      return { ...state, errors };
    default:
      return state;
  }
}

export default function Signin() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isFormValid = useMemo(
    () => Object.keys(state.errors).length === 0,
    [state.errors],
  );

  const router = useRouter();

  const signinMutation = useSigninMutation({
    onSuccess: async (response) => {
      if (response.data && response.data.token) {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.data.token);
        router.replace("/(authed)/success");
      }
    },
  });

  const handleSubmit = useCallback(() => {
    signinMutation.mutate({
      email: state.email,
      password: state.password,
    });
  }, [signinMutation, state]);

  const handleChange = useCallback(
    (field, value) => {
      dispatch({ type: "SET_FIELD", field, value });
      dispatch({ type: "VALIDATE_FORM" });
    },
    [dispatch],
  );

  const handleBlur = useCallback(() => {
    dispatch({ type: "VALIDATE_FORM" });
  }, [dispatch]);

  return (
    <VStack style={styles.container}>
      <TextInput
        placeholder="Email"
        value={state.email}
        onChangeText={(value) => handleChange("email", value)}
        onBlur={handleBlur}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        placeholder="Password"
        value={state.password}
        onChangeText={(value) => handleChange("password", value)}
        onBlur={handleBlur}
        secureTextEntry
        textContentType="newPassword"
      />

      <Button
        title="Login to your account"
        onPress={handleSubmit}
        disabled={!isFormValid}
      />

      <VStack style={styles.statusContainer}>
        {signinMutation.isPending && <Text>Loading...</Text>}
        {signinMutation.isError && (
          <Text>Error: {signinMutation.error.message}</Text>
        )}
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: CONTAINER_WIDTH,
  },
  statusContainer: {
    marginTop: 10,
  },
});
