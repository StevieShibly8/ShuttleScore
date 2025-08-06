import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SessionScreen() {
  const { players } = useLocalSearchParams();

  const selectedPlayers = players ? JSON.parse(players as string) : [];

  const mockPastGames = [
    {
      id: "1",
      players: ["Zubair Shibly", "Nilin Reza"],
      score: "21-15",
      date: "15 mins ago",
    },
    {
      id: "2",
      players: ["Junaid Wali", "Tawsif Hasan"],
      score: "21-18",
      date: "45 mins ago",
    },
    {
      id: "3",
      players: ["Tahia Tasneem", "Zerin Rumaly"],
      score: "21-12",
      date: "1h 20m ago",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-app-black">
      <View className="p-5">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-3xl text-white font-800 flex-1">Session</Text>
        </View>

        <TouchableOpacity
          className="bg-app-primary py-5 rounded-xl-plus items-center mb-8 shadow-lg"
          onPress={() => router.push("/game")}
        >
          <Text className="text-white text-lg font-bold">Start New Game</Text>
        </TouchableOpacity>

        <View className="mb-8">
          <Text className="text-white text-xl font-bold mb-4">
            Players Playing
          </Text>
          <View className="space-y-3">
            {selectedPlayers.map((player: { id: string; name: string }) => (
              <Card key={player.id} variant="default">
                <CardContent>
                  <Text className="text-white font-semibold">
                    {player.name}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>

        <View className="space-y-3 pb-8">
          <Text className="text-white text-xl font-bold mb-4">Past Games</Text>
          {mockPastGames.map((game) => (
            <Card key={game.id} variant="success" className="mb-3">
              <CardHeader>
                <CardTitle className="text-white">
                  {game.players.join(" vs ")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="text-app-success font-bold text-lg">
                  {game.score}
                </Text>
              </CardContent>
              <CardFooter>
                <Text className="text-app-text-muted text-sm">{game.date}</Text>
              </CardFooter>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
