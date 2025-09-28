import { SessionCard } from "@/components/SessionCard";
import { useSessionStore } from "@/stores/sessionStore";
import { ScrollView, Text, View } from "react-native";

export default function SessionsScreen() {
  const sessions = useSessionStore((state) => state.sessions);
  const getCurrentSession = useSessionStore((state) => state.getCurrentSession);
  const currentSession = getCurrentSession();
  const pastSessions = sessions.filter((s) => s.id !== currentSession?.id);
  const pastSessionsSorted = [...pastSessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <ScrollView className="flex-1 bg-app-background">
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
            <SessionCard
              sessionId={currentSession.id}
              variant="primary"
              active
            />
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
              <SessionCard
                key={session.id}
                sessionId={session.id}
                showPaidProgressBar
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
