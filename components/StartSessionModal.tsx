import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
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

interface StartSessionModalProps {
  visible: boolean;
  onClose: () => void;
  onStartSession: (
    selectedPlayerIds: string[],
    selectedDuoIds: string[]
  ) => void;
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

const AddPlayerRow = ({
  show,
  value,
  onChange,
  onAdd,
  onCancel,
  onShow,
  onInputFocus,
  onInputBlur,
}: {
  show: boolean;
  value: string;
  onChange: (text: string) => void;
  onAdd: () => void;
  onCancel: () => void;
  onShow: () => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}) =>
  show ? (
    <View className="flex-row items-center py-5 mt-2 gap-2">
      <TextInput
        className="flex-1 border border-app-primary rounded-lg px-3 py-2 text-base text-app-text-primary bg-app-modal-bg"
        placeholder="Enter player name"
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChange}
        autoFocus
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      />
      <TouchableOpacity
        className="px-4 py-2 bg-app-primary rounded-lg"
        onPress={onAdd}
      >
        <Text className="text-app-white font-semibold">Add</Text>
      </TouchableOpacity>
      <TouchableOpacity className="px-2 py-2 ml-1" onPress={onCancel}>
        <Text className="text-app-primary font-semibold">Cancel</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity
      className="flex-row items-center justify-center py-4 mt-2 rounded-lg border border-dashed border-app-primary"
      onPress={onShow}
    >
      <Text className="text-app-primary text-base font-semibold">
        + Add New Player
      </Text>
    </TouchableOpacity>
  );

export const StartSessionModal = ({
  visible,
  onClose,
  onStartSession,
}: StartSessionModalProps) => {
  const players = usePlayerStore((state) => state.players);
  const addPlayer = usePlayerStore((state) => state.addPlayer);
  const addDuo = useDuoStore((state) => state.addDuo);
  const getDuoById = useDuoStore((state) => state.getDuoById);

  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [selectedDuoIds, setSelectedDuoIds] = useState<string[]>([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [search, setSearch] = useState("");

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) => {
      const newSelected = prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId];

      // After updating selected players, update selected duos
      setSelectedDuoIds(() => {
        const duoIds: string[] = [];
        // For every possible pair of selected players, check if the duo exists
        for (let i = 0; i < newSelected.length; i++) {
          for (let j = i + 1; j < newSelected.length; j++) {
            const sortedIds = [newSelected[i], newSelected[j]].sort();
            const duoId = sortedIds.join("-");
            if (getDuoById(duoId)) {
              duoIds.push(duoId);
            }
          }
        }
        return duoIds;
      });

      return newSelected;
    });
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer = addPlayer(newPlayerName.trim());

    // Create new duos for the added player
    players.forEach((player) => {
      if (player.id !== newPlayer.id) {
        const sortedPlayerIds = [newPlayer.id, player.id].sort();
        const duoId = sortedPlayerIds.join("-");
        if (!getDuoById(duoId)) {
          const newDuo = addDuo(sortedPlayerIds);
          setSelectedDuoIds((prev) => {
            const bothSelected =
              [...selectedPlayerIds, newPlayer.id].includes(player.id) &&
              [...selectedPlayerIds, newPlayer.id].includes(newPlayer.id);
            return bothSelected ? [...prev, newDuo.id] : prev;
          });
        }
      }
    });

    setSelectedPlayerIds((prev) => [...prev, newPlayer.id]);
    setNewPlayerName("");
    setShowAddPlayer(false);
  };

  const handleStartSession = () => {
    onStartSession(selectedPlayerIds, selectedDuoIds);
    setSelectedPlayerIds([]);
    setSelectedDuoIds([]);
  };

  const handleCancel = () => {
    setSelectedPlayerIds([]);
    onClose();
  };

  // Filter players by search
  const filteredPlayers = players.filter((player) =>
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
            Select Players
          </Text>

          {/* Scrollable player list with max height for 10 items */}
          <ScrollView
            style={{ maxHeight: 440 }}
            keyboardShouldPersistTaps="handled"
          >
            {filteredPlayers.map((player) => (
              <PlayerRow
                key={player.id}
                playerName={player.name}
                selected={selectedPlayerIds.includes(player.id)}
                onPress={() => togglePlayer(player.id)}
              />
            ))}
          </ScrollView>

          {/* Add Player input/button always at the bottom */}
          <View className="mb-2">
            <AddPlayerRow
              show={showAddPlayer}
              value={newPlayerName}
              onChange={setNewPlayerName}
              onAdd={handleAddPlayer}
              onCancel={() => {
                setShowAddPlayer(false);
                setNewPlayerName("");
              }}
              onShow={() => setShowAddPlayer(true)}
            />
          </View>

          <Text className="text-center mb-6 text-sm text-app-text-muted">
            {selectedPlayerIds.length} players selected (minimum 4 required)
          </Text>

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
                selectedPlayerIds.length < 4
                  ? "bg-app-disabled"
                  : "bg-app-primary"
              }`}
              onPress={handleStartSession}
              disabled={selectedPlayerIds.length < 4}
            >
              <Text
                className={`text-base font-semibold ${
                  selectedPlayerIds.length < 4
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
};
