import SessionCard from "@/components/SessionCard";
import { useSessionStore } from "@/stores/sessionStore";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SessionsScreen() {
  const sessions = useSessionStore((state) => state.sessions);
  const getCurrentSession = useSessionStore((state) => state.getCurrentSession);
  const currentSession = getCurrentSession();
  const pastSessions = sessions.filter((s) => s.id !== currentSession?.id);
  const pastSessionsSorted = pastSessions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <ScrollView className="flex-1 bg-app-black">
      <View className="p-5">
        <View className="items-center mb-8">
          <Text className="text-3xl text-white font-800 text-center tracking-tight">
            Sessions
          </Text>
        </View>

        <View className="space-y-3 mb-8">
          <Text className="text-white text-lg font-bold mb-2">
            Current Session
          </Text>
          {!currentSession ? (
            <View className="items-center justify-center py-12">
              <Text className="text-app-text-muted text-base text-center">
                There is no active session
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/session",
                  params: { sessionId: currentSession.id },
                })
              }
            >
              <SessionCard session={currentSession} variant="primary" active />
            </TouchableOpacity>
          )}
        </View>

        <View className="space-y-3">
          <Text className="text-white text-lg font-bold mb-2">
            Past Sessions
          </Text>
          {pastSessionsSorted.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-app-text-muted text-base text-center">
                There are no sessions to display
              </Text>
            </View>
          ) : (
            pastSessionsSorted.map((session) => (
              <TouchableOpacity
                key={session.id}
                className="mb-3"
                onPress={() =>
                  router.push({
                    pathname: "/session",
                    params: { sessionId: session.id },
                  })
                }
              >
                <SessionCard session={session} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
