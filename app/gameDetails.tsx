import { Player } from "@/data/playerData";
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

  const duoA = getDuoById(game.teamA.duoId);
  const duoB = getDuoById(game.teamB.duoId);

  const teamAPlayer1 = duoA ? getPlayerById(duoA.playerIds[0]) : undefined;
  const teamAPlayer2 = duoA ? getPlayerById(duoA.playerIds[1]) : undefined;
  const teamBPlayer1 = duoB ? getPlayerById(duoB.playerIds[0]) : undefined;
  const teamBPlayer2 = duoB ? getPlayerById(duoB.playerIds[1]) : undefined;

  // --- RP Calculation Logic ---
  const getStarCount = (rp1: number, rp2: number) => {
    const avgRp = Math.min(((rp1 ?? 0) + (rp2 ?? 0)) / 2, 100);
    return Math.max(1, Math.floor(avgRp / 20) + 1);
  };

  const getRpChange = (starDiff: number, didWin: boolean) => {
    if (starDiff === 0) return didWin ? 3 : -2;
    if (starDiff === 1) return didWin ? 4 : -1;
    if (starDiff === 2) return didWin ? 5 : 0;
    if (starDiff === 3) return didWin ? 6 : 1;
    if (starDiff >= 4) return didWin ? 7 : 2;
    if (starDiff === -1) return didWin ? 3 : -2;
    if (starDiff === -2) return didWin ? 2 : -4;
    if (starDiff === -3) return didWin ? 1 : -6;
    if (starDiff <= -4) return didWin ? 1 : -8;
    return 0;
  };

  // Get current RPs
  const rpA1 = teamAPlayer1?.rp ?? 0;
  const rpA2 = teamAPlayer2?.rp ?? 0;
  const rpB1 = teamBPlayer1?.rp ?? 0;
  const rpB2 = teamBPlayer2?.rp ?? 0;

  // Calculate star counts
  const teamAStars = getStarCount(rpA1, rpA2);
  const teamBStars = getStarCount(rpB1, rpB2);

  // Calculate RP changes
  const starDiffA = teamBStars - teamAStars;
  const starDiffB = teamAStars - teamBStars;

  let rpChangeA = 0,
    rpChangeB = 0;
  if (winner === "A") {
    rpChangeA = getRpChange(starDiffA, true);
    rpChangeB = getRpChange(starDiffB, false);
  } else if (winner === "B") {
    rpChangeA = getRpChange(starDiffA, false);
    rpChangeB = getRpChange(starDiffB, true);
  }

  // Helper to render RP stat
  const renderRpStat = (player: Player | undefined, rpChange: number) => {
    if (!player) {
      return <Text className="text-white text-base">-</Text>;
    }
    const currentRp = player.rp ?? 0;
    const changeColor = rpChange >= 0 ? "#22c55e" : "#ef4444";
    const sign = rpChange > 0 ? "+" : "";
    return (
      <Text className="text-white text-base">
        {currentRp}{" "}
        <Text style={{ color: changeColor }}>
          ({sign}
          {rpChange})
        </Text>
      </Text>
    );
  };

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
          <Text className="text-white text-xl font-bold mb-2">
            Score: {teamAScore}
          </Text>
          {/* RP Stats */}
          <View className="w-full flex-row justify-between mt-2">
            <View className="flex-1">
              <Text className="text-app-text-muted text-xs mb-1">
                {teamAPlayer1?.name}
              </Text>
              {renderRpStat(teamAPlayer1, rpChangeA)}
            </View>
            <View className="flex-1">
              <Text className="text-app-text-muted text-xs mb-1">
                {teamAPlayer2?.name}
              </Text>
              {renderRpStat(teamAPlayer2, rpChangeA)}
            </View>
          </View>
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
          <Text className="text-white text-xl font-bold mb-2">
            Score: {teamBScore}
          </Text>
          {/* RP Stats */}
          <View className="w-full flex-row justify-between mt-2">
            <View className="flex-1">
              <Text className="text-app-text-muted text-xs mb-1">
                {teamBPlayer1?.name}
              </Text>
              {renderRpStat(teamBPlayer1, rpChangeB)}
            </View>
            <View className="flex-1">
              <Text className="text-app-text-muted text-xs mb-1">
                {teamBPlayer2?.name}
              </Text>
              {renderRpStat(teamBPlayer2, rpChangeB)}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
