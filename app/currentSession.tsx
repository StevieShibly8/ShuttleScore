import { AddPlayersModal } from "@/components/AddPlayersModal";
import { DuoCard } from "@/components/DuoCard";
import { GameCard } from "@/components/GameCard";
import { ModalPopup } from "@/components/ModalPopup";
import { PlayerCard } from "@/components/PlayerCard";
import { StartGameModal } from "@/components/StartGameModal";
import { Duo } from "@/data/duoData";
import { Team } from "@/data/gameData";
import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const TABS = ["Players", "Duos", "Games"] as const;
type TabType = (typeof TABS)[number];

export default function CurrentSessionScreen() {
  const { sessionId } = useLocalSearchParams();
  const session = useSessionStore((state) =>
    state.getSessionById(sessionId as string)
  );
  const addGameToSession = useSessionStore((state) => state.addGameToSession);
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const getDuoById = useDuoStore((state) => state.getDuoById);
  const addDuo = useDuoStore((state) => state.addDuo);
  const endSession = useSessionStore((state) => state.endSession);
  const updatePlayerBenchStatus = useSessionStore(
    (state) => state.updatePlayerBenchStatus
  );
  const [selectedTab, setSelectedTab] = useState<TabType>("Players");
  const [modalVisible, setModalVisible] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

  const date = session?.date ?? "Unknown Date";
  const dateStr = new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const pastGames = session?.pastGames ?? [];
  const playerIds = session?.players ? Object.keys(session.players) : [];
  const duoIds = session?.duoIds ?? [];
  const duration = session?.sessionDuration ?? 2;
  const gamesPlayedPerPlayer = session?.gamesPlayedPerPlayer ?? {};
  const gamesWonPerPlayer = session?.gamesWonPerPlayer ?? {};
  const gamesPlayedPerDuo = session?.gamesPlayedPerDuo ?? {};
  const gamesWonPerDuo = session?.gamesWonPerDuo ?? {};

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
    teamBplayerIds: string[],
    gamePoint: number,
    pointCap: number
  ) => {
    const duoA: Duo = getExistingDuo(teamAplayerIds);
    const duoB: Duo = getExistingDuo(teamBplayerIds);

    const teamAObj: Team = { duoId: duoA.id, score: 0 };
    const teamBObj: Team = { duoId: duoB.id, score: 0 };

    setModalVisible(false);
    addGameToSession(
      sessionId as string,
      teamAObj,
      teamBObj,
      gamePoint,
      pointCap
    );

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
          <View className="flex-1" />
          <TouchableOpacity
            className="bg-app-secondary py-4 px-4 rounded-xl-plus items-center shadow-lg mr-3"
            onPress={() => setShowAddPlayerModal(true)}
          >
            <Text className="text-white font-bold">Add Players</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-app-danger py-4 px-4 rounded-xl-plus items-center shadow-lg"
            onPress={() => {
              setShowEndSessionModal(true);
            }}
          >
            <Text className="text-white font-bold">End Session</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center mb-8">
          <Text className="text-3xl text-white font-800 text-center tracking-tight">
            Current Session
          </Text>
        </View>

        {!session?.currentGame ? (
          <TouchableOpacity
            className="bg-app-primary py-4 rounded-xl-plus items-center mb-8 shadow-lg"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white text-lg font-bold">Start New Game</Text>
          </TouchableOpacity>
        ) : (
          <View className="mb-8">
            <Text className="text-white text-xl font-bold mb-4">
              Current Game
            </Text>
            <GameCard
              key={session.currentGame.id}
              gameId={session.currentGame.id}
              sessionId={sessionId as string}
              isActive={true}
            />
          </View>
        )}

        {/* Session Info */}
        <View className="mb-8">
          <Text className="text-xl text-white font-bold mb-3">
            Session Summary
          </Text>
          <View>
            <View className="flex-row items-center bg-app-modal-bg rounded-lg px-4 py-3 mb-2">
              <Text className="text-white text-base font-semibold flex-1 text-left">
                Date
              </Text>
              <Text className="text-white text-base flex-1 text-right">
                {dateStr}
              </Text>
            </View>
            <View className="flex-row items-center bg-app-modal-bg rounded-lg px-4 py-3 mb-2">
              <Text className="text-white text-base font-semibold flex-1 text-left">
                Duration
              </Text>
              <Text className="text-white text-base flex-1 text-right">
                {duration} hr{duration !== 1 ? "s" : ""}
              </Text>
            </View>
            <View className="flex-row items-center bg-app-modal-bg rounded-lg px-4 py-3 mb-2">
              <Text className="text-white text-base font-semibold flex-1 text-left">
                Total Games
              </Text>
              <Text className="text-white text-base flex-1 text-right">
                {pastGames.length}
              </Text>
            </View>
            <View className="flex-row items-center bg-app-modal-bg rounded-lg px-4 py-3 mb-2">
              <Text className="text-white text-base font-semibold flex-1 text-left">
                Total Players
              </Text>
              <Text className="text-white text-base flex-1 text-right">
                {playerIds.length}
              </Text>
            </View>
            <View className="flex-row items-center bg-app-modal-bg rounded-lg px-4 py-3 mb-2">
              <Text className="text-white text-base font-semibold flex-1 text-left">
                Total Duos
              </Text>
              <Text className="text-white text-base flex-1 text-right">
                {duoIds.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row mb-6">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`flex-1 py-3 rounded-t-lg items-center ${
                selectedTab === tab
                  ? "bg-app-primary"
                  : "bg-app-modal-bg border-b-2 border-app-primary"
              }`}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                className={`text-base font-bold ${
                  selectedTab === tab ? "text-white" : "text-app-primary"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View>
          {selectedTab === "Players" && (
            <View className="space-y-3 pb-8">
              {playerIds.length === 0 ? (
                <View className="items-center justify-center py-12">
                  <Text className="text-app-text-muted text-base text-center">
                    There are no players to display
                  </Text>
                </View>
              ) : (
                playerIds
                  .sort((a, b) => {
                    const nameA =
                      getPlayerById(a)?.name?.toLowerCase() ?? "unknown";
                    const nameB =
                      getPlayerById(b)?.name?.toLowerCase() ?? "unknown";
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                  })
                  .map((playerId) => {
                    const wins = gamesWonPerPlayer[playerId] ?? 0;
                    const played = gamesPlayedPerPlayer[playerId] ?? 0;
                    const losses = played - wins;
                    const isBenched =
                      session?.players?.[playerId]?.isBenched ?? false;

                    return (
                      <PlayerCard
                        key={playerId}
                        id={playerId}
                        wins={wins}
                        losses={losses}
                        showBenchButton={true}
                        isBenched={isBenched}
                        onBenchPress={() => {
                          updatePlayerBenchStatus(
                            sessionId as string,
                            playerId,
                            !isBenched
                          );
                        }}
                      />
                    );
                  })
              )}
            </View>
          )}

          {selectedTab === "Duos" && (
            <View className="space-y-3 pb-8">
              {duoIds.length === 0 ? (
                <View className="items-center justify-center py-12">
                  <Text className="text-app-text-muted text-base text-center">
                    There are no duos to display
                  </Text>
                </View>
              ) : (
                duoIds
                  .sort((a, b) => {
                    const winsA = gamesWonPerDuo[a] ?? 0;
                    const winsB = gamesWonPerDuo[b] ?? 0;
                    return winsB - winsA;
                  })
                  .map((duoId) => {
                    const wins = gamesWonPerDuo[duoId] ?? 0;
                    const played = gamesPlayedPerDuo[duoId] ?? 0;
                    const losses = played - wins;
                    return (
                      <DuoCard
                        key={duoId}
                        id={duoId}
                        wins={wins}
                        losses={losses}
                      />
                    );
                  })
              )}
            </View>
          )}

          {selectedTab === "Games" && (
            <View className="space-y-3 pb-8">
              {!pastGames || pastGames.length === 0 ? (
                <View className="items-center justify-center py-12">
                  <Text className="text-app-text-muted text-base text-center">
                    There are no games to display
                  </Text>
                </View>
              ) : (
                pastGames.map((game) => (
                  <GameCard
                    key={game.id}
                    gameId={game.id}
                    sessionId={sessionId as string}
                    isActive={false}
                  />
                ))
              )}
            </View>
          )}
        </View>
      </View>

      <StartGameModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStartGame={handleStartGame}
        activePlayerIds={
          playerIds
            ? playerIds.filter((pid) => !session?.players?.[pid]?.isBenched)
            : []
        }
        sessionId={sessionId as string}
      />

      <AddPlayersModal
        visible={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
      />

      <ModalPopup
        visible={showEndSessionModal}
        messageTitle="End Session?"
        messageBody="The current session will be ended and you will be routed to the Session Details page. This action cannot be undone. Are you sure you want to continue?"
        cancelText="Cancel"
        confirmText="End"
        cancelButtonColor="#444"
        confirmButtonColor="#921721bc"
        onCancel={() => setShowEndSessionModal(false)}
        onConfirm={() => {
          setShowEndSessionModal(false);
          endSession(sessionId as string);
          router.replace({
            pathname: "/sessionDetails",
            params: { sessionId },
          });
        }}
      />
    </ScrollView>
  );
}
