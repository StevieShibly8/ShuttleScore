import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface StartGameModalProps {
  visible: boolean;
  onClose: () => void;
  onStartGame: (teamAPlayerIds: string[], teamBPlayerIds: string[]) => void;
  sessionPlayerIds: string[];
  sessionId: string;
}

function randomizeTeams({
  sessionPlayerIds,
  gamesPlayedPerPlayer,
  gamesPlayedPerDuo,
  priorityPickPlayerIds,
}: {
  sessionPlayerIds: string[];
  gamesPlayedPerPlayer: Record<string, number>;
  gamesPlayedPerDuo: Record<string, number>;
  priorityPickPlayerIds: string[];
}) {
  // If more than 7 players, ignore priority picks
  if (sessionPlayerIds.length > 7) {
    priorityPickPlayerIds = [];
  }

  // 1. Handle priority picks
  let teamAPlayerIds: string[] = [];
  let teamBPlayerIds: string[] = [];
  let remaining: string[] = [...sessionPlayerIds];

  if (priorityPickPlayerIds.length === 2) {
    // Place each on opposite teams
    teamAPlayerIds.push(priorityPickPlayerIds[0]);
    teamBPlayerIds.push(priorityPickPlayerIds[1]);
    remaining = remaining.filter((id) => !priorityPickPlayerIds.includes(id));
  } else if (priorityPickPlayerIds.length === 1) {
    // Place the one on a random team
    if (Math.random() < 0.5) {
      teamAPlayerIds.push(priorityPickPlayerIds[0]);
    } else {
      teamBPlayerIds.push(priorityPickPlayerIds[0]);
    }
    remaining = remaining.filter((id) => id !== priorityPickPlayerIds[0]);
  }

  // 2. Find players with the least games played
  const minGames = Math.min(
    ...remaining.map((id) => gamesPlayedPerPlayer[id] ?? 0)
  );
  let leastPlayed = remaining.filter(
    (id) => (gamesPlayedPerPlayer[id] ?? 0) === minGames
  );

  // Shuffle leastPlayed for randomness
  leastPlayed = leastPlayed.sort(() => Math.random() - 0.5);

  // Fill up teams with least played players
  for (const id of leastPlayed) {
    if (teamAPlayerIds.length < 2) teamAPlayerIds.push(id);
    else if (teamBPlayerIds.length < 2) teamBPlayerIds.push(id);
    if (teamAPlayerIds.length === 2 && teamBPlayerIds.length === 2) break;
  }

  // If not enough, fill with next least played
  if (teamAPlayerIds.length < 2 || teamBPlayerIds.length < 2) {
    const others = remaining.filter((id) => !leastPlayed.includes(id));
    const shuffled = others.sort(() => Math.random() - 0.5);
    for (const id of shuffled) {
      if (teamAPlayerIds.length < 2) teamAPlayerIds.push(id);
      else if (teamBPlayerIds.length < 2) teamBPlayerIds.push(id);
      if (teamAPlayerIds.length === 2 && teamBPlayerIds.length === 2) break;
    }
  }

  // 3. Check for duo fairness
  // Get all possible duos from the selected 4 players
  const allCombos = [
    [teamAPlayerIds[0], teamAPlayerIds[1]],
    [teamBPlayerIds[0], teamBPlayerIds[1]],
  ].map((duo) => duo.slice().sort().join("-"));

  const currentDuoGames = allCombos.map(
    (duoId) => gamesPlayedPerDuo[duoId] ?? 0
  );
  const maxCurrentDuoGames = Math.max(...currentDuoGames);

  // Now, check if any other possible duo among these 4 would have a lower games played
  const allPlayers = [...teamAPlayerIds, ...teamBPlayerIds];
  let bestDuoPair = null;
  let minMaxGames = maxCurrentDuoGames;

  // Generate all possible splits of 4 players into two teams of 2
  const splits = [
    [
      [allPlayers[0], allPlayers[1]],
      [allPlayers[2], allPlayers[3]],
    ],
    [
      [allPlayers[0], allPlayers[2]],
      [allPlayers[1], allPlayers[3]],
    ],
    [
      [allPlayers[0], allPlayers[3]],
      [allPlayers[1], allPlayers[2]],
    ],
  ];

  for (const [[a1, a2], [b1, b2]] of splits) {
    const duoA = [a1, a2].slice().sort().join("-");
    const duoB = [b1, b2].slice().sort().join("-");
    const gamesA = gamesPlayedPerDuo[duoA] ?? 0;
    const gamesB = gamesPlayedPerDuo[duoB] ?? 0;
    const maxGames = Math.max(gamesA, gamesB);
    if (maxGames < minMaxGames) {
      minMaxGames = maxGames;
      bestDuoPair = { teamA: [a1, a2], teamB: [b1, b2] };
    }
  }

  if (bestDuoPair) {
    teamAPlayerIds = bestDuoPair.teamA;
    teamBPlayerIds = bestDuoPair.teamB;
  }

  return { teamAPlayerIds, teamBPlayerIds };
}

export default function StartGameModal({
  visible,
  onClose,
  onStartGame,
  sessionPlayerIds,
  sessionId,
}: StartGameModalProps) {
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const [teamAPlayerIds, setTeamAPlayerIds] = useState<string[]>([]);
  const [teamBPlayerIds, setTeamBPlayerIds] = useState<string[]>([]);
  const session = useSessionStore((state) => state.getSessionById(sessionId));

  const selectionLimit = 2;

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

  const handleRandomize = () => {
    if (!session) return;
    const { teamAPlayerIds, teamBPlayerIds } = randomizeTeams({
      sessionPlayerIds,
      gamesPlayedPerPlayer: session.gamesPlayedPerPlayer,
      gamesPlayedPerDuo: session.gamesPlayedPerDuo,
      priorityPickPlayerIds: session.priorityPickPlayerIds,
    });
    setTeamAPlayerIds(teamAPlayerIds);
    setTeamBPlayerIds(teamBPlayerIds);
  };

  const handleStartGame = () => {
    onStartGame(teamAPlayerIds, teamBPlayerIds);
    setTeamAPlayerIds([]);
    setTeamBPlayerIds([]);
  };

  const handleCancel = () => {
    setTeamAPlayerIds([]);
    setTeamBPlayerIds([]);
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
            Select 2 Players for Each Team
          </Text>

          {/* Team A List */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-app-primary mb-2">
              Team A
            </Text>
            <ScrollView
              style={{ maxHeight: 264 }}
              keyboardShouldPersistTaps="handled"
            >
              {sessionPlayerIds.map((playerId) => {
                const player = getPlayerById(playerId);
                if (!player) return null;
                const selected = teamAPlayerIds.includes(playerId);
                const disabled =
                  teamBPlayerIds.includes(playerId) ||
                  (teamAPlayerIds.length >= selectionLimit && !selected);
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
                        className={`w-6 h-6 mr-2 rounded-full border-2 items-center justify-center
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
          </View>

          {/* Team B List */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-app-primary mb-2">
              Team B
            </Text>
            <ScrollView
              style={{ maxHeight: 264 }}
              keyboardShouldPersistTaps="handled"
            >
              {sessionPlayerIds.map((playerId) => {
                const player = getPlayerById(playerId);
                if (!player) return null;
                const selected = teamBPlayerIds.includes(playerId);
                const disabled =
                  teamAPlayerIds.includes(playerId) ||
                  (teamBPlayerIds.length >= selectionLimit && !selected);
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
                        className={`w-6 h-6 mr-2 rounded-full border-2 items-center justify-center
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
          </View>

          <Text className="text-center mb-6 text-sm text-app-text-muted">
            Team A: {teamAPlayerIds.length}/2 Team B: {teamBPlayerIds.length}
            /2
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
          <TouchableOpacity
            className="w-full py-4 rounded-xl bg-app-secondary items-center mb-4"
            onPress={handleRandomize}
          >
            <Text className="text-app-white text-base font-semibold">
              Randomize Selection
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
