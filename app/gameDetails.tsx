import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function GameDetailsScreen() {
  const { sessionId, gameId } = useLocalSearchParams();
  const getGameById = useSessionStore((state) => state.getGameById);
  const getDuoById = useDuoStore((state) => state.getDuoById);
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);

  const game = getGameById(sessionId as string, gameId as string);

  if (!game) {
    return (
      <View className="flex-1 justify-center items-center bg-app-background">
        <Text className="text-white text-lg">Game not found.</Text>
      </View>
    );
  }

  const teamAScore = game.teamA.score ?? 0;
  const teamBScore = game.teamB.score ?? 0;
  const winner =
    teamAScore > teamBScore ? "A" : teamBScore > teamAScore ? "B" : null;

  const duoA = game?.teamA ? getDuoById(game.teamA.duoId) : undefined;
  const duoB = game?.teamB ? getDuoById(game.teamB.duoId) : undefined;

  const teamAPlayer1 = duoA?.playerIds?.[0]
    ? getPlayerById(duoA.playerIds[0])
    : undefined;
  const teamAPlayer2 = duoA?.playerIds?.[1]
    ? getPlayerById(duoA.playerIds[1])
    : undefined;
  const teamBPlayer1 = duoB?.playerIds?.[0]
    ? getPlayerById(duoB.playerIds[0])
    : undefined;
  const teamBPlayer2 = duoB?.playerIds?.[1]
    ? getPlayerById(duoB.playerIds[1])
    : undefined;

  return (
    <View className="flex-1 bg-app-background p-5">
      {/* Top bar */}
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View className="flex-1" />
      </View>

      {/* Title */}
      <View className="items-center mb-8">
        <Text className="text-3xl text-white font-800 text-center tracking-tight">
          Game Details
        </Text>
      </View>

      {/* Teams */}
      <View className="flex-col items-center w-full">
        {/* Team A */}
        <View className="w-full max-w-xl bg-app-card border border-app-card-border rounded-xl-plus p-6 items-center mb-8">
          <View className="flex-row items-center mb-2">
            <Text className="text-white text-lg font-semibold mr-2">
              Team A
            </Text>
            {winner === "A" && (
              <Ionicons name="trophy" size={22} color="#F59E0B" />
            )}
          </View>
          <Text className="text-white text-base mb-1">
            {teamAPlayer1?.name} & {teamAPlayer2?.name}
          </Text>
          <Text className="text-white text-xl font-bold">
            Score: {teamAScore}
          </Text>
        </View>

        {/* Team B */}
        <View className="w-full max-w-xl bg-app-card border border-app-card-border rounded-xl-plus p-6 items-center">
          <View className="flex-row items-center mb-2">
            <Text className="text-white text-lg font-semibold mr-2">
              Team B
            </Text>
            {winner === "B" && (
              <Ionicons name="trophy" size={22} color="#F59E0B" />
            )}
          </View>
          <Text className="text-white text-base mb-1">
            {teamBPlayer1?.name} & {teamBPlayer2?.name}
          </Text>
          <Text className="text-white text-xl font-bold">
            Score: {teamBScore}
          </Text>
        </View>
      </View>
    </View>
  );
}
