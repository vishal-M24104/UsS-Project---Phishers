import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_DATA: "userData"
};

// Detect if actually running on web browser
const isWebBrowser = typeof window !== "undefined" && Platform.OS === "web";

class SecureStorageService {
  async saveAccessToken(token: string) {
    if (isWebBrowser) {
      window.localStorage.setItem(KEYS.ACCESS_TOKEN, token);
    } else {
      await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
    }
  }

  async getAccessToken() {
    if (isWebBrowser) {
      return window.localStorage.getItem(KEYS.ACCESS_TOKEN);
    }
    return await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  }

  async saveRefreshToken(token: string) {
    if (isWebBrowser) {
      window.localStorage.setItem(KEYS.REFRESH_TOKEN, token);
    } else {
      await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
    }
  }

  async getRefreshToken() {
    if (isWebBrowser) {
      return window.localStorage.getItem(KEYS.REFRESH_TOKEN);
    }
    return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  }

  async saveUserData(data: any) {
    const json = JSON.stringify(data);
    if (isWebBrowser) {
      window.localStorage.setItem(KEYS.USER_DATA, json);
    } else {
      await SecureStore.setItemAsync(KEYS.USER_DATA, json);
    }
  }

  async getUserData() {
    if (isWebBrowser) {
      const json = window.localStorage.getItem(KEYS.USER_DATA);
      return json ? JSON.parse(json) : null;
    }
    const json = await SecureStore.getItemAsync(KEYS.USER_DATA);
    return json ? JSON.parse(json) : null;
  }

  async clearAll() {
    if (isWebBrowser) {
      window.localStorage.removeItem(KEYS.ACCESS_TOKEN);
      window.localStorage.removeItem(KEYS.REFRESH_TOKEN);
      window.localStorage.removeItem(KEYS.USER_DATA);
    } else {
      await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
      await SecureStore.deleteItemAsync(KEYS.USER_DATA);
    }
  }
}

export const secureStorage = new SecureStorageService();
