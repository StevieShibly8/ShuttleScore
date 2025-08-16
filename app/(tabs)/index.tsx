import { PlayerCard } from "@/components/PlayerCard";
import SessionCard from "@/components/SessionCard";
import StartSessionModal from "@/components/StartSessionModal";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const players = usePlayerStore((state) => state.players);
  const addSession = useSessionStore((state) => state.addSession);
  const getCurrentSession = useSessionStore((state) => state.getCurrentSession);
  const currentSession = getCurrentSession();

  const handleStartSession = (
    selectedPlayerIds: string[],
    selectedDuoIds: string[]
  ) => {
    setModalVisible(false);
    const newSession = addSession(selectedPlayerIds, selectedDuoIds);
    router.push({
      pathname: "/session",
      params: {
        sessionId: newSession.id,
      },
    });
  };

  const topPlayerIds = players
    ?.slice()
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 3)
    .map((player) => player.id);

  return (
    <ScrollView className="flex-1 bg-app-background">
      <View className="p-5">
        <View className="items-center mb-12 mt-5">
          <Text className="text-5xl text-white font-800 text-center tracking-tight">
            Shuttle Score
          </Text>
        </View>

        <TouchableOpacity
          className={`mb-10 ${!currentSession ? "bg-app-primary py-4 rounded-xl-plus items-center shadow-lg" : ""}`}
          onPress={() => {
            if (!currentSession) {
              setModalVisible(true);
            } else {
              router.push({
                pathname: "/session",
                params: { sessionId: currentSession.id },
              });
            }
          }}
        >
          {!currentSession ? (
            <Text className="text-white text-lg font-bold">
              Start New Session
            </Text>
          ) : (
            <SessionCard session={currentSession} variant="primary" active />
          )}
        </TouchableOpacity>

        <View className="space-y-3">
          <Text className="text-white text-xl font-bold mb-2">Top Players</Text>
          {topPlayerIds?.map((playerId) => (
            <PlayerCard key={playerId} id={playerId} />
          ))}
        </View>
      </View>

      <StartSessionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStartSession={handleStartSession}
      />
    </ScrollView>
  );
}
