import { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import PlayerSelectionModal from '@/components/PlayerSelectionModal';
import { players, Player } from '@/data/players';

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
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.mainTitle}>Shuttle Score</ThemedText>
        </ThemedView>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => setModalVisible(true)}
        >
          <ThemedText type="defaultSemiBold" style={styles.startButtonText}>
            Start Session
          </ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.topPlayersContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Top Players</ThemedText>
          {topPlayers.map((player) => (
            <ThemedView key={player.id} style={styles.playerRow}>
              <ThemedText type="defaultSemiBold">{player.name}</ThemedText>
              <ThemedText>{player.wins}W - {player.losses}L</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      <PlayerSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStartSession={handleStartSession}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 20,
  },
  mainTitle: {
    fontSize: 48,
    textAlign: 'center',
    lineHeight: 56,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
  },
  topPlayersContainer: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
});
