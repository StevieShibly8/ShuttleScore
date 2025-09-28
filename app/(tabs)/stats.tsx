import { PlayerCard } from "@/components/PlayerCard";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function StatsScreen() {
  const sessions = useSessionStore((state) => state.sessions);
  const players = usePlayerStore((state) => state.players);

  const totalSessions = sessions.length;
  const totalGames = sessions.reduce(
    (sum, session) => sum + session.pastGames.length,
    0
  );
  const averageGamesPerSession =
    totalSessions > 0 ? Math.round(totalGames / totalSessions) : 0;

  const [tab, setTab] = useState<"ranked" | "unranked">("ranked");

  return (
    <ScrollView className="flex-1 bg-app-background">
      <View className="p-5">
        <View className="items-center mb-8">
          <Text className="text-3xl text-white font-800 text-center tracking-tight">
            Statistics
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-white text-lg font-bold mb-4">
            Overall Stats
          </Text>
          <View className="space-y-3">
            <View className="flex-row justify-between p-4 mb-2 rounded-xl-plus bg-app-card border border-app-card-border">
              <Text className="text-app-text-secondary">Total Games</Text>
              <Text className="text-white font-semibold">{totalGames}</Text>
            </View>
            <View className="flex-row justify-between p-4 mb-2 rounded-xl-plus bg-app-card border border-app-card-border">
              <Text className="text-app-text-secondary">Total Sessions</Text>
              <Text className="text-white font-semibold">{totalSessions}</Text>
            </View>
            <View className="flex-row justify-between p-4 rounded-xl-plus bg-app-card border border-app-card-border">
              <Text className="text-app-text-secondary">Avg Games/Session</Text>
              <Text className="text-white font-semibold">
                {averageGamesPerSession}
              </Text>
            </View>
          </View>
        </View>

        <View className="space-y-3">
          <Text className="text-white text-lg font-bold mb-4">Leaderboard</Text>
          {/* Tabs */}
          <View className="flex-row mb-4">
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: tab === "ranked" ? "#6C935C" : "#23272f",
                paddingVertical: 10,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }}
              onPress={() => setTab("ranked")}
            >
              <Text
                style={{
                  color: tab === "ranked" ? "#fff" : "#aaa",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Ranked
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: tab === "unranked" ? "#6C935C" : "#23272f",
                paddingVertical: 10,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
              onPress={() => setTab("unranked")}
            >
              <Text
                style={{
                  color: tab === "unranked" ? "#fff" : "#aaa",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Unranked
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            {tab === "ranked" ? (
              <>
                <Text className="text-sm text-app-text-muted mb-2">
                  Play a minimum of 30 games to be ranked.
                </Text>
                {[...players]
                  .filter((player) => {
                    const played = (player.wins ?? 0) + (player.losses ?? 0);
                    return played >= 30;
                  })
                  .sort((a, b) => {
                    const aWins = a.wins ?? 0;
                    const aLosses = a.losses ?? 0;
                    const aPlayed = aWins + aLosses;
                    const aWinRate = aWins / aPlayed;

                    const bWins = b.wins ?? 0;
                    const bLosses = b.losses ?? 0;
                    const bPlayed = bWins + bLosses;
                    const bWinRate = bWins / bPlayed;

                    return (
                      bWinRate - aWinRate || bPlayed - aPlayed || b.rp - a.rp
                    );
                  })
                  .map((player, index) => (
                    <PlayerCard
                      key={player.id}
                      id={player.id}
                      rank={index + 1}
                    />
                  ))}
              </>
            ) : (
              <>
                <Text className="text-sm text-app-text-muted mb-2">
                  All players are shown below.
                </Text>
                {[...players]
                  .sort((a, b) => {
                    const aWins = a.wins ?? 0;
                    const aLosses = a.losses ?? 0;
                    const aPlayed = aWins + aLosses;
                    const aWinRate = aWins / aPlayed;

                    const bWins = b.wins ?? 0;
                    const bLosses = b.losses ?? 0;
                    const bPlayed = bWins + bLosses;
                    const bWinRate = bWins / bPlayed;

                    return (
                      bWinRate - aWinRate || bPlayed - aPlayed || b.rp - a.rp
                    );
                  })
                  .map((player, index) => (
                    <PlayerCard
                      key={player.id}
                      id={player.id}
                      rank={index + 1}
                    />
                  ))}
              </>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
