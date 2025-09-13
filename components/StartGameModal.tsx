import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface StartGameModalProps {
  visible: boolean;
  onClose: () => void;
  onStartGame: (
    teamAPlayerIds: string[],
    teamBPlayerIds: string[],
    gamePoint: number,
    pointCap: number
  ) => void;
  activePlayerIds: string[];
  sessionId: string;
}

function randomizeTeam({
  availablePlayerIds,
  gamesPlayedPerPlayer,
  gamesPlayedPerDuo,
}: {
  availablePlayerIds: string[];
  gamesPlayedPerPlayer: Record<string, number>;
  gamesPlayedPerDuo: Record<string, number>;
}): string[] {
  let selectedPlayerIDs: string[] = [];
  let leastPlayedPlayerIDs: string[] = [...availablePlayerIds];

  // Step 1: Least games played logic
  for (let i = 0; i < 2 && selectedPlayerIDs.length < 2; i++) {
    const minGames = Math.min(
      ...leastPlayedPlayerIDs.map((id) => gamesPlayedPerPlayer[id] ?? 0)
    );
    const minPlayerIDs = leastPlayedPlayerIDs.filter(
      (id) => (gamesPlayedPerPlayer[id] ?? 0) === minGames
    );

    if (minPlayerIDs.length === 1) {
      selectedPlayerIDs.push(minPlayerIDs[0]);
      leastPlayedPlayerIDs = leastPlayedPlayerIDs.filter(
        (id) => id !== minPlayerIDs[0]
      );
      if (selectedPlayerIDs.length === 2) return selectedPlayerIDs;
    } else if (minPlayerIDs.length === 2 && selectedPlayerIDs.length === 0) {
      selectedPlayerIDs.push(...minPlayerIDs);
      return selectedPlayerIDs;
    } else {
      leastPlayedPlayerIDs = minPlayerIDs;
      break;
    }
  }

  // Step 2: Duo fairness
  // If we already have 1 selected, only consider duos with that player
  let duoCandidates: [string, string][] = [];
  if (selectedPlayerIDs.length === 1) {
    duoCandidates = leastPlayedPlayerIDs.map((id) => [
      selectedPlayerIDs[0],
      id,
    ]);
  } else {
    // All possible pairs from leastPlayedPlayers
    for (let i = 0; i < leastPlayedPlayerIDs.length; i++) {
      for (let j = i + 1; j < leastPlayedPlayerIDs.length; j++) {
        duoCandidates.push([leastPlayedPlayerIDs[i], leastPlayedPlayerIDs[j]]);
      }
    }
  }

  // Find the minimum games played among all candidate duos
  let minDuoGames = Infinity;
  let minDuos: [string, string][] = [];
  for (const [a, b] of duoCandidates) {
    const duoId = [a, b].sort().join("-");
    const games = gamesPlayedPerDuo[duoId] ?? 0;
    if (games < minDuoGames) {
      minDuoGames = games;
      minDuos = [[a, b]];
    } else if (games === minDuoGames) {
      minDuos.push([a, b]);
    }
  }

  // Pick one duo randomly if multiple
  const chosenDuo = minDuos[Math.floor(Math.random() * minDuos.length)];
  return chosenDuo;
}

export const StartGameModal = ({
  visible,
  onClose,
  onStartGame,
  activePlayerIds,
  sessionId,
}: StartGameModalProps) => {
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const [teamAPlayerIds, setTeamAPlayerIds] = useState<string[]>([]);
  const [teamBPlayerIds, setTeamBPlayerIds] = useState<string[]>([]);
  const [gamePoint, setGamePoint] = useState<number>(15);

  // Point Cap logic
  const defaultPointCaps: Record<number, number> = {
    7: 11,
    11: 15,
    15: 21,
    21: 30,
  };
  const [pointCap, setPointCap] = useState<number>(defaultPointCaps[15]);

  // Update pointCap when gamePoint changes
  useEffect(() => {
    setPointCap(defaultPointCaps[gamePoint]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePoint]);

  const session = useSessionStore((state) => state.getSessionById(sessionId));
  const selectionLimit = 2;

  // Only allow point caps >= gamePoint and <= maxCap
  const pointCapOptions = [];
  for (let i = gamePoint; i <= defaultPointCaps[gamePoint]; i++) {
    pointCapOptions.push(i);
  }

  const handleSelect = (playerId: string, team: "A" | "B") => {
    if (team === "A") {
      if (teamAPlayerIds.includes(playerId)) {
        setTeamAPlayerIds(teamAPlayerIds.filter((id) => id !== playerId));
      } else if (
        teamAPlayerIds.length < selectionLimit &&
        !teamBPlayerIds.includes(playerId)
      ) {
        setTeamAPlayerIds([...teamAPlayerIds, playerId]);
      }
    } else {
      if (teamBPlayerIds.includes(playerId)) {
        setTeamBPlayerIds(teamBPlayerIds.filter((id) => id !== playerId));
      } else if (
        teamBPlayerIds.length < selectionLimit &&
        !teamAPlayerIds.includes(playerId)
      ) {
        setTeamBPlayerIds([...teamBPlayerIds, playerId]);
      }
    }
  };

  const handleRandomizeTeamA = () => {
    if (!session) return;
    const availableForA = activePlayerIds.filter(
      (id) => !teamBPlayerIds.includes(id)
    );
    const teamAPlayerIds = randomizeTeam({
      availablePlayerIds: availableForA,
      gamesPlayedPerPlayer: session.gamesPlayedPerPlayer,
      gamesPlayedPerDuo: session.gamesPlayedPerDuo,
    });
    setTeamAPlayerIds(teamAPlayerIds);
  };

  const handleRandomizeTeamB = () => {
    if (!session) return;
    const availableForB = activePlayerIds.filter(
      (id) => !teamAPlayerIds.includes(id)
    );
    const teamBPlayerIds = randomizeTeam({
      availablePlayerIds: availableForB,
      gamesPlayedPerPlayer: session.gamesPlayedPerPlayer,
      gamesPlayedPerDuo: session.gamesPlayedPerDuo,
    });
    setTeamBPlayerIds(teamBPlayerIds);
  };

  const handleStartGame = () => {
    onStartGame(teamAPlayerIds, teamBPlayerIds, gamePoint, pointCap);
    setTeamAPlayerIds([]);
    setTeamBPlayerIds([]);
    setGamePoint(15);
    setPointCap(defaultPointCaps[15]);
  };

  const handleCancel = () => {
    setTeamAPlayerIds([]);
    setTeamBPlayerIds([]);
    setGamePoint(15);
    setPointCap(defaultPointCaps[15]);
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
        <View className="rounded-t-3xl bg-app-modal-bg pt-3 px-5 pb-2">
          <Text className="text-center mt-4 mb-6 text-2xl font-semibold text-app-text-primary">
            Game Setup
          </Text>

          {/* Game Point Selector */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-app-primary mb-2">
              Game Point
            </Text>
            <View className="flex-row gap-2">
              {[7, 11, 15, 21].map((point) => (
                <TouchableOpacity
                  key={point}
                  className={`flex-1 py-2 rounded-lg items-center border ${
                    gamePoint === point
                      ? "bg-app-primary border-app-primary"
                      : "bg-transparent border-app-primary"
                  }`}
                  onPress={() => setGamePoint(point)}
                >
                  <Text
                    className={`font-semibold ${
                      gamePoint === point ? "text-white" : "text-app-primary"
                    }`}
                  >
                    {point}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-sm text-app-text-muted mt-2">
              The game will end when the game point is reached, unless there is
              a deuce.
            </Text>
          </View>

          {/* Point Cap Selector */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-app-primary mb-2">
              Point Cap
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ maxHeight: 48 }}
              contentContainerStyle={{ flexDirection: "row", gap: 4 }}
            >
              {pointCapOptions.map((cap) => (
                <TouchableOpacity
                  key={cap}
                  className={`py-2 px-4 rounded-lg items-center border ${
                    pointCap === cap
                      ? "bg-app-primary border-app-primary"
                      : "bg-transparent border-app-primary"
                  }`}
                  onPress={() => setPointCap(cap)}
                >
                  <Text
                    className={`font-semibold ${
                      pointCap === cap ? "text-white" : "text-app-primary"
                    }`}
                  >
                    {cap}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text className="text-sm text-app-text-muted mt-2">
              Deuce: The game will end with a 2-point lead, or when the point
              cap is reached.
            </Text>
          </View>

          <View className="mb-4 flex-row gap-12">
            {/* Team A Column */}
            <View className="flex-1">
              <TouchableOpacity
                onPress={handleRandomizeTeamA}
                className="ml-2"
                accessibilityLabel="Randomize Team A"
              >
                <View className="flex-row items-center justify-center mb-2 gap-4">
                  <Text className="text-lg font-bold text-app-primary text-center">
                    Team A
                  </Text>

                  <MaterialCommunityIcons
                    name="dice-multiple"
                    size={30}
                    color="#3B82F6"
                  />
                </View>
              </TouchableOpacity>
              <ScrollView
                style={{ maxHeight: 415 }}
                keyboardShouldPersistTaps="handled"
              >
                {activePlayerIds.map((playerId) => {
                  const player = getPlayerById(playerId);
                  if (!player) return null;
                  const selected = teamAPlayerIds.includes(playerId);
                  const disabled =
                    teamBPlayerIds.includes(playerId) ||
                    (teamAPlayerIds.length >= selectionLimit && !selected);
                  return (
                    <TouchableOpacity
                      key={playerId}
                      className={`flex-row justify-between items-center py-2 px-1 border-b border-app-modal-border
              ${selected ? "bg-app-selected" : ""}`}
                      onPress={() => handleSelect(playerId, "A")}
                      disabled={disabled}
                    >
                      <Text
                        className={`text-base font-medium ${disabled ? "text-app-text-disabled" : "text-app-text-primary"}`}
                      >
                        {player.name}
                      </Text>
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
              </ScrollView>
              <Text className="text-center mt-4 text-sm text-app-text-muted">
                Team A: {teamAPlayerIds.length}/2
              </Text>
            </View>

            {/* Team B Column */}
            <View className="flex-1">
              <TouchableOpacity
                onPress={handleRandomizeTeamB}
                className="ml-2"
                accessibilityLabel="Randomize Team B"
              >
                <View className="flex-row items-center justify-center mb-2 gap-4">
                  <Text className="text-lg font-bold text-app-primary text-center">
                    Team B
                  </Text>

                  <MaterialCommunityIcons
                    name="dice-multiple"
                    size={30}
                    color="#3B82F6"
                  />
                </View>
              </TouchableOpacity>
              <ScrollView
                style={{ maxHeight: 415 }}
                keyboardShouldPersistTaps="handled"
              >
                {activePlayerIds.map((playerId) => {
                  const player = getPlayerById(playerId);
                  if (!player) return null;
                  const selected = teamBPlayerIds.includes(playerId);
                  const disabled =
                    teamAPlayerIds.includes(playerId) ||
                    (teamBPlayerIds.length >= selectionLimit && !selected);
                  return (
                    <TouchableOpacity
                      key={playerId}
                      className={`flex-row justify-between items-center py-2 px-1 border-b border-app-modal-border
              ${selected ? "bg-app-selected" : ""}`}
                      onPress={() => handleSelect(playerId, "B")}
                      disabled={disabled}
                    >
                      <Text
                        className={`text-base font-medium ${disabled ? "text-app-text-disabled" : "text-app-text-primary"}`}
                      >
                        {player.name}
                      </Text>
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
              </ScrollView>
              <Text className="text-center mt-4 text-sm text-app-text-muted">
                Team B: {teamBPlayerIds.length}/2
              </Text>
            </View>
          </View>

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
                teamAPlayerIds.length !== selectionLimit ||
                teamBPlayerIds.length !== selectionLimit
                  ? "bg-app-disabled"
                  : "bg-app-primary"
              }`}
              onPress={handleStartGame}
              disabled={
                teamAPlayerIds.length !== selectionLimit ||
                teamBPlayerIds.length !== selectionLimit
              }
            >
              <Text
                className={`text-base font-semibold ${
                  teamAPlayerIds.length !== selectionLimit ||
                  teamBPlayerIds.length !== selectionLimit
                    ? "text-app-text-disabled"
                    : "text-app-white"
                }`}
              >
                Start Game
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
