import { Player } from "@/data/playerData";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { usePlayerStore } from "@/stores/playerStore";

interface PlayerSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onStartSession: (selectedPlayers: Player[]) => void;
}

export default function PlayerSelectionModal({
  visible,
  onClose,
  onStartSession,
}: PlayerSelectionModalProps) {
  const players = usePlayerStore((state) => state.players);
  const addPlayer = usePlayerStore((state) => state.addPlayer);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;

    addPlayer(newPlayerName.trim());

    // Get the newly added player and auto-select it
    setTimeout(() => {
      const updatedPlayers = usePlayerStore.getState().players;
      const newPlayer = updatedPlayers[updatedPlayers.length - 1]; // Last added player
      console.log("Added player with ID:", newPlayer.id);
      setSelectedPlayerIds((prev) => [...prev, newPlayer.id]);
    }, 100);

    setNewPlayerName("");
    setShowAddPlayer(false);
  };

  const handleStartSession = () => {
    const selectedPlayers = players.filter((player) =>
      selectedPlayerIds.includes(player.id)
    );
    onStartSession(selectedPlayers);
    setSelectedPlayerIds([]);
  };

  const handleCancel = () => {
    setSelectedPlayerIds([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <View className="flex-1 bg-app-overlay justify-end">
        <View className="rounded-t-3xl pt-3 px-5 pb-10 max-h-[85%] bg-app-modal-bg">
          <View className="w-10 h-1 bg-app-text-muted rounded-full self-center mb-5" />
          <Text className="text-center mb-6 text-2xl font-semibold text-app-text-primary">
            Select Players
          </Text>

          <ScrollView
            className="mb-6 space-y-1"
            showsVerticalScrollIndicator={false}
          >
            {players.map((player) => (
              <TouchableOpacity
                key={player.id}
                className={`flex-row justify-between items-center py-5 px-1 border-b border-app-modal-border ${
                  selectedPlayerIds.includes(player.id) ? "bg-app-selected" : ""
                }`}
                onPress={() => togglePlayer(player.id)}
              >
                <View className="flex-1 gap-0.5">
                  <Text className="text-base font-medium text-app-text-primary">
                    {player.name}
                  </Text>
                  <Text className="text-sm text-app-text-muted">
                    {player.wins}W - {player.losses}L
                  </Text>
                </View>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    selectedPlayerIds.includes(player.id)
                      ? "bg-app-selected-border border-app-selected-border"
                      : "border-app-text-muted"
                  }`}
                >
                  {selectedPlayerIds.includes(player.id) && (
                    <Text className="text-app-white text-sm font-bold">✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            {showAddPlayer ? (
              <View className="flex-row items-center py-5 mt-2 gap-2">
                <TextInput
                  className="flex-1 border border-app-primary rounded-lg px-3 py-2 text-base text-app-text-primary bg-app-modal-bg"
                  placeholder="Enter player name"
                  value={newPlayerName}
                  onChangeText={setNewPlayerName}
                  autoFocus
                />
                <TouchableOpacity
                  className="px-4 py-2 bg-app-primary rounded-lg"
                  onPress={handleAddPlayer}
                >
                  <Text className="text-app-white font-semibold">Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-2 py-2 ml-1"
                  onPress={() => {
                    setShowAddPlayer(false);
                    setNewPlayerName("");
                  }}
                >
                  <Text className="text-app-primary font-semibold">Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="flex-row items-center justify-center py-5 mt-2 rounded-lg border border-dashed border-app-primary"
                onPress={() => setShowAddPlayer(true)}
              >
                <Text className="text-app-primary text-base font-semibold">
                  + Add New Player
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <Text className="text-center mb-6 text-sm text-app-text-muted">
            {selectedPlayerIds.length} players selected (minimum 2 required)
          </Text>

          <View className="flex-row gap-4">
            <TouchableOpacity
              className="flex-1 py-4 rounded-xl border-2 border-app-primary items-center"
              onPress={handleCancel}
            >
              <Text className="text-app-primary text-base font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-4 rounded-xl items-center ${
                selectedPlayerIds.length < 2
                  ? "bg-app-disabled"
                  : "bg-app-primary"
              }`}
              onPress={handleStartSession}
              disabled={selectedPlayerIds.length < 2}
            >
              <Text
                className={`text-base font-semibold ${
                  selectedPlayerIds.length < 2
                    ? "text-app-text-disabled"
                    : "text-app-white"
                }`}
              >
                Start Session
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
