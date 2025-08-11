import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Game } from "@/data/gameData";
import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { Text, View } from "react-native";

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const getDuoById = useDuoStore((state) => state.getDuoById);

  const getDuoNames = (duoId: string) => {
    const duo = getDuoById(duoId);
    if (!duo) return "Unknown Duo";
    return duo.playerIds
      .map((id) => getPlayerById(id)?.name || "Unknown Player")
      .join(" & ");
  };

  return (
    <Card variant="success" className="mb-3">
      <CardHeader>
        <CardTitle className="text-white">
          {getDuoNames(game.teamA.duoId)} vs {getDuoNames(game.teamB.duoId)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <View className="flex-row items-center justify-center">
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
      </CardContent>
      <CardFooter>
        {game.isGameActive && (
          <Text className="text-app-success text-sm">Active</Text>
        )}
      </CardFooter>
    </Card>
  );
};
