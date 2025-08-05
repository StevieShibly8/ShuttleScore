import { TouchableOpacity, ScrollView, View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function SessionScreen() {
  const { players } = useLocalSearchParams();
  
  const selectedPlayers = players ? JSON.parse(players as string) : [];
  
  const mockPastGames = [
    { id: '1', players: ['Zubair Shibly', 'Nilin Reza'], score: '21-15', date: '15 mins ago' },
    { id: '2', players: ['Junaid Wali', 'Tawsif Hasan'], score: '21-18', date: '45 mins ago' },
    { id: '3', players: ['Tahia Tasneem', 'Zerin Rumaly'], score: '21-12', date: '1h 20m ago' },
  ];

  return (
    <View className="flex-1 bg-app-black pt-15">
      <View className="items-center px-5 pb-6">
        <Text className="text-white text-3xl font-800 tracking-tight">Session</Text>
      </View>

      <ScrollView className="px-5 space-y-8" showsVerticalScrollIndicator={false}>
        <TouchableOpacity className="bg-app-primary py-5 rounded-3xl items-center shadow-xl">
          <Text className="text-white text-lg font-bold">New Game</Text>
        </TouchableOpacity>

        <View className="space-y-3">
          <Text className="text-white text-xl font-bold">Players Playing</Text>
          {selectedPlayers.map((player: { id: string; name: string }) => (
            <View key={player.id} className="py-4 px-5 rounded-xl-plus bg-app-card border border-app-card-border">
              <Text className="text-white font-semibold">{player.name}</Text>
            </View>
          ))}
        </View>

        <View className="space-y-3 pb-8">
          <Text className="text-white text-xl font-bold">Past Games</Text>
          {mockPastGames.map((game) => (
            <View key={game.id} className="flex-row justify-between items-center py-4 px-5 rounded-xl-plus bg-app-success-card border border-app-success-border">
              <View className="flex-1">
                <Text className="text-white font-semibold mb-1">
                  {game.players.join(' vs ')}
                </Text>
                <Text className="text-app-success font-bold text-sm">{game.score}</Text>
              </View>
              <Text className="text-app-text-muted text-xs font-medium">{game.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

