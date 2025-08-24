import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";

import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface GameCardProps {
  gameId: string;
  sessionId: string;
  isActive: boolean;
}

export const GameCard = ({ gameId, sessionId, isActive }: GameCardProps) => {
  const getGameById = useSessionStore((state) => state.getGameById);
  const getCurrentGame = useSessionStore((state) => state.getCurrentGame);
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const getDuoById = useDuoStore((state) => state.getDuoById);
  const router = useRouter();

  const game = isActive
    ? getCurrentGame(sessionId as string)
    : getGameById(sessionId as string, gameId as string);

  if (!game) {
    return (
      <View className="flex-1 justify-center items-center bg-app-background">
        <Text className="text-white text-lg">Game not found.</Text>
      </View>
    );
  }

  const getDuoNames = (duoId: string) => {
    const duo = getDuoById(duoId);
    if (!duo) return "Unknown Duo";
    return duo.playerIds
      .map((id) => getPlayerById(id)?.name || "Unknown Player")
      .join(" & ");
  };

  // Green background if active, otherwise default
  const cardBg = game.isGameActive ? "#16a34a1f" : "#23272f";
  return (
    <TouchableOpacity
      onPress={() =>
        game.isGameActive
          ? router.push({ pathname: "/currentGame", params: { sessionId } })
          : router.push({
              pathname: "/gameDetails",
              params: { sessionId, gameId },
            })
      }
    >
      <View
        style={{
          backgroundColor: cardBg,
          borderRadius: 16,
          padding: 16,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: "#333a44",
        }}
      >
        {/* Teams */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Team A */}
          <View style={{ flex: 1 }}>
            <Text className="text-white font-semibold text-base">
              {getDuoNames(game.teamA.duoId)}
            </Text>
          </View>
          {/* Score */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              minWidth: 70,
              justifyContent: "center",
            }}
          >
            <Text
              className={
                "font-bold text-lg " +
                (game.teamA.score > game.teamB.score
                  ? "text-app-success"
                  : "text-app-text-muted")
              }
            >
              {game.teamA.score}
            </Text>
            <Text className="font-bold text-lg mx-2 text-app-success">:</Text>
            <Text
              className={
                "font-bold text-lg " +
                (game.teamB.score > game.teamA.score
                  ? "text-app-success"
                  : "text-app-text-muted")
              }
            >
              {game.teamB.score}
            </Text>
          </View>
          {/* Team B */}
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text className="text-white font-semibold text-base">
              {getDuoNames(game.teamB.duoId)}
            </Text>
          </View>
        </View>
        {/* Footer */}
        {game.isGameActive && (
          <View style={{ marginTop: 8, alignItems: "center" }}>
            <View className="bg-app-primary px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">ACTIVE</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
