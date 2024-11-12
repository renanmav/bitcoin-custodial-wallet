import { useAssets } from "expo-asset";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { Image, StyleSheet } from "react-native";

import { Button, HStack, Text, VStack } from "~/components";
import { CONTAINER_WIDTH } from "~/constants/style";

export default function Landing() {
  const [assets] = useAssets([
    require("../../../assets/images/habbo-pfp.png"),
    require("../../../assets/images/bitcoin-icon.png"),
  ]);

  const router = useRouter();

  const handleSignIn = useCallback(() => {
    router.push("/signin");
  }, [router]);

  const handleSignUp = useCallback(() => {
    router.push("/signup");
  }, [router]);

  return (
    <VStack style={styles.container}>
      <StatusBar style="auto" />

      {assets ? (
        <HStack style={styles.innerContainer}>
          <Image source={assets[0]} style={styles.logo} />
          <Text type="subtitle" style={styles.logoSeparator}>
            +
          </Text>
          <Image source={assets[1]} style={styles.logo} />
        </HStack>
      ) : null}

      <VStack style={styles.innerContainer}>
        <Text type="title">Renan Mav's</Text>
        <Text type="title">BTC wallet</Text>
      </VStack>

      <Button title="Login to your account" onPress={handleSignIn} />
      <VStack style={styles.buttonSeparator} />
      <Button title="Create an account" onPress={handleSignUp} />
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    width: CONTAINER_WIDTH,
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  logo: {
    width: 35,
    height: 35,
    borderRadius: 100,
  },
  buttonSeparator: {
    height: 10,
  },
  logoSeparator: {
    marginHorizontal: 5,
  },
});
