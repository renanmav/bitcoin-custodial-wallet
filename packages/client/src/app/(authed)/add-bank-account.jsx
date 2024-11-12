import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStorage from "expo-secure-store";
import { Alert } from "react-native";
import {
  LinkIOSPresentationStyle,
  LinkLogLevel,
  open,
} from "react-native-plaid-link-sdk";

import { BANK_ACCOUNT_TOKEN_KEY } from "~/constants/auth";
import { useExchangePublicTokenMutation } from "~/hooks/useExchangePublicTokenMutation";
import { useOnMount } from "~/hooks/useOnMount";

export default function BankAccount() {
  const router = useRouter();
  const { linkToken } = useLocalSearchParams();

  const exchangePublicTokenMutation = useExchangePublicTokenMutation({
    onSuccess: ({ data }) => {
      SecureStorage.setItemAsync(
        BANK_ACCOUNT_TOKEN_KEY,
        data.accessToken.access_token,
      ).then(() => {
        router.back();
      });
    },
    onError: (error) => {
      Alert.alert("Error linking bank account", error.message, [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
  });

  useOnMount(function initPlaidSDK() {
    if (!linkToken) {
      return router.back();
    }

    try {
      open({
        onSuccess: (plaidSuccessProps) => {
          console.log("plaidSuccessProps", plaidSuccessProps);
          exchangePublicTokenMutation.mutate(plaidSuccessProps.publicToken);
        },
        onExit: (plaidExitProps) => {
          console.log("plaidExitProps", plaidExitProps);
          router.back();
        },
        iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
        logLevel: LinkLogLevel.DEBUG,
      });
    } catch (error) {
      console.error(error);
      router.back();
    }
  });

  return null;
}
