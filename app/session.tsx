import { DuoCard } from "@/components/DuoCard";
import { GameCard } from "@/components/GameCard";
import ModalPopup from "@/components/ModalPopup";
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
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);

  const session = getSessionById(sessionId as string);
  const pastGames = session?.pastGames;
  const playerIds = session?.playerIds;
  const duoIds = session?.duoIds;

  const getExistingDuo = (playerIds: string[]): Duo => {
    const sortedIds = [...playerIds].sort();
    const duoId = sortedIds.join("-");
    const existingDuo = getDuoById(duoId);
    if (existingDuo) {
      return existingDuo;
    }
    const newDuo = addDuo(sortedIds);
    return newDuo;
  };

  const handleStartGame = (
    teamAplayerIds: string[],
    teamBplayerIds: string[]
  ) => {
    const duoA: Duo = getExistingDuo(teamAplayerIds);
    const duoB: Duo = getExistingDuo(teamBplayerIds);

    const teamAObj: Team = { duoId: duoA.id, score: 0 };
    const teamBObj: Team = { duoId: duoB.id, score: 0 };

    setModalVisible(false);
    addGameToSession(sessionId as string, teamAObj, teamBObj);

    router.push({
      pathname: "/currentGame",
      params: { sessionId },
    });
  };

  return (
    <ScrollView className="flex-1 bg-app-background">
      <View className="p-5">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-3xl text-white font-800 flex-1">Home</Text>
          {session?.isSessionActive && (
            <TouchableOpacity
              className="bg-app-danger py-4 px-4 rounded-xl-plus items-center shadow-lg"
              onPress={() => {
                setShowEndSessionModal(true);
              }}
            >
              <Text className="text-white font-bold">End Session</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quit Confirmation Popup */}
        <ModalPopup
          visible={showEndSessionModal}
          messageTitle="End Session?"
          messageBody="The current session will be ended and you will be rerouted to the Sessions page. This action cannot be undone."
          cancelText="Cancel"
          confirmText="End"
          cancelButtonColor="#444"
          confirmButtonColor="#921721bc"
          onCancel={() => setShowEndSessionModal(false)}
          onConfirm={() => {
            setShowEndSessionModal(false);
            endSession(sessionId as string);
            router.replace("/sessions");
          }}
        />

        {session?.isSessionActive && (
          <>
            {!session.currentGame ? (
              <TouchableOpacity
                className="bg-app-primary py-4 rounded-xl-plus items-center mb-8 shadow-lg"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-white text-lg font-bold">
                  Start New Game
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="mb-8">
                <Text className="text-white text-xl font-bold mb-4">
                  Current Game
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/currentGame",
                      params: { sessionId },
                    })
                  }
                >
                  <GameCard game={session.currentGame} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <View className="mb-8">
          <Text className="text-white text-xl font-bold mb-4">Players</Text>
          <View className="space-y-3">
            {[...(playerIds ?? [])]
              .sort((a, b) => {
                const winsA = session?.gamesWonPerPlayer[a] ?? 0;
                const winsB = session?.gamesWonPerPlayer[b] ?? 0;
                return winsB - winsA; // Descending order
              })
              .map((playerId) => {
                const wins = session?.gamesWonPerPlayer[playerId] ?? 0;
                const played = session?.gamesPlayedPerPlayer[playerId] ?? 0;
                const losses = played - wins;
                return (
                  <TouchableOpacity
                    key={playerId}
                    onPress={() =>
                      router.push({
                        pathname: "/playerProfile",
                        params: { playerId },
                      })
                    }
                  >
                    <PlayerCard
                      id={playerId}
                      wins={wins}
                      losses={losses}
                      played={played}
                    />
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-white text-xl font-bold mb-4">Duos</Text>
          <View className="space-y-3">
            {[...(duoIds ?? [])]
              .sort((a, b) => {
                const winsA = session?.gamesWonPerDuo[a] ?? 0;
                const winsB = session?.gamesWonPerDuo[b] ?? 0;
                return winsB - winsA; // Descending order
              })
              .map((duoId) => {
                const wins = session?.gamesWonPerDuo[duoId] ?? 0;
                const played = session?.gamesPlayedPerDuo[duoId] ?? 0;
                const losses = played - wins;
                return (
                  <TouchableOpacity
                    key={duoId}
                    onPress={() =>
                      router.push({
                        pathname: "/duoProfile",
                        params: { duoId },
                      })
                    }
                  >
                    <DuoCard
                      id={duoId}
                      wins={wins}
                      losses={losses}
                      played={played}
                    />
                  </TouchableOpacity>
                );
              })}
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
                    pathname: "/pastGame",
                    params: { sessionId, gameId: game.id },
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
        onStartGame={handleStartGame}
        sessionPlayerIds={playerIds ?? []}
        sessionId={sessionId as string}
      />
    </ScrollView>
  );
}
