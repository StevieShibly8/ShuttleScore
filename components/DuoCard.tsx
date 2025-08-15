import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { Text, View } from "react-native";

interface DuoCardProps {
  id: string;
  wins?: number;
  losses?: number;
  played?: number;
}

export const DuoCard = ({ id, wins, losses, played }: DuoCardProps) => {
  const getDuoById = useDuoStore((state) => state.getDuoById);
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const duo = getDuoById(id);

  // Get player objects
  const player1 = duo?.playerIds?.[0] ? getPlayerById(duo.playerIds[0]) : null;
  const player2 = duo?.playerIds?.[1] ? getPlayerById(duo.playerIds[1]) : null;

  // Duo name
  const duoName =
    player1 && player2 ? `${player1.name} & ${player2.name}` : "Unknown Duo";

  // Average RP
  const rp1 = player1?.rp ?? 0;
  const rp2 = player2?.rp ?? 0;
  const avgRp = Math.round((rp1 + rp2) / 2);

  const cappedRp = Math.min(avgRp, 100);
  const stars = Math.max(1, Math.floor(cappedRp / 20) + 1);

  return (
    <Card variant="default">
      <CardTitle>
        <Text className="text-white font-semibold text-lg">{duoName}</Text>
        <Text className="text-app-success text-sm font-semibold">
          RP: {avgRp}
        </Text>
      </CardTitle>
      <CardContent className="flex-row justify-between items-center">
        <Text className="text-app-text-muted text-sm">
          {wins ?? duo?.wins}W - {losses ?? duo?.losses}L -{" "}
          {played ?? (duo?.wins ?? 0) + (duo?.losses ?? 0)}P
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
