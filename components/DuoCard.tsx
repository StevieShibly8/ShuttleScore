import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface DuoCardProps {
  id: string;
  wins?: number;
  losses?: number;
  rank?: number;
}

export const DuoCard = ({ id, wins, losses, rank }: DuoCardProps) => {
  const getDuoById = useDuoStore((state) => state.getDuoById);
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const duo = getDuoById(id);

  const router = useRouter();

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

  const w = wins ?? duo?.wins ?? 0;
  const l = losses ?? duo?.losses ?? 0;
  const p = w + l;
  const rate = p > 0 ? Math.round((w / p) * 100) : 0;

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/duoProfile",
          params: { duoId: id as string },
        })
      }
    >
      <View
        style={{
          backgroundColor: "#23272f",
          borderRadius: 16,
          padding: 8,
          marginBottom: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "stretch",
          borderWidth: 1,
          borderColor: "#333a44",
        }}
      >
        {/* Middle: Rank */}
        {rank && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              minWidth: 60,
            }}
          >
            <View
              style={{
                backgroundColor: "#374151",
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 16,
                marginHorizontal: 8,
              }}
            >
              <Text className="text-app-primary text-base font-bold">
                #{rank}
              </Text>
              <Text className="text-app-text-muted text-xs mt-1">Rank</Text>
            </View>
          </View>
        )}

        {/* Left: Duo name and stats */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            marginLeft: rank ? 0 : 8,
          }}
        >
          <Text className="text-white font-semibold text-lg">{duoName}</Text>
          <Text className="text-app-text-muted text-sm mt-1">
            {w}W - {l}L - {p}P
          </Text>
          <Text className="text-app-primary text-xs font-semibold mt-1">
            Win Rate: {rate}%
          </Text>
        </View>

        {/* Right: RP and stars */}
        <View
          style={{
            alignItems: "flex-end",
            minWidth: 60,
            justifyContent: "center",
          }}
        >
          <Text className="text-app-primary text-sm font-semibold">
            RP: {avgRp}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            {[...Array(stars)].map((_, i) => (
              <Text key={i} className="text-yellow-400 text-lg">
                ★
              </Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
