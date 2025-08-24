import { SessionCard } from "@/components/SessionCard";
import { StartSessionModal } from "@/components/StartSessionModal";
import { useSessionStore } from "@/stores/sessionStore";
import { Ionicons } from "@expo/vector-icons";
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
      pathname: "/sessionDetails",
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
      <TouchableOpacity
        onPress={() => {
          router.push("/settings");
        }}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          padding: 10,
        }}
      >
        <Ionicons name="settings-sharp" size={28} color="#ffffffd2" />
      </TouchableOpacity>

      <View className="flex-1 justify-center items-center p-5">
        <View className="items-center mb-12">
          <Text className="text-5xl text-white font-800 text-center tracking-tight">
            Shuttle Score
          </Text>
        </View>

        {!currentSession ? (
          <TouchableOpacity
            className="mb-10 w-full max-w-xs bg-app-primary py-4 rounded-xl-plus items-center shadow-lg"
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text className="text-white text-lg font-bold">
              Start New Session
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="w-full max-w-xs shadow-lg">
            <SessionCard
              id={currentSession.id}
              variant="primary"
              active={true}
            />
          </View>
        )}
      </View>

      <StartSessionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStartSession={handleStartSession}
      />

      <View style={{ alignItems: "center", marginBottom: 12, marginTop: 24 }}>
        <Text style={{ color: "#aaa", fontSize: 12 }}>
          © {new Date().getFullYear()} Shuttle Score
        </Text>
      </View>
    </ScrollView>
  );
}
