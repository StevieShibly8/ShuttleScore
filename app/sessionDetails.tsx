import { DuoCard } from "@/components/DuoCard";
import { EditSessionModal } from "@/components/EditSessionModal";
import { GameCard } from "@/components/GameCard";
import { PlayerCard } from "@/components/PlayerCard";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const TABS = ["Games", "Players", "Duos"] as const;
type TabType = (typeof TABS)[number];

export default function SessionDetailsScreen() {
  const { sessionId } = useLocalSearchParams();
  const session = useSessionStore((state) =>
    state.getSessionById(sessionId as string)
  );
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);

  const [showEditSessionModal, setShowEditSessionModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabType>("Games");

  const date = session?.date ?? "Unknown Date";
  const pastGames = session?.pastGames ?? [];
  const playerIds = session?.players ? Object.keys(session.players) : [];
  const duoIds = session?.duoIds ?? [];
  const duration = session?.sessionDuration ?? 2;

  const sessionCost = duration * 25;
  const miscCosts = session?.miscCosts ?? [];
  const totalMiscCost = miscCosts.reduce((sum, mc) => sum + mc.amount, 0);
  const totalCost = sessionCost + totalMiscCost;

  const gamesPlayedPerPlayer = session?.gamesPlayedPerPlayer ?? {};
  const gamesWonPerPlayer = session?.gamesWonPerPlayer ?? {};
  const gamesPlayedPerDuo = session?.gamesPlayedPerDuo ?? {};
  const gamesWonPerDuo = session?.gamesWonPerDuo ?? {};

  // Calculate total games played by all players
  const totalGamesPlayedByPlayers = Object.values(gamesPlayedPerPlayer).reduce(
    (sum, num) => sum + num,
    0
  );

  // Calculate how much each player owes
  const playerOwes: Record<string, number> = {};
  playerIds.forEach((playerId) => {
    const games = gamesPlayedPerPlayer[playerId] ?? 0;
    playerOwes[playerId] =
      totalGamesPlayedByPlayers > 0
        ? (games / totalGamesPlayedByPlayers) * totalCost
        : 0;
  });

  if (!session) {
    return (
      <View className="flex-1 bg-app-background justify-center items-center">
        <Text className="text-white text-lg">This session does not exist.</Text>
        <TouchableOpacity
          className="mt-6 px-6 py-3 bg-app-primary rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-app-background">
      <View className="p-5">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View className="flex-1" />
          <TouchableOpacity
            className="bg-app-secondary py-3 px-4 rounded-xl-plus items-center shadow-lg"
            onPress={() => setShowEditSessionModal(true)}
          >
            <Text className="text-white font-bold">Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Session Details Header */}
        <View className="items-center mb-8">
          <Text className="text-3xl text-white font-800 text-center tracking-tight">
            Session Details
          </Text>
        </View>

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
                {date}
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

        {/* Cost Summary */}
        <View className="mb-8">
          <Text className="text-xl text-white font-bold mb-3">
            Cost Summary
          </Text>
          <View>
            <View className="flex-row items-center bg-app-modal-bg rounded-lg px-4 py-3 mb-2">
              <Text className="text-white text-base font-semibold flex-1 text-left">
                Session Cost
              </Text>
              <Text className="text-white text-base flex-1 text-right">
                ${sessionCost.toFixed(2)}
              </Text>
            </View>
            {miscCosts.map((mc, index) => (
              <View
                key={index}
                className="flex-row items-center bg-app-modal-bg rounded-lg px-4 py-3 mb-2"
              >
                <Text className="text-white text-base font-semibold flex-1 text-left">
                  {mc.label}
                </Text>
                <Text className="text-white text-base flex-1 text-right">
                  ${mc.amount.toFixed(2)}
                </Text>
              </View>
            ))}
            <View className="flex-row items-center bg-app-modal-bg rounded-lg px-4 py-3 mb-2">
              <Text className="text-white text-base font-semibold flex-1 text-left">
                Total Cost
              </Text>
              <Text className="text-white text-base flex-1 text-right">
                ${totalCost.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Owed Amounts */}
        <View className="mb-8">
          <Text className="text-xl text-white font-bold mb-3">
            Owed Amounts
          </Text>
          <View>
            {playerIds
              .sort((a, b) => {
                const gamesA = gamesPlayedPerPlayer[a] ?? 0;
                const gamesB = gamesPlayedPerPlayer[b] ?? 0;
                return gamesB - gamesA;
              })
              .map((playerId) => {
                const player = getPlayerById(playerId);
                return (
                  <View
                    key={playerId}
                    className="flex-row items-center bg-app-modal-bg rounded-lg px-4 py-3 mb-2"
                  >
                    <Text className="text-white text-base font-semibold flex-1 text-left">
                      {player?.name}
                    </Text>
                    <View className="flex-1 items-center">
                      <Text className="text-white text-base">
                        Games: {gamesPlayedPerPlayer[playerId] ?? 0}
                      </Text>
                    </View>
                    <Text className="text-white text-base flex-1 text-right">
                      Owes: ${playerOwes[playerId].toFixed(2)}
                    </Text>
                  </View>
                );
              })}
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
          {selectedTab === "Games" && (
            <View className="space-y-3 pb-8">
              {pastGames.length === 0 ? (
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
                    const winsA = gamesWonPerPlayer[a] ?? 0;
                    const playedA = gamesPlayedPerPlayer[a] ?? 0;
                    const winRateA = playedA > 0 ? winsA / playedA : 0;

                    const winsB = gamesWonPerPlayer[b] ?? 0;
                    const playedB = gamesPlayedPerPlayer[b] ?? 0;
                    const winRateB = playedB > 0 ? winsB / playedB : 0;
                    return winRateB - winRateA;
                  })
                  .map((playerId, index) => {
                    const wins = gamesWonPerPlayer[playerId] ?? 0;
                    const played = gamesPlayedPerPlayer[playerId] ?? 0;
                    const losses = played - wins;
                    return (
                      <PlayerCard
                        key={playerId}
                        id={playerId}
                        wins={wins}
                        losses={losses}
                        rank={index + 1}
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
        </View>
      </View>
      <EditSessionModal
        visible={showEditSessionModal}
        onClose={() => setShowEditSessionModal(false)}
        sessionId={sessionId as string}
      />
    </ScrollView>
  );
}
