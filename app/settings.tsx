import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  // Gather all data from stores
  const players = usePlayerStore((state) => state.players);
  const duos = useDuoStore((state) => state.duos);
  const sessions = useSessionStore((state) => state.sessions);

  const handleExport = async () => {
    try {
      const exportData = {
        players,
        duos,
        sessions,
        exportedAt: new Date().toISOString(),
      };
      const json = JSON.stringify(exportData, null, 2);
      const fileUri =
        FileSystem.documentDirectory + "shuttle-score-export.json";
      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Export Shuttle Score Data",
      });
    } catch (e) {
      Alert.alert(
        "Export Failed",
        "Could not export data: " + (e as Error).message
      );
    }
  };

  return (
    <View className="flex-1 bg-app-background p-5">
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-3xl text-white font-800 text-center tracking-tight">
          Settings
        </Text>
      </View>

      <View className="items-center mt-10">
        <TouchableOpacity
          className="bg-app-primary py-4 px-8 rounded-xl-plus items-center shadow-lg"
          onPress={handleExport}
        >
          <Text className="text-white text-lg font-bold">Export Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
