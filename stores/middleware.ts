import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

// Typed helper for Zustand persist middleware with AsyncStorage
export function withAsyncStoragePersist<T>(
  config: StateCreator<T, [], [], T>,
  options: Omit<PersistOptions<T>, "storage">
) {
  return persist(config, {
    ...options,
    storage: {
      getItem: async (name: string) => {
        const value = await AsyncStorage.getItem(name);
        return value ? JSON.parse(value) : null;
      },
      setItem: async (name: string, value: any) => {
        await AsyncStorage.setItem(name, JSON.stringify(value));
      },
      removeItem: async (name: string) => {
        await AsyncStorage.removeItem(name);
      },
    },
  });
}
