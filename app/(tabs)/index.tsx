import { useState } from 'react';
import { TouchableOpacity, ScrollView, View, Text } from 'react-native';
import { router } from 'expo-router';
import PlayerSelectionModal from '@/components/PlayerSelectionModal';
import { players, Player } from '@/data/players';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';


export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleStartSession = (selectedPlayers: Player[]) => {
    setModalVisible(false);
    router.push({
      pathname: '/session',
      params: { 
        players: JSON.stringify(selectedPlayers.map(p => ({ id: p.id, name: p.name })))
      }
    });
  };

  const topPlayers = players.slice().sort((a, b) => b.wins - a.wins).slice(0, 3);

  return (
    <ScrollView className="flex-1 bg-app-black">
      <View className="p-5 pt-20">
        <View className="items-center mb-12 mt-5">
          <Text className="text-5xl text-white font-800 text-center tracking-tight">Shuttle Score</Text>
        </View>

        <TouchableOpacity 
          className="bg-app-primary py-4 rounded-xl-plus items-center mb-10 shadow-lg"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-lg font-bold">Start New Session</Text>
        </TouchableOpacity>

        {/* Example Custom Card */}
        <Card variant="default" className="mb-6">
          <CardHeader>
            <CardTitle>Custom Card Component</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-app-text-secondary">Simple, lightweight card using your existing CSS variables</Text>
          </CardContent>
          <CardFooter>
            <Text className="text-app-text-muted text-xs">Built with NativeWind</Text>
          </CardFooter>
        </Card>

        <View className="space-y-3">
          <Text className="text-white text-xl font-bold mb-2">Top Players</Text>
          {topPlayers.map((player) => (
            <View key={player.id} className="flex-row justify-between items-center py-3 px-4 rounded-xl bg-app-card border border-app-card-border">
              <Text className="text-white font-semibold">{player.name}</Text>
              <Text className="text-app-text-muted text-sm">{player.wins}W - {player.losses}L</Text>
            </View>
          ))}
        </View>
      </View>

      <PlayerSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStartSession={handleStartSession}
      />
    </ScrollView>
  );
}

