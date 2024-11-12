import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useMemo, useReducer } from "react";
import { Alert, StyleSheet } from "react-native";
import * as Passkeys from "react-native-passkeys";

import { Button, HStack, Text, TextInput, VStack } from "~/components";
import { AUTH_TOKEN_KEY } from "~/constants/auth";
import { CONTAINER_WIDTH } from "~/constants/style";
import { useSignupMutation } from "~/hooks/useSignupMutation";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  errors: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "VALIDATE_FORM":
      const { name, email, password, confirmPassword } = state;
      const errors = {};

      if (!name) errors.name = "Name is required";
      if (!email) errors.email = "Email is required";
      if (!password) errors.password = "Password is required";
      if (!confirmPassword)
        errors.confirmPassword = "Confirm password is required";
      if (password !== confirmPassword)
        errors.confirmPassword = "Passwords do not match";

      return { ...state, errors };
    default:
      return state;
  }
}

export default function Signup() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isFormValid = useMemo(
    () => Object.keys(state.errors).length === 0,
    [state.errors],
  );

  const router = useRouter();

  const signupMutation = useSignupMutation({
    onSuccess: async (response) => {
      if (response.data && response.data.token) {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.data.token);
        router.replace("/(authed)/success");
      }
    },
  });

  const handleSubmit = useCallback(() => {
    signupMutation.mutate({
      name: state.name,
      email: state.email,
      password: state.password,
    });
  }, [state, signupMutation]);

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

  const handlePasskeySignup = useCallback(async () => {
    try {
      const bundleId = "com.renanmav.bitcoin-custodial-wallet";

      const json = await Passkeys.create({
        challenge: "challenge",
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        rp: {
          id: bundleId,
          name: "Bitcoin Custodial Wallet",
        },
        user: {
          id: Date.now().toString(),
          name: "Bitcoin Custodial Wallet",
        },
        authenticatorSelection: {
          userVerification: "required",
          residentKey: "required",
        },
      });

      console.log("Create passkey response", json);
      Alert.alert("Success", JSON.stringify(json));
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log("Create passkey error", error);
    }
  }, []);

  return (
    <VStack style={styles.container}>
      <TextInput
        placeholder="Name"
        value={state.name}
        onChangeText={(value) => handleChange("name", value)}
        onBlur={handleBlur}
        textContentType="name"
        autoCapitalize="words"
        autoCorrect={false}
        autoComplete="name"
      />
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
      <TextInput
        placeholder="Confirm password"
        value={state.confirmPassword}
        onChangeText={(value) => handleChange("confirmPassword", value)}
        onBlur={handleBlur}
        secureTextEntry
        textContentType="newPassword"
      />

      <HStack style={styles.buttonContainer}>
        <Button
          title="Create account"
          onPress={handleSubmit}
          disabled={
            !isFormValid || signupMutation.isPending || signupMutation.isSuccess
          }
          style={styles.button}
        />

        {Passkeys.isSupported() ? (
          <Button
            title="Use Passkey"
            onPress={handlePasskeySignup}
            style={[styles.button, { marginLeft: 10 }]}
          />
        ) : null}
      </HStack>

      <VStack style={styles.statusContainer}>
        {signupMutation.isPending && <Text>Loading...</Text>}
        {signupMutation.isError && (
          <Text>Error: {signupMutation.error.message}</Text>
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
  buttonContainer: {
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
  },
});
