// ─── Token Storage ───────────────────────────────────────────────────────────
// Stores the JWT access + refresh tokens on the device. Uses AsyncStorage today;
// abstracted here so it can be swapped for expo-secure-store later without
// touching the rest of the app.

import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_KEY = "finlit_access_token";
const REFRESH_KEY = "finlit_refresh_token";

export const tokenStorage = {
  async setTokens(accessToken: string, refreshToken?: string) {
    await AsyncStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) {
      await AsyncStorage.setItem(REFRESH_KEY, refreshToken);
    }
  },

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(ACCESS_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(REFRESH_KEY);
  },

  async clear() {
    await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
  },
};
