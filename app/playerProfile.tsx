import { usePlayerStore } from "@/stores/playerStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PlayerProfile() {
  const { playerId } = useLocalSearchParams();
  const player = usePlayerStore((state) =>
    state.getPlayerById(playerId as string)
  );

  if (!player) {
    return (
      <View className="flex-1 bg-app-background justify-center items-center">
        <Text className="text-white text-2xl font-bold">Player not found</Text>
      </View>
    );
  }

  const totalGames = player.wins + player.losses;
  const winRate =
    totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(1) : "0";

  const cappedRp = Math.min(player.rp ?? 0, 100);
  const starCount = Math.max(1, Math.floor(cappedRp / 20) + 1);

  return (
    <ScrollView className="flex-1 bg-app-background">
      <View className="p-5">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View className="items-center mb-8">
          <Text className="text-3xl text-white font-800 text-center tracking-tight">
            {player.name}
          </Text>
          <View className="flex-row mt-2">
            {[...Array(starCount)].map((_, i) => (
              <Text
                key={i}
                className="text-yellow-400 text-4xl text-app-warning"
              >
                ★
              </Text>
            ))}
          </View>
        </View>

        <View className="w-full max-w-xl bg-app-card border border-app-card-border rounded-xl-plus p-6">
          <Stat label="Games Played" value={totalGames} />
          <Stat label="Wins" value={player.wins} />
          <Stat label="Losses" value={player.losses} />
          <Stat label="Win Rate" value={`${winRate}%`} />
          <Stat label="RP" value={player.rp} />
          {player.email && <Stat label="Email" value={player.email} />}
        </View>
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-app-modal-border last:border-b-0">
      <Text className="text-app-text-muted text-lg">{label}</Text>
      <Text className="text-white text-lg font-semibold">{value}</Text>
    </View>
  );
}
