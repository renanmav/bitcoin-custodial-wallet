import { Platform } from "react-native";

export const isDev = process.env.NODE_ENV === "development";
export const isWeb = typeof window !== "undefined" && Platform.OS === "web";

export let API_URL = "http://localhost:8080";
if (isDev && Platform.OS === "android") {
  API_URL = "http://10.0.2.2:8080";
}
