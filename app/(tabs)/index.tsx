import SessionCard from "@/components/SessionCard";
import StartSessionModal from "@/components/StartSessionModal";
import { useSessionStore } from "@/stores/sessionStore";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
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

  return (
    <ScrollView
      className="flex-1 bg-app-background"
      contentContainerStyle={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center p-5">
        <View className="items-center mb-12">
          <Text className="text-5xl text-white font-800 text-center tracking-tight">
            Shuttle Score
          </Text>
        </View>

        <TouchableOpacity
          className={`mb-10 w-full max-w-xs ${!currentSession ? "bg-app-primary py-4 rounded-xl-plus items-center shadow-lg" : ""}`}
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
      </View>

      <StartSessionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStartSession={handleStartSession}
      />
    </ScrollView>
  );
}
