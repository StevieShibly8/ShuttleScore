import { ModalPopup } from "@/components/ModalPopup";
import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const players = usePlayerStore((state) => state.players);
  const duos = useDuoStore((state) => state.duos);
  const sessions = useSessionStore((state) => state.sessions);

  const importPlayers = usePlayerStore((state) => state.importPlayers);
  const importDuos = useDuoStore((state) => state.importDuos);
  const importSessions = useSessionStore((state) => state.importSessions);

  const [showImportModal, setShowImportModal] = useState(false);
  const [pendingImportFile, setPendingImportFile] = useState<string | null>(
    null
  );

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;

      setPendingImportFile(result.assets[0].uri);
      setShowImportModal(true);
    } catch (e) {
      Alert.alert(
        "Import Failed",
        "Could not import data: " + (e as Error).message
      );
    }
  };

  const confirmImport = async () => {
    if (!pendingImportFile) return;
    try {
      const json = await FileSystem.readAsStringAsync(pendingImportFile, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const data = JSON.parse(json);

      if (!data.players || !data.duos || !data.sessions) {
        Alert.alert("Import Failed", "Invalid file format.");
        setShowImportModal(false);
        setPendingImportFile(null);
        return;
      }

      importPlayers(data.players);
      importDuos(data.duos);
      importSessions(data.sessions);

      Alert.alert("Import Successful", "Your data has been imported.");
    } catch (e) {
      Alert.alert(
        "Import Failed",
        "Could not import data: " + (e as Error).message
      );
    }
    setShowImportModal(false);
    setPendingImportFile(null);
  };

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
          className="bg-app-primary py-4 px-8 rounded-xl-plus items-center shadow-lg mb-4"
          onPress={handleExport}
        >
          <Text className="text-white text-lg font-bold">Export Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-app-primary py-4 px-8 rounded-xl-plus items-center shadow-lg"
          onPress={handleImport}
        >
          <Text className="text-white text-lg font-bold">Import Data</Text>
        </TouchableOpacity>
      </View>

      <ModalPopup
        visible={showImportModal}
        messageTitle="Import Data"
        messageBody="Importing will overwrite all existing players, duos, and sessions. Are you sure you want to continue?"
        cancelText="Cancel"
        confirmText="Import"
        cancelButtonColor="#444"
        confirmButtonColor="#6366F1"
        onCancel={() => {
          setShowImportModal(false);
          setPendingImportFile(null);
        }}
        onConfirm={confirmImport}
      />
    </View>
  );
}
