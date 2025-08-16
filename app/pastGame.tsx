import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function PastGameScreen() {
  const { sessionId, gameId } = useLocalSearchParams();
  const getGameById = useSessionStore((state) => state.getGameById);
  const getDuoById = useDuoStore((state) => state.getDuoById);
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);

  const game = getGameById(sessionId as string, gameId as string);

  if (!game) {
    return (
      <View className="flex-1 justify-center items-center bg-app-background">
        <Text className="text-white text-lg">Game not found.</Text>
      </View>
    );
  }

  const teamAScore = game.teamA.score ?? 0;
  const teamBScore = game.teamB.score ?? 0;
  const winner =
    teamAScore > teamBScore ? "A" : teamBScore > teamAScore ? "B" : null;

  const duoA = game?.teamA ? getDuoById(game.teamA.duoId) : undefined;
  const duoB = game?.teamB ? getDuoById(game.teamB.duoId) : undefined;

  const teamAPlayer1 = duoA?.playerIds?.[0]
    ? getPlayerById(duoA.playerIds[0])
    : undefined;
  const teamAPlayer2 = duoA?.playerIds?.[1]
    ? getPlayerById(duoA.playerIds[1])
    : undefined;
  const teamBPlayer1 = duoB?.playerIds?.[0]
    ? getPlayerById(duoB.playerIds[0])
    : undefined;
  const teamBPlayer2 = duoB?.playerIds?.[1]
    ? getPlayerById(duoB.playerIds[1])
    : undefined;

  return (
    <View className="flex-1 bg-app-background p-6">
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-3xl text-white font-800 flex-1">Sessions</Text>
      </View>
      <View className="mb-6">
        <Text className="text-white text-lg font-semibold mb-2">Team A</Text>
        <Text className="text-white text-base">
          {teamAPlayer1?.name} & {teamAPlayer2?.name}
        </Text>
        <Text className="text-white text-xl font-bold">
          Score: {teamAScore}
          {winner === "A" && <Text className="text-green-400"> (Winner)</Text>}
        </Text>
      </View>
      <View className="mb-6">
        <Text className="text-white text-lg font-semibold mb-2">Team B</Text>
        <Text className="text-white text-base">
          {teamBPlayer1?.name} & {teamBPlayer2?.name}
        </Text>
        <Text className="text-white text-xl font-bold">
          Score: {teamBScore}
          {winner === "B" && <Text className="text-green-400"> (Winner)</Text>}
        </Text>
      </View>
    </View>
  );
}
