import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function PlayersScreen() {
  const players = usePlayerStore((state) => state.players);
  const addPlayer = usePlayerStore((state) => state.addPlayer);
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);
  const addDuo = useDuoStore((state) => state.addDuo);
  const getDuoById = useDuoStore((state) => state.getDuoById);
  const router = useRouter();

  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [search, setSearch] = useState("");

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer = addPlayer(newPlayerName.trim());

    // Create new duos for the new player
    players.forEach((player) => {
      if (player.id !== newPlayer.id) {
        const sortedPlayerIds = [newPlayer.id, player.id].sort();
        const duoId = sortedPlayerIds.join("-");
        if (!getDuoById(duoId)) {
          addDuo(sortedPlayerIds);
        }
      }
    });

    setNewPlayerName("");
    setShowAddPlayer(false);
  };

  const handleEditPlayer = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSaveEdit = (id: string) => {
    if (editingName.trim()) {
      updatePlayer(id, { name: editingName.trim() });
    }
    setEditingId(null);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  // Filter players by search
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-app-background"
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={120}
    >
      <View className="p-5">
        <View className="items-center mb-8">
          <Text className="text-3xl text-white font-800 text-center tracking-tight">
            Players
          </Text>
        </View>

        {/* Search Field */}
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
              className="border border-app-primary rounded-lg px-3 py-2 text-base text-app-text-primary bg-app-modal-bg"
              placeholder="Search players"
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
              style={{ paddingLeft: 36 }} // add left padding for the icon
            />
          </View>
        </View>

        {/* Add Player Button/Row */}
        {showAddPlayer ? (
          <View className="flex-row items-center py-3 gap-2 mb-6">
            <TextInput
              className="flex-1 border border-app-primary rounded-lg px-3 py-2 text-base text-app-text-primary bg-app-modal-bg"
              placeholder="Enter player name"
              placeholderTextColor="#aaa"
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
            className="flex-row items-center justify-center py-4 mb-8 rounded-lg border border-dashed border-app-primary"
            onPress={() => setShowAddPlayer(true)}
          >
            <Text className="text-app-primary text-base font-semibold">
              + Add New Player
            </Text>
          </TouchableOpacity>
        )}

        <View className="space-y-3">
          {filteredPlayers.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-app-text-muted text-base text-center">
                There are no players to display
              </Text>
            </View>
          ) : (
            filteredPlayers.map((player) => (
              <TouchableOpacity
                key={player.id}
                onPress={() =>
                  router.push({
                    pathname: "/playerProfile",
                    params: { playerId: player.id },
                  })
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#23272f", // or use your bg-app-card class
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: "#333a44",
                }}
                disabled={editingId === player.id}
              >
                {editingId === player.id ? (
                  <>
                    <TextInput
                      className="border border-app-primary rounded-lg px-2 py-1 text-base text-app-text-primary bg-app-modal-bg"
                      value={editingName}
                      onChangeText={setEditingName}
                      autoFocus
                      style={{ flex: 1, marginRight: 8 }}
                    />
                    <TouchableOpacity onPress={() => handleSaveEdit(player.id)}>
                      <MaterialIcons name="check" size={22} color="#6c935c" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleCancelEdit}
                      style={{ marginLeft: 8 }}
                    >
                      <MaterialIcons name="close" size={22} color="#ef4444" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={{ flex: 1 }}>
                      <Text className="text-white font-semibold text-lg">
                        {player.name}
                      </Text>
                      <Text className="text-app-text-muted text-sm">
                        RP: {player.rp}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleEditPlayer(player.id, player.name)}
                      style={{ marginLeft: 16 }}
                    >
                      <MaterialIcons name="edit" size={22} color="#6c935c" />
                    </TouchableOpacity>
                  </>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
