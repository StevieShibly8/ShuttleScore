import { usePlayerStore } from "@/stores/playerStore";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface PlayerCardProps {
  id: string;
  wins?: number;
  losses?: number;
  rank?: number;
}

export const PlayerCard = ({ id, wins, losses, rank }: PlayerCardProps) => {
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const player = getPlayerById(id);
  const router = useRouter();

  const w = wins ?? player?.wins ?? 0;
  const l = losses ?? player?.losses ?? 0;
  const p = w + l;
  const rate = p > 0 ? Math.round((w / p) * 100) : 0;

  const cappedRp = Math.min(player?.rp ?? 0, 100);
  const stars = Math.max(1, Math.floor(cappedRp / 20) + 1);

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/playerProfile", params: { id } })
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
        {/* Only render the rank column if rank is provided */}
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

        {/* Player info: if no rank, align left; if rank, add marginLeft for spacing */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            marginLeft: rank ? 0 : 8,
          }}
        >
          <Text className="text-white font-semibold text-lg">
            {player?.name || "Unknown Player"}
          </Text>
          <Text className="text-app-text-muted text-sm mt-1">
            {w}W - {l}L - {p}P
          </Text>
          <Text className="text-app-primary text-xs font-semibold mt-1">
            Win Rate: {rate}%
          </Text>
        </View>

        <View
          style={{
            alignItems: "flex-end",
            minWidth: 60,
            justifyContent: "center",
          }}
        >
          <Text className="text-app-primary text-sm font-semibold">
            RP: {player?.rp}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            {[...Array(stars)].map((_, i) => (
              <Text
                key={i}
                className="text-yellow-400 text-lg text-app-warning"
              >
                ★
              </Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
