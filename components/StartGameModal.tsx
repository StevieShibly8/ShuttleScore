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

  // Step 1:   // Find players with the least games played
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

function randomizePlayer({
  availablePlayerIds,
  gamesPlayedPerPlayer,
}: {
  availablePlayerIds: string[];
  gamesPlayedPerPlayer: Record<string, number>;
}): string {
  // Find players with the least games played
  const minGames = Math.min(
    ...availablePlayerIds.map((id) => gamesPlayedPerPlayer[id] ?? 0)
  );
  const minPlayers = availablePlayerIds.filter(
    (id) => (gamesPlayedPerPlayer[id] ?? 0) === minGames
  );
  // If multiple, pick one randomly
  return minPlayers[Math.floor(Math.random() * minPlayers.length)];
}

export const StartGameModal = ({
  visible,
  onClose,
  onStartGame,
  activePlayerIds,
  sessionId,
}: StartGameModalProps) => {
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const session = useSessionStore((state) => state.getSessionById(sessionId));
  const selectionLimit = 2;

  // --- NEW: Tab state and logic ---
  const [tab, setTab] = useState<"singles" | "doubles">("doubles");
  const [singlesPlayerA, setSinglesPlayerA] = useState<string | null>(null);
  const [singlesPlayerB, setSinglesPlayerB] = useState<string | null>(null);

  // Point Cap logic
  const defaultPointCaps: Record<number, number> = {
    7: 11,
    11: 15,
    15: 21,
    21: 30,
  };

  // --- NEW: Default gamePoint/pointCap per tab ---
  const singlesDefaultGamePoint = 11;
  const singlesDefaultPointCap = defaultPointCaps[11];
  const doublesDefaultGamePoint = 15;
  const doublesDefaultPointCap = defaultPointCaps[15];

  const [gamePoint, setGamePoint] = useState<number>(doublesDefaultGamePoint);
  const [pointCap, setPointCap] = useState<number>(doublesDefaultPointCap);

  // --- NEW: Set tab and defaults on open ---
  useEffect(() => {
    if (!visible) return;
    if (activePlayerIds.length <= 3) {
      setTab("singles");
      setGamePoint(singlesDefaultGamePoint);
      setPointCap(singlesDefaultPointCap);
    } else {
      setTab("doubles");
      setGamePoint(doublesDefaultGamePoint);
      setPointCap(doublesDefaultPointCap);
    }
    setSinglesPlayerA(null);
    setSinglesPlayerB(null);
    setTeamAPlayerIds([]);
    setTeamBPlayerIds([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Update pointCap when gamePoint changes
  useEffect(() => {
    setPointCap(defaultPointCaps[gamePoint]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePoint]);

  const [teamAPlayerIds, setTeamAPlayerIds] = useState<string[]>([]);
  const [teamBPlayerIds, setTeamBPlayerIds] = useState<string[]>([]);

  // Only allow point caps >= gamePoint and <= maxCap
  const pointCapOptions = [];
  for (let i = gamePoint; i <= defaultPointCaps[gamePoint]; i++) {
    pointCapOptions.push(i);
  }

  // --- NEW: Randomize for Singles ---
  const handleRandomizeSinglesA = () => {
    if (!session) return;
    const available = activePlayerIds.filter((id) => id !== singlesPlayerB);
    const playerA = randomizePlayer({
      availablePlayerIds: available,
      gamesPlayedPerPlayer: session.gamesPlayedPerPlayer,
    });
    setSinglesPlayerA(playerA);
  };
  const handleRandomizeSinglesB = () => {
    if (!session) return;
    const available = activePlayerIds.filter((id) => id !== singlesPlayerA);
    const playerB = randomizePlayer({
      availablePlayerIds: available,
      gamesPlayedPerPlayer: session.gamesPlayedPerPlayer,
    });
    setSinglesPlayerB(playerB);
  };

  const handleSelect = (playerId: string, team: "A" | "B") => {
    if (tab === "singles") {
      if (team === "A") {
        setSinglesPlayerA(playerId === singlesPlayerA ? null : playerId);
        if (playerId === singlesPlayerB) setSinglesPlayerB(null);
      } else {
        setSinglesPlayerB(playerId === singlesPlayerB ? null : playerId);
        if (playerId === singlesPlayerA) setSinglesPlayerA(null);
      }
    } else {
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
    if (tab === "singles") {
      if (singlesPlayerA && singlesPlayerB) {
        onStartGame([singlesPlayerA], [singlesPlayerB], gamePoint, pointCap);
      }
      setSinglesPlayerA(null);
      setSinglesPlayerB(null);
      setGamePoint(singlesDefaultGamePoint);
      setPointCap(singlesDefaultPointCap);
    } else {
      onStartGame(teamAPlayerIds, teamBPlayerIds, gamePoint, pointCap);
      setTeamAPlayerIds([]);
      setTeamBPlayerIds([]);
      setGamePoint(doublesDefaultGamePoint);
      setPointCap(doublesDefaultPointCap);
    }
  };

  const handleCancel = () => {
    setTeamAPlayerIds([]);
    setTeamBPlayerIds([]);
    setSinglesPlayerA(null);
    setSinglesPlayerB(null);
    setGamePoint(
      tab === "singles" ? singlesDefaultGamePoint : doublesDefaultGamePoint
    );
    setPointCap(
      tab === "singles" ? singlesDefaultPointCap : doublesDefaultPointCap
    );
    onClose();
  };

  // --- Tab UI ---
  const isDoublesDisabled = activePlayerIds.length <= 3;

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

          {/* Tabs */}
          <View className="flex-row mb-4">
            <TouchableOpacity
              className={`flex-1 py-2 rounded-t-xl items-center border-b-2 ${
                tab === "singles"
                  ? "border-app-primary bg-app-modal-bg"
                  : "border-app-modal-border"
              }`}
              onPress={() => {
                setTab("singles");
                setGamePoint(singlesDefaultGamePoint);
                setPointCap(singlesDefaultPointCap);
                setSinglesPlayerA(null);
                setSinglesPlayerB(null);
              }}
            >
              <Text
                className={`text-lg font-bold ${
                  tab === "singles"
                    ? "text-app-primary"
                    : "text-app-text-primary"
                }`}
              >
                Singles
              </Text>
            </TouchableOpacity>
            {!isDoublesDisabled && (
              <TouchableOpacity
                className={`flex-1 py-2 rounded-t-xl items-center border-b-2 ${
                  tab === "doubles"
                    ? "border-app-primary bg-app-modal-bg"
                    : "border-app-modal-border"
                }`}
                onPress={() => {
                  setTab("doubles");
                  setGamePoint(doublesDefaultGamePoint);
                  setPointCap(doublesDefaultPointCap);
                  setTeamAPlayerIds([]);
                  setTeamBPlayerIds([]);
                }}
              >
                <Text
                  className={`text-lg font-bold ${
                    tab === "doubles"
                      ? "text-app-primary"
                      : "text-app-text-primary"
                  }`}
                >
                  Doubles
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Game Point Selector */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-app-text-primary mb-2">
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
            <Text className="text-lg font-semibold text-app-text-primary mb-2">
              Point Cap
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
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
            {/* Team/Player A Column */}
            <View className="flex-1">
              <View className="flex-row items-center justify-center mb-2 gap-2">
                <Text className="text-lg font-semibold text-app-text-primary text-center">
                  {tab === "singles" ? "Player A" : "Team A"}
                </Text>
                <TouchableOpacity
                  onPress={
                    tab === "singles"
                      ? handleRandomizeSinglesA
                      : handleRandomizeTeamA
                  }
                  accessibilityLabel={
                    tab === "singles"
                      ? "Randomize Player A"
                      : "Randomize Team A"
                  }
                >
                  <MaterialCommunityIcons
                    name={"dice-multiple"}
                    size={30}
                    color="#3B82F6"
                  />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 415 }}>
                {activePlayerIds.map((playerId) => {
                  const player = getPlayerById(playerId);
                  if (!player) return null;
                  const selected =
                    tab === "singles"
                      ? singlesPlayerA === playerId
                      : teamAPlayerIds.includes(playerId);
                  const disabled =
                    tab === "singles"
                      ? singlesPlayerB === playerId
                      : teamBPlayerIds.includes(playerId) ||
                        (teamAPlayerIds.length >= selectionLimit && !selected);
                  return (
                    <TouchableOpacity
                      key={playerId}
                      className={`flex-row justify-between items-center py-3 px-1 border-b border-app-modal-border
              ${selected ? "bg-app-selected" : ""}`}
                      onPress={() => handleSelect(playerId, "A")}
                      disabled={disabled}
                    >
                      <Text
                        className={`text-base font-medium ${
                          disabled
                            ? "text-app-text-disabled"
                            : "text-app-text-primary"
                        }`}
                      >
                        {player.name}
                      </Text>
                      {!disabled && selected && (
                        <View className="w-6 h-6 rounded-full border-2 items-center justify-center bg-app-selected-border border-app-selected-border">
                          <Text className="text-app-white text-sm font-bold">
                            ✓
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Text className="text-center mt-4 text-sm text-app-text-muted">
                {tab === "singles"
                  ? `Player A: ${singlesPlayerA ? 1 : 0}/1`
                  : `Team A: ${teamAPlayerIds.length}/2`}
              </Text>
            </View>

            {/* Team/Player B Column */}
            <View className="flex-1">
              <View className="flex-row items-center justify-center mb-2 gap-2">
                <Text className="text-lg font-semibold text-app-text-primary text-center">
                  {tab === "singles" ? "Player B" : "Team B"}
                </Text>
                <TouchableOpacity
                  onPress={
                    tab === "singles"
                      ? handleRandomizeSinglesB
                      : handleRandomizeTeamB
                  }
                  accessibilityLabel={
                    tab === "singles"
                      ? "Randomize Player B"
                      : "Randomize Team B"
                  }
                >
                  <MaterialCommunityIcons
                    name={"dice-multiple"}
                    size={30}
                    color="#3B82F6"
                  />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 415 }}>
                {activePlayerIds.map((playerId) => {
                  const player = getPlayerById(playerId);
                  if (!player) return null;
                  const selected =
                    tab === "singles"
                      ? singlesPlayerB === playerId
                      : teamBPlayerIds.includes(playerId);
                  const disabled =
                    tab === "singles"
                      ? singlesPlayerA === playerId
                      : teamAPlayerIds.includes(playerId) ||
                        (teamBPlayerIds.length >= selectionLimit && !selected);
                  return (
                    <TouchableOpacity
                      key={playerId}
                      className={`flex-row justify-between items-center py-3 px-1 border-b border-app-modal-border
              ${selected ? "bg-app-selected" : ""}`}
                      onPress={() => handleSelect(playerId, "B")}
                      disabled={disabled}
                    >
                      <Text
                        className={`text-base font-medium ${
                          disabled
                            ? "text-app-text-disabled"
                            : "text-app-text-primary"
                        }`}
                      >
                        {player.name}
                      </Text>
                      {!disabled && selected && (
                        <View className="w-6 h-6 rounded-full border-2 items-center justify-center bg-app-selected-border border-app-selected-border">
                          <Text className="text-app-white text-sm font-bold">
                            ✓
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Text className="text-center mt-4 text-sm text-app-text-muted">
                {tab === "singles"
                  ? `Player B: ${singlesPlayerB ? 1 : 0}/1`
                  : `Team B: ${teamBPlayerIds.length}/2`}
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
                (
                  tab === "singles"
                    ? !singlesPlayerA || !singlesPlayerB
                    : teamAPlayerIds.length !== selectionLimit ||
                      teamBPlayerIds.length !== selectionLimit
                )
                  ? "bg-app-disabled"
                  : "bg-app-primary"
              }`}
              onPress={handleStartGame}
              disabled={
                tab === "singles"
                  ? !singlesPlayerA || !singlesPlayerB
                  : teamAPlayerIds.length !== selectionLimit ||
                    teamBPlayerIds.length !== selectionLimit
              }
            >
              <Text
                className={`text-base font-semibold ${
                  (
                    tab === "singles"
                      ? !singlesPlayerA || !singlesPlayerB
                      : teamAPlayerIds.length !== selectionLimit ||
                        teamBPlayerIds.length !== selectionLimit
                  )
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
