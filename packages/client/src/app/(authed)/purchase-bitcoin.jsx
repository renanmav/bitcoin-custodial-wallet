import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useReducer } from "react";
import { Alert, StyleSheet } from "react-native";

import { Button, Text, TextInput, VStack } from "~/components";
import { CONTAINER_WIDTH } from "~/constants/style";
import { useBitcoinBalanceQuery } from "~/hooks/useBitcoinBalanceQuery";
import { useBitcoinPriceQuery } from "~/hooks/useBitcoinPriceQuery";
import { usePlaidAccountBalanceQuery } from "~/hooks/usePlaidAccountBalanceQuery";
import { usePurchaseBitcoinMutation } from "~/hooks/usePurchaseBitcoinMutation";

const initialState = {
  amount: "",
  errors: {
    amount: "",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "VALIDATE_FORM":
      const { amount } = state;
      const errors = {};

      if (!amount) errors.amount = "Amount is required";
      if (isNaN(amount)) errors.amount = "Amount must be a number";
      if (Number(amount) <= 0) errors.amount = "Amount must be greater than 0";

      return { ...state, errors };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

export default function PurchaseBitcoin() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isFormValid = useMemo(
    () => Object.keys(state.errors).length === 0,
    [state.errors],
  );

  const router = useRouter();

  const purchaseBitcoinMutation = usePurchaseBitcoinMutation({
    onSuccess: ({ data }) => {
      Alert.alert("Purchase successful", `You received ${data.amountBTC} BTC`, [
        {
          text: "Buy more",
          onPress: () => {
            dispatch({ type: "RESET_FORM" });
          },
        },
        {
          text: "Go back",
          style: "destructive",
          onPress: () => {
            router.back();
          },
        },
      ]);
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to purchase Bitcoin");
    },
  });

  const handleChange = useCallback(
    (field, value) => {
      dispatch({ type: "SET_FIELD", field, value });
      dispatch({ type: "VALIDATE_FORM" });
    },
    [dispatch],
  );

  const handleSubmit = useCallback(() => {
    const amountUSD = Number(state.amount);
    purchaseBitcoinMutation.mutate(amountUSD);
  }, [state.amount, purchaseBitcoinMutation]);

  const bitcoinPriceQuery = useBitcoinPriceQuery();
  const bitcoinBalanceQuery = useBitcoinBalanceQuery();
  const plaidAccountBalanceQuery = usePlaidAccountBalanceQuery();

  useFocusEffect(() => {
    bitcoinPriceQuery.refetch();
    bitcoinBalanceQuery.refetch();
    plaidAccountBalanceQuery.refetch();
  });

  const btcPrice = bitcoinPriceQuery.isSuccess
    ? bitcoinPriceQuery.data.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    : "Loading...";

  const btcBalance = bitcoinBalanceQuery.isSuccess
    ? bitcoinBalanceQuery.data.toLocaleString("en-US", {
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
      })
    : "Loading...";

  const availableBalance = plaidAccountBalanceQuery.isSuccess
    ? plaidAccountBalanceQuery.data.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    : "Loading...";

  return (
    <VStack style={styles.container}>
      <VStack style={styles.details}>
        <Text type="body" align="left">
          1 BTC ~ {btcPrice}
        </Text>
        <Text type="body" align="left">
          BTC balance: {btcBalance} BTC
        </Text>
        <Text type="body" align="left">
          Plaid account balance: {availableBalance}
        </Text>
      </VStack>

      <TextInput
        placeholder="Amount (in USD)"
        value={state.amount}
        onChangeText={(value) => handleChange("amount", value)}
        keyboardType="decimal-pad"
      />

      <Button
        title="Buy BTC"
        onPress={handleSubmit}
        disabled={!isFormValid || purchaseBitcoinMutation.isPending}
      />

      <VStack style={styles.statusContainer}>
        {Object.values(state.errors).map((error) => (
          <Text key={error} style={styles.errorText}>
            {error}
          </Text>
        ))}
        {purchaseBitcoinMutation.isPending && <Text>Buying...</Text>}
        {purchaseBitcoinMutation.isError && (
          <Text style={styles.errorText}>
            {purchaseBitcoinMutation.error.message || "An error occurred"}
          </Text>
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
  errorText: {
    color: "red",
  },
  details: {
    marginBottom: 10,
  },
});
