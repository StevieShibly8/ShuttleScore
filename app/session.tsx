import { GameCard } from "@/components/GameCard";
import { PlayerCard } from "@/components/PlayerCard";
import StartGameModal from "@/components/StartGameModal";
import { Duo } from "@/data/duoData";
import { Team } from "@/data/gameData";
import { useDuoStore } from "@/stores/duoStore";
import { useSessionStore } from "@/stores/sessionStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SessionScreen() {
  const { sessionId } = useLocalSearchParams();
  const getSessionById = useSessionStore((state) => state.getSessionById);
  const addGameToSession = useSessionStore((state) => state.addGameToSession);
  const getDuoById = useDuoStore((state) => state.getDuoById);
  const addDuo = useDuoStore((state) => state.addDuo);
  const endSession = useSessionStore((state) => state.endSession);

  const [modalVisible, setModalVisible] = useState(false);

  const session = getSessionById(sessionId as string);
  const pastGames = session?.pastGames;
  const playerIds = session?.playerIds;

  const getExistingOrCreateNewDuo = (playerIds: string[]): Duo => {
    const sortedIds = [...playerIds].sort();
    const duoId = sortedIds.join("-");
    const existingDuo = getDuoById(duoId);
    if (existingDuo) {
      return existingDuo;
    }
    const newDuo = addDuo(sortedIds);
    return newDuo;
  };

  const handleStartGame = (): ((
    teamAplayerIds: { playerIds: string[] },
    teamBplayerIds: { playerIds: string[] }
  ) => void) => {
    return (teamA, teamB) => {
      const duoA: Duo = getExistingOrCreateNewDuo(teamA.playerIds);
      const duoB: Duo = getExistingOrCreateNewDuo(teamB.playerIds);

      const teamAObj: Team = { duoId: duoA.id, score: 0 };
      const teamBObj: Team = { duoId: duoB.id, score: 0 };

      setModalVisible(false);
      addGameToSession(sessionId as string, teamAObj, teamBObj);

      router.push({
        pathname: "/game",
        params: { sessionId },
      });
    };
  };

  return (
    <ScrollView className="flex-1 bg-app-black">
      <View className="p-5">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-3xl text-white font-800 flex-1">Session</Text>
        </View>

        {session?.isSessionActive && (
          <>
            <TouchableOpacity
              className="bg-app-primary py-5 rounded-xl-plus items-center mb-8 shadow-lg"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-white text-lg font-bold">
                Start New Game
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-app-danger py-4 rounded-xl-plus items-center mb-8 shadow-lg"
              onPress={() => {
                endSession(sessionId as string);
                router.push("/sessions");
              }}
            >
              <Text className="text-white text-lg font-bold">End Session</Text>
            </TouchableOpacity>
          </>
        )}

        <View className="mb-8">
          <Text className="text-white text-xl font-bold mb-4">Players</Text>
          <View className="space-y-3">
            {playerIds?.map((playerId) => (
              <TouchableOpacity
                key={playerId}
                onPress={() =>
                  router.push({
                    pathname: "/player",
                    params: { playerId },
                  })
                }
              >
                <PlayerCard id={playerId} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="space-y-3 pb-8">
          <Text className="text-white text-xl font-bold mb-4">Games</Text>
          {!pastGames || pastGames.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-app-text-muted text-base text-center">
                There are no games to display
              </Text>
            </View>
          ) : (
            pastGames.map((game) => (
              <TouchableOpacity
                key={game.id}
                onPress={() =>
                  router.push({
                    pathname: "/game",
                    params: { gameId: game.id, sessionId },
                  })
                }
              >
                <GameCard game={game} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
      <StartGameModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStartGame={handleStartGame()}
        sessionPlayerIds={playerIds ?? []}
      />
    </ScrollView>
  );
}
