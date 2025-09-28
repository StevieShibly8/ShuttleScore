import { Duo } from "@/data/duoData";
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

  const gameType = game?.gameType ?? "doubles";

  const teamA = game?.teamA;
  const teamB = game?.teamB;

  const scoreA = teamA?.score ?? 0;
  const scoreB = teamB?.score ?? 0;
  const winner = scoreA > scoreB ? "A" : scoreB > scoreA ? "B" : null;

  let duoA: Duo | undefined;
  let duoB: Duo | undefined;
  let teamAPlayer1: Player | undefined;
  let teamAPlayer2: Player | undefined;
  let teamBPlayer1: Player | undefined;
  let teamBPlayer2: Player | undefined;

  let playerA: Player | undefined;
  let playerB: Player | undefined;

  if (gameType === "doubles") {
    duoA = teamA ? getDuoById(teamA.id) : undefined;
    duoB = teamB ? getDuoById(teamB.id) : undefined;
    teamAPlayer1 = duoA ? getPlayerById(duoA.playerIds[0]) : undefined;
    teamAPlayer2 = duoA ? getPlayerById(duoA.playerIds[1]) : undefined;
    teamBPlayer1 = duoB ? getPlayerById(duoB.playerIds[0]) : undefined;
    teamBPlayer2 = duoB ? getPlayerById(duoB.playerIds[1]) : undefined;
  } else {
    playerA = teamA ? getPlayerById(teamA.id) : undefined;
    playerB = teamB ? getPlayerById(teamB.id) : undefined;
  }

  // --- RP Calculation Logic ---
  const getStarCount = (rp1: number, rp2?: number) => {
    const avgRp = rp2 ? Math.min(((rp1 ?? 0) + (rp2 ?? 0)) / 2, 100) : rp1;
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
  let rpA1;
  let rpA2;
  let rpB1;
  let rpB2;

  if (gameType === "doubles") {
    rpA1 = teamAPlayer1?.rp ?? 0;
    rpA2 = teamAPlayer2?.rp ?? 0;
    rpB1 = teamBPlayer1?.rp ?? 0;
    rpB2 = teamBPlayer2?.rp ?? 0;
  } else {
    rpA1 = playerA?.rp ?? 0;
    rpB1 = playerB?.rp ?? 0;
  }
  // Calculate star counts
  const teamAStars = getStarCount(rpA1, rpA2);
  const teamBStars = getStarCount(rpB1, rpB2);

  // Calculate RP changes
  const starDiffA = teamBStars - teamAStars;
  const starDiffB = teamAStars - teamBStars;

  let rpChangeA = 0;
  let rpChangeB = 0;

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
              {gameType === "doubles"
                ? `${teamAPlayer1?.name} & ${teamAPlayer2?.name}`
                : playerA?.name}
            </Text>
            {winner === "A" && (
              <Ionicons name="trophy" size={22} color="#F59E0B" />
            )}
          </View>
          <Text className="text-white text-xl font-bold mb-2">
            Score: {scoreA}
          </Text>
          {/* RP Stats */}
          <View className="w-full flex-row justify-between mt-2">
            {gameType === "doubles" ? (
              <>
                <View className="flex-1 items-center">
                  <Text className="text-app-text-muted text-lg mb-1">
                    {teamAPlayer1?.name}
                  </Text>
                  {renderRpStat(teamAPlayer1, rpChangeA)}
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-app-text-muted text-lg mb-1">
                    {teamAPlayer2?.name}
                  </Text>
                  {renderRpStat(teamAPlayer2, rpChangeA)}
                </View>
              </>
            ) : (
              <View className="flex-1 items-center">
                <Text className="text-app-text-muted text-lg mb-1">
                  {playerA?.name}
                </Text>
                {renderRpStat(playerA, rpChangeA)}
              </View>
            )}
          </View>
        </View>

        {/* Team B */}
        <View className="w-full max-w-xl bg-app-card border border-app-card-border rounded-xl-plus p-6 items-center">
          <View className="flex-row items-center mb-2">
            <Text className="text-white text-lg font-semibold mr-2">
              {gameType === "doubles"
                ? `${teamBPlayer1?.name} & ${teamBPlayer2?.name}`
                : playerB?.name}
            </Text>
            {winner === "B" && (
              <Ionicons name="trophy" size={22} color="#F59E0B" />
            )}
          </View>
          <Text className="text-white text-xl font-bold mb-2">
            Score: {scoreB}
          </Text>
          {/* RP Stats */}
          <View className="w-full flex-row justify-between mt-2">
            {gameType === "doubles" ? (
              <>
                <View className="flex-1 items-center">
                  <Text className="text-app-text-muted text-lg mb-1">
                    {teamBPlayer1?.name}
                  </Text>
                  {renderRpStat(teamBPlayer1, rpChangeB)}
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-app-text-muted text-lg mb-1">
                    {teamBPlayer2?.name}
                  </Text>
                  {renderRpStat(teamBPlayer2, rpChangeB)}
                </View>
              </>
            ) : (
              <View className="flex-1 items-center">
                <Text className="text-app-text-muted text-lg mb-1">
                  {playerB?.name}
                </Text>
                {renderRpStat(playerB, rpChangeB)}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
