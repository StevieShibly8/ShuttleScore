import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { usePlayerStore } from "@/stores/playerStore";
import { Text, View } from "react-native";

interface PlayerCardProps {
  id: string;
  wins?: number;
  losses?: number;
}

export const PlayerCard = ({ id, wins, losses }: PlayerCardProps) => {
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const player = getPlayerById(id);

  const cappedRp = Math.min(player?.rp ?? 0, 100);
  const stars = Math.max(1, Math.floor(cappedRp / 20) + 1);

  return (
    <Card variant="default">
      <CardTitle>
        <Text className="text-white font-semibold text-lg">
          {player?.name || "Unknown Player"}
        </Text>
        <Text className="text-app-success text-sm font-semibold">
          RP: {player?.rp}
        </Text>
      </CardTitle>
      <CardContent className="flex-row justify-between items-center">
        <Text className="text-app-text-muted text-sm">
          {wins ?? player?.wins}W - {losses ?? player?.losses}L
        </Text>
        <View className="flex-row items-center">
          {[...Array(stars)].map((_, i) => (
            <Text key={i} className="text-yellow-400 text-lg">
              ★
            </Text>
          ))}
        </View>
      </CardContent>
    </Card>
  );
};
