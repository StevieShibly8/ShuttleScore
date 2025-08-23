import { PlayerCard } from "@/components/PlayerCard";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import { ScrollView, Text, View } from "react-native";

export default function StatsScreen() {
  const sessions = useSessionStore((state) => state.sessions);
  const players = usePlayerStore((state) => state.players);

  const totalSessions = sessions.length;
  const totalGames = sessions.reduce(
    (sum, session) => sum + session.pastGames.length,
    0
  );
  const averageGamesPerSession =
    totalSessions > 0 ? (totalGames / totalSessions).toFixed(2) : "0.00";

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
          <Text className="text-white text-lg font-bold mb-4">
            Player Performance
          </Text>
          {[...players]
            .sort((a, b) => {
              const aWins = a.wins ?? 0;
              const aLosses = a.losses ?? 0;
              const aPlayed = aWins + aLosses;
              const aWinRate = aPlayed > 0 ? aWins / aPlayed : 0;

              const bWins = b.wins ?? 0;
              const bLosses = b.losses ?? 0;
              const bPlayed = bWins + bLosses;
              const bWinRate = bPlayed > 0 ? bWins / bPlayed : 0;

              return bWinRate - aWinRate;
            })
            .map((player, index) => (
              <PlayerCard key={player.id} id={player.id} rank={index + 1} />
            ))}
        </View>
      </View>
    </ScrollView>
  );
}
