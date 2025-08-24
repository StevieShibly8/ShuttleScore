import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddPlayersModalProps {
  visible: boolean;
  onClose: () => void;
}

const PlayerRow = ({
  playerName,
  selected,
  onPress,
}: {
  playerName: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    className={`flex-row justify-between items-center py-4 px-1 border-b border-app-modal-border ${
      selected ? "bg-app-selected" : ""
    }`}
    onPress={onPress}
  >
    <View className="flex-1">
      <Text className="text-base font-medium text-app-text-primary">
        {playerName}
      </Text>
    </View>
    <View
      className={`w-6 h-6 mr-2 rounded-full border-2 items-center justify-center ${
        selected
          ? "bg-app-selected-border border-app-selected-border"
          : "border-app-text-muted"
      }`}
    >
      {selected && <Text className="text-app-white text-sm font-bold">✓</Text>}
    </View>
  </TouchableOpacity>
);

export const AddPlayersModal = ({ visible, onClose }: AddPlayersModalProps) => {
  const players = usePlayerStore((state) => state.players);
  const session = useSessionStore((state) => state.getCurrentSession());
  const addPlayersToSession = useSessionStore(
    (state) => state.addPlayersToSession
  );
  const addDuo = useDuoStore((state) => state.addDuo);
  const getDuoById = useDuoStore((state) => state.getDuoById);

  // Only show players not already in the session
  const availablePlayers = players.filter(
    (player) => !session?.players?.[player.id]
  );

  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [selectedDuoIds, setSelectedDuoIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // Helper to get all duos between selected and existing players
  const computeSelectedDuoIds = (selectedIds: string[]) => {
    const currentPlayerIds = session?.players
      ? Object.keys(session.players)
      : [];
    const allPlayerIds = [...currentPlayerIds, ...selectedIds];
    const duoIds: string[] = [];
    for (let i = 0; i < allPlayerIds.length; i++) {
      for (let j = i + 1; j < allPlayerIds.length; j++) {
        const sortedIds = [allPlayerIds[i], allPlayerIds[j]].sort();
        const duoId = sortedIds.join("-");
        let duo = getDuoById(duoId);
        if (!duo) {
          duo = addDuo(sortedIds);
        }
        duoIds.push(duo.id);
      }
    }
    return duoIds;
  };

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) => {
      const newSelected = prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId];
      setSelectedDuoIds(computeSelectedDuoIds(newSelected));
      return newSelected;
    });
  };

  const handleAddPlayers = () => {
    addPlayersToSession(selectedPlayerIds, selectedDuoIds);
    setSelectedPlayerIds([]);
    setSelectedDuoIds([]);
    onClose();
  };

  const handleCancel = () => {
    setSelectedPlayerIds([]);
    setSelectedDuoIds([]);
    onClose();
  };

  // Filter players by search
  const filteredPlayers = availablePlayers.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <View className="flex-1 bg-app-overlay justify-end">
        <View className="rounded-t-3xl pt-3 px-5 pb-4 bg-app-modal-bg">
          <Text className="text-center mt-4 mb-6 text-2xl font-semibold text-app-text-primary">
            Add Players to Session
          </Text>

          {/* Scrollable player list */}
          <ScrollView
            style={{ maxHeight: 440 }}
            keyboardShouldPersistTaps="handled"
          >
            {filteredPlayers.length === 0 ? (
              <Text className="text-center text-app-text-muted py-8">
                No available players to add.
              </Text>
            ) : (
              filteredPlayers.map((player) => (
                <PlayerRow
                  key={player.id}
                  playerName={player.name}
                  selected={selectedPlayerIds.includes(player.id)}
                  onPress={() => togglePlayer(player.id)}
                />
              ))
            )}
          </ScrollView>

          <View className="mb-4">
            <View style={{ position: "relative", justifyContent: "center" }}>
              <MaterialIcons
                name="search"
                size={20}
                color="#aaa"
                style={{
                  position: "absolute",
                  left: 12,
                  zIndex: 1,
                }}
                pointerEvents="none"
              />
              <TextInput
                className="border border-app-primary rounded-lg px-3 py-2 text-base text-app-text-primary bg-app-modal-bg pr-10"
                placeholder="Search players"
                placeholderTextColor="#aaa"
                value={search}
                onChangeText={setSearch}
                style={{ paddingLeft: 36 }} // add left padding for the icon
              />
              {search.length > 0 && (
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 8,
                    top: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => setSearch("")}
                  accessibilityLabel="Clear search"
                >
                  <MaterialIcons name="close" size={20} color="#aaa" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Text className="text-center mb-6 text-sm text-app-text-muted">
            {selectedPlayerIds.length} player
            {selectedPlayerIds.length === 1 ? "" : "s"} selected
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
                selectedPlayerIds.length === 0
                  ? "bg-app-disabled"
                  : "bg-app-primary"
              }`}
              onPress={handleAddPlayers}
              disabled={selectedPlayerIds.length === 0}
            >
              <Text
                className={`text-base font-semibold ${
                  selectedPlayerIds.length === 0
                    ? "text-app-text-disabled"
                    : "text-app-white"
                }`}
              >
                Add to Session
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
