import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { players, Player } from '@/data/players';

interface PlayerSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onStartSession: (selectedPlayers: Player[]) => void;
}

export default function PlayerSelectionModal({ visible, onClose, onStartSession }: PlayerSelectionModalProps) {
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleStartSession = () => {
    const selectedPlayers = players.filter(player => selectedPlayerIds.includes(player.id));
    onStartSession(selectedPlayers);
    setSelectedPlayerIds([]);
  };

  const handleCancel = () => {
    setSelectedPlayerIds([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <ThemedView style={styles.overlay}>
        <ThemedView style={styles.modalContent}>
          <ThemedView style={styles.handle} />
          <ThemedText type="title" style={styles.modalTitle}>Select Players</ThemedText>
          
          <ScrollView style={styles.playerList} showsVerticalScrollIndicator={false}>
            {players.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.playerItem,
                  selectedPlayerIds.includes(player.id) && styles.playerItemSelected
                ]}
                onPress={() => togglePlayer(player.id)}
              >
                <ThemedView style={styles.playerInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.playerName}>{player.name}</ThemedText>
                  <ThemedText style={styles.playerStats}>{player.wins}W - {player.losses}L</ThemedText>
                </ThemedView>
                <ThemedView style={[
                  styles.checkbox, 
                  selectedPlayerIds.includes(player.id) && styles.checkboxSelected
                ]}>
                  {selectedPlayerIds.includes(player.id) && (
                    <ThemedText style={styles.checkmark}>✓</ThemedText>
                  )}
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ThemedText style={styles.selectionInfo}>
            {selectedPlayerIds.length} players selected (minimum 2 required)
          </ThemedText>

          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.startButton,
                selectedPlayerIds.length < 2 && styles.startButtonDisabled
              ]}
              onPress={handleStartSession}
              disabled={selectedPlayerIds.length < 2}
            >
              <ThemedText style={styles.startButtonText}>Start Session</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 24,
  },
  playerList: {
    marginBottom: 24,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 4,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  playerItemSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  playerInfo: {
    flex: 1,
    gap: 2,
  },
  playerName: {
    fontSize: 17,
  },
  playerStats: {
    fontSize: 14,
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectionInfo: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 15,
    opacity: 0.7,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  startButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#ccc',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  startButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});