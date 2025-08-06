import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SessionsScreen() {
  const currentSession = {
    id: "current",
    date: "Today",
    players: ["Zubair Shibly", "Nilin Reza", "Junaid Wali", "Tawsif Hasan"],
    gamesPlayed: 3,
    duration: "1h 45m",
    status: "active",
  };

  const pastSessions = [
    {
      id: "1",
      date: "Yesterday",
      players: ["Tahia Tasneem", "Zerin Rumaly", "Samin Zarif"],
      gamesPlayed: 5,
      duration: "2h 15m",
      status: "completed",
    },
    {
      id: "2",
      date: "2 days ago",
      players: ["Zubair Shibly", "Rownak Haider", "Junaid Wali", "Nilin Reza"],
      gamesPlayed: 7,
      duration: "2h 30m",
      status: "completed",
    },
    {
      id: "3",
      date: "5 days ago",
      players: ["Tawsif Hasan", "Tahia Tasneem", "Samin Zarif"],
      gamesPlayed: 4,
      duration: "1h 50m",
      status: "completed",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-app-black">
      <View className="p-5">
        <View className="items-center mb-8">
          <Text className="text-3xl text-white font-800 text-center tracking-tight">
            Sessions
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-white text-lg font-bold mb-4">
            Current Session
          </Text>
          <TouchableOpacity onPress={() => router.push("/session")}>
            <Card variant="primary">
              <CardHeader>
                <View className="flex-row justify-between items-center">
                  <CardTitle className="text-app-primary">
                    Live Session
                  </CardTitle>
                  <View className="bg-app-primary px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">
                      ACTIVE
                    </Text>
                  </View>
                </View>
              </CardHeader>
              <CardContent>
                <Text className="text-app-text-secondary text-sm mb-2">
                  {currentSession.date} • {currentSession.duration}
                </Text>
                <Text className="text-app-text-muted text-sm">
                  {currentSession.players.join(", ")}
                </Text>
              </CardContent>
              <CardFooter>
                <Text className="text-app-text-secondary text-sm">
                  {currentSession.gamesPlayed} games played
                </Text>
              </CardFooter>
            </Card>
          </TouchableOpacity>
        </View>

        <View className="space-y-3">
          <Text className="text-white text-lg font-bold mb-2">
            Past Sessions
          </Text>
          {pastSessions.map((session) => (
            <TouchableOpacity key={session.id} className="mb-3">
              <Card variant="default">
                <CardHeader>
                  <View className="flex-row justify-between items-center">
                    <CardTitle>{session.date}</CardTitle>
                    <Text className="text-app-text-muted text-xs">
                      {session.duration}
                    </Text>
                  </View>
                </CardHeader>
                <CardContent>
                  <Text className="text-app-text-muted text-sm">
                    {session.players.join(", ")}
                  </Text>
                </CardContent>
                <CardFooter>
                  <Text className="text-app-text-secondary text-sm">
                    {session.gamesPlayed} games completed
                  </Text>
                </CardFooter>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
