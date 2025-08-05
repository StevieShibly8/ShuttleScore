import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SessionScreen() {
  const { players } = useLocalSearchParams();
  
  const selectedPlayers = players ? JSON.parse(players as string) : [];
  
  const mockPastGames = [
    { id: '1', players: ['Zubair Shibly', 'Nilin Reza'], score: '21-15', date: '15 mins ago' },
    { id: '2', players: ['Junaid Wali', 'Tawsif Hasan'], score: '21-18', date: '45 mins ago' },
    { id: '3', players: ['Tahia Tasneem', 'Zerin Rumaly'], score: '21-12', date: '1h 20m ago' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Session</ThemedText>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.startGameButton}>
          <ThemedText type="defaultSemiBold" style={styles.startGameText}>
            Start Game
          </ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Players Playing</ThemedText>
          {selectedPlayers.map((player: { id: string; name: string }) => (
            <ThemedView key={player.id} style={styles.playerCard}>
              <ThemedText type="defaultSemiBold">{player.name}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Past Games</ThemedText>
          {mockPastGames.map((game) => (
            <ThemedView key={game.id} style={styles.gameCard}>
              <ThemedView style={styles.gameInfo}>
                <ThemedText type="defaultSemiBold" style={styles.gamePlayers}>
                  {game.players.join(' vs ')}
                </ThemedText>
                <ThemedText style={styles.gameScore}>{game.score}</ThemedText>
              </ThemedView>
              <ThemedText style={styles.gameDate}>{game.date}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  startGameButton: {
    backgroundColor: '#FF3B82',
    paddingVertical: 20,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#FF3B82',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  startGameText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    marginBottom: 12,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  playerCard: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  gameCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  gameInfo: {
    flex: 1,
  },
  gamePlayers: {
    fontSize: 16,
    marginBottom: 2,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  gameScore: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '700',
  },
  gameDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
});