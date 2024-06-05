import * as SecureStore from "expo-secure-store";

export const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export function calcNextWatering(
  lastWatering: Date,
  wateringFrequency: number,
  interval: "jours" | "semaines" | "mois" | "années",
): Date {
  switch (interval) {
    case "jours":
      return new Date(lastWatering.setDate(lastWatering.getDate() + 1));
    case "semaines":
      return new Date(
        lastWatering.setDate(lastWatering.getDate() + wateringFrequency / 7),
      );
    case "mois":
      return new Date(
        lastWatering.setDate(lastWatering.getDate() + wateringFrequency / 31),
      );
    case "années":
      return new Date(
        lastWatering.setDate(lastWatering.getDate() + wateringFrequency / 365),
      );
  }
}

export function firstLetterCapitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
