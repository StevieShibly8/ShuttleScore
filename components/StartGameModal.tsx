import { usePlayerStore } from "@/stores/playerStore";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Team {
  playerIds: string[];
}

interface StartGameModalProps {
  visible: boolean;
  onClose: () => void;
  onStartGame: (teamA: Team, teamB: Team) => void;
  sessionPlayerIds: string[];
}

export default function StartGameModal({
  visible,
  onClose,
  onStartGame,
  sessionPlayerIds,
}: StartGameModalProps) {
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);

  const selectionLimit = 2;

  const handleSelect = (playerId: string, team: "A" | "B") => {
    if (team === "A") {
      if (teamA.includes(playerId)) {
        setTeamA(teamA.filter((id) => id !== playerId));
      } else if (teamA.length < selectionLimit && !teamB.includes(playerId)) {
        setTeamA([...teamA, playerId]);
      }
    } else {
      if (teamB.includes(playerId)) {
        setTeamB(teamB.filter((id) => id !== playerId));
      } else if (teamB.length < selectionLimit && !teamA.includes(playerId)) {
        setTeamB([...teamB, playerId]);
      }
    }
  };

  const handleStartGame = () => {
    const teamAObj: Team = { playerIds: teamA };
    const teamBObj: Team = { playerIds: teamB };
    onStartGame(teamAObj, teamBObj);
    setTeamA([]);
    setTeamB([]);
  };

  const handleCancel = () => {
    setTeamA([]);
    setTeamB([]);
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
        <View
          className="rounded-t-3xl bg-app-modal-bg pt-3 px-5 pb-0"
          style={{ maxHeight: "85%" }}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="w-10 h-1 bg-app-text-muted rounded-full self-center mb-5" />
            <Text className="text-center mb-6 text-2xl font-semibold text-app-text-primary">
              Select 2 Players for Each Team
            </Text>

            <View className="mb-4">
              <Text className="text-lg font-bold text-app-primary mb-2">
                Team A
              </Text>
              {sessionPlayerIds.map((playerId) => {
                const player = getPlayerById(playerId);
                if (!player) return null;
                const selected = teamA.includes(playerId);
                const disabled =
                  teamB.includes(playerId) ||
                  (teamA.length >= selectionLimit && !selected);
                return (
                  <TouchableOpacity
                    key={playerId}
                    className={`flex-row justify-between items-center py-3 px-1 border-b border-app-modal-border
          ${selected ? "bg-app-selected" : ""}`}
                    onPress={() => handleSelect(playerId, "A")}
                    disabled={disabled}
                  >
                    <View className="flex-1 gap-0.5">
                      <Text
                        className={`text-base font-medium ${disabled ? "text-app-text-disabled" : "text-app-text-primary"}`}
                      >
                        {player.name}
                      </Text>
                    </View>
                    {!disabled && (
                      <View
                        className={`w-6 h-6 rounded-full border-2 items-center justify-center
      ${selected ? "bg-app-selected-border border-app-selected-border" : "border-app-text-muted"}
    `}
                      >
                        {selected && (
                          <Text className="text-app-white text-sm font-bold">
                            ✓
                          </Text>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="mb-4">
              <Text className="text-lg font-bold text-app-primary mb-2">
                Team B
              </Text>
              {sessionPlayerIds.map((playerId) => {
                const player = getPlayerById(playerId);
                if (!player) return null;
                const selected = teamB.includes(playerId);
                const disabled =
                  teamA.includes(playerId) ||
                  (teamB.length >= selectionLimit && !selected);
                return (
                  <TouchableOpacity
                    key={playerId}
                    className={`flex-row justify-between items-center py-3 px-1 border-b border-app-modal-border
          ${selected ? "bg-app-selected" : ""}`}
                    onPress={() => handleSelect(playerId, "B")}
                    disabled={disabled}
                  >
                    <View className="flex-1 gap-0.5">
                      <Text
                        className={`text-base font-medium ${disabled ? "text-app-text-disabled" : "text-app-text-primary"}`}
                      >
                        {player.name}
                      </Text>
                    </View>
                    {!disabled && (
                      <View
                        className={`w-6 h-6 rounded-full border-2 items-center justify-center
      ${selected ? "bg-app-selected-border border-app-selected-border" : "border-app-text-muted"}
    `}
                      >
                        {selected && (
                          <Text className="text-app-white text-sm font-bold">
                            ✓
                          </Text>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="text-center mb-6 text-sm text-app-text-muted">
              Team A: {teamA.length}/2 Team B: {teamB.length}/2
            </Text>
            <View className="flex-row gap-4 mb-4">
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
                  teamA.length !== selectionLimit ||
                  teamB.length !== selectionLimit
                    ? "bg-app-disabled"
                    : "bg-app-primary"
                }`}
                onPress={handleStartGame}
                disabled={
                  teamA.length !== selectionLimit ||
                  teamB.length !== selectionLimit
                }
              >
                <Text
                  className={`text-base font-semibold ${
                    teamA.length !== selectionLimit ||
                    teamB.length !== selectionLimit
                      ? "text-app-text-disabled"
                      : "text-app-white"
                  }`}
                >
                  Start Game
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
