import { ScrollView, Text, View } from "react-native";

export default function StatsScreen() {
  const playerStats = [
    { name: "Zubair Shibly", wins: 15, losses: 8, winRate: 65 },
    { name: "Nilin Reza", wins: 12, losses: 6, winRate: 67 },
    { name: "Junaid Wali", wins: 14, losses: 10, winRate: 58 },
    { name: "Tawsif Hasan", wins: 9, losses: 7, winRate: 56 },
  ];

  const overallStats = {
    totalGames: 47,
    totalSessions: 8,
    averageGamesPerSession: 5.9,
    longestSession: "2h 45m",
  };

  return (
    <ScrollView className="flex-1 bg-app-black">
      <View className="p-5 pt-20">
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
            <View className="flex-row justify-between p-4 rounded-xl-plus bg-app-card border border-app-card-border">
              <Text className="text-app-text-secondary">Total Games</Text>
              <Text className="text-white font-semibold">
                {overallStats.totalGames}
              </Text>
            </View>
            <View className="flex-row justify-between p-4 rounded-xl-plus bg-app-card border border-app-card-border">
              <Text className="text-app-text-secondary">Total Sessions</Text>
              <Text className="text-white font-semibold">
                {overallStats.totalSessions}
              </Text>
            </View>
            <View className="flex-row justify-between p-4 rounded-xl-plus bg-app-card border border-app-card-border">
              <Text className="text-app-text-secondary">Avg Games/Session</Text>
              <Text className="text-white font-semibold">
                {overallStats.averageGamesPerSession}
              </Text>
            </View>
            <View className="flex-row justify-between p-4 rounded-xl-plus bg-app-card border border-app-card-border">
              <Text className="text-app-text-secondary">Longest Session</Text>
              <Text className="text-white font-semibold">
                {overallStats.longestSession}
              </Text>
            </View>
          </View>
        </View>

        <View className="space-y-3">
          <Text className="text-white text-lg font-bold mb-2">
            Player Performance
          </Text>
          {playerStats.map((player, index) => (
            <View
              key={player.name}
              className="p-4 rounded-xl-plus bg-app-card border border-app-card-border"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white font-semibold">{player.name}</Text>
                <View className="bg-app-primary px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">
                    #{index + 1}
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-app-text-muted text-sm">
                  {player.wins}W - {player.losses}L
                </Text>
                <Text className="text-app-success text-sm font-semibold">
                  {player.winRate}% win rate
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
