import * as Clipboard from "expo-clipboard";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet } from "react-native";
import { create } from "react-native-plaid-link-sdk";

import { Button, Text, VStack } from "~/components";
import { AUTH_TOKEN_KEY } from "~/constants/auth";
import { CONTAINER_WIDTH } from "~/constants/style";
import { useCreateLinkTokenMutation } from "~/hooks/useCreateLinkTokenMutation";
import { useGenerateBitcoinAddressMutation } from "~/hooks/useGenerateBitcoinAddressMutation";
import { useUserQuery } from "~/hooks/useUserQuery";

export default function Success() {
  const router = useRouter();

  const handleSignOut = useCallback(() => {
    Alert.alert("Signing out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => {
          SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
          router.replace("/(unauthed)/landing");
        },
      },
    ]);
  }, [router]);

  const createLinkTokenMutation = useCreateLinkTokenMutation({
    onSuccess: ({ data }) => {
      const linkToken = data.linkToken.link_token;
      create({ token: linkToken, noLoadingState: true });
      router.push({
        pathname: "/add-bank-account",
        params: { linkToken },
      });
    },
    onError: (error) => {
      Alert.alert("An error occurred", error.message);
    },
  });

  const handleAddBankAccount = useCallback(() => {
    createLinkTokenMutation.mutate();
  }, [createLinkTokenMutation]);

  const generateBitcoinAddressMutation = useGenerateBitcoinAddressMutation({
    onSuccess: () => {
      Alert.alert("Bitcoin address generated successfully");
    },
    onError: (error) => {
      Alert.alert("Failed", error.message, [
        {
          text: "Oh, okay!",
          style: "destructive",
        },
      ]);
    },
  });

  const handleGenerateBitcoinAddress = useCallback(() => {
    generateBitcoinAddressMutation.mutate();
  }, [generateBitcoinAddressMutation]);

  const handlePurchaseBitcoin = useCallback(() => {
    router.push("/purchase-bitcoin");
  }, [router]);

  const handleCopy = useCallback((text) => {
    Clipboard.setStringAsync(text).then(() => {
      Alert.alert("Copied to clipboard", text);
    });
  }, []);

  const userQuery = useUserQuery();

  useFocusEffect(() => {
    userQuery.refetch();
  });

  if (userQuery.isPending || !userQuery.data) {
    return (
      <VStack style={styles.container}>
        <ActivityIndicator size="large" />
      </VStack>
    );
  }

  const user = userQuery.data.data.user;
  const { name, email, bitcoinAddress, plaidAccessToken } = user;

  return (
    <VStack style={styles.container}>
      <Text type="title" align="center">
        Hello {name} 👋
      </Text>

      <Text type="subtitle" align="center">
        You look lovely today 💖
      </Text>

      <VStack style={styles.details}>
        <Pressable onPress={() => handleCopy(email)} disabled={!email}>
          <Text type="body" align="left" numberOfLines={1}>
            Email: {email}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleCopy(plaidAccessToken)}
          disabled={!plaidAccessToken}
        >
          <Text type="body" align="left" numberOfLines={1}>
            Plaid access token: {plaidAccessToken || "❌"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleCopy(bitcoinAddress)}
          disabled={!bitcoinAddress}
        >
          <Text type="body" align="left" numberOfLines={1}>
            Bitcoin address: {bitcoinAddress || "❌"}
          </Text>
        </Pressable>
      </VStack>

      <Button
        title="Add bank account"
        onPress={handleAddBankAccount}
        style={styles.button}
        loading={createLinkTokenMutation.isPending}
        disabled={!!plaidAccessToken}
      />
      <Button
        title="Generate bitcoin address"
        onPress={handleGenerateBitcoinAddress}
        style={styles.button}
        loading={generateBitcoinAddressMutation.isPending}
        disabled={!!bitcoinAddress}
      />
      <Button
        title="Purchase bitcoin"
        onPress={handlePurchaseBitcoin}
        style={styles.button}
        disabled={!plaidAccessToken || !bitcoinAddress}
      />
      <Button
        title="Sign out"
        onPress={handleSignOut}
        style={styles.button}
        type="destructive"
      />
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
  button: {
    marginTop: 10,
  },
  details: {
    marginVertical: 20,
  },
});
