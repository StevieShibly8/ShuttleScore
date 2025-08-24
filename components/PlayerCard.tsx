import { usePlayerStore } from "@/stores/playerStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

interface PlayerCardProps {
  id: string;
  wins?: number;
  losses?: number;
  rank?: number;
  showBenchButton?: boolean;
  isBenched?: boolean;
  onBenchPress?: () => void;
}

export const PlayerCard = ({
  id,
  wins,
  losses,
  rank,
  showBenchButton,
  isBenched,
  onBenchPress,
}: PlayerCardProps) => {
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const player = getPlayerById(id);
  const router = useRouter();

  const w = wins ?? player?.wins ?? 0;
  const l = losses ?? player?.losses ?? 0;
  const p = w + l;
  const rate = p > 0 ? Math.round((w / p) * 100) : 0;

  const cappedRp = Math.min(player?.rp ?? 0, 100);
  const stars = Math.max(1, Math.floor(cappedRp / 20) + 1);

  // Benched state and animation
  const paddingAnim = useRef(new Animated.Value(2)).current;

  useEffect(() => {
    Animated.timing(paddingAnim, {
      toValue: isBenched ? 16 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isBenched, paddingAnim]);

  // Muted style for benched
  const mutedStyle = isBenched ? { opacity: 0.4 } : {};

  // If bench button is shown, use row layout with button at end
  if (showBenchButton) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          marginBottom: 8,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/playerProfile",
              params: { playerId: id as string },
            })
          }
          style={{ flex: 1 }}
          activeOpacity={0.8}
        >
          <View
            style={{
              backgroundColor: "#23272f",
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              padding: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "stretch",
              borderWidth: 1,
              borderColor: "#333a44",
              flex: 1,
              ...mutedStyle,
            }}
          >
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
        <Animated.View
          style={{
            backgroundColor: isBenched ? "#6366F1" : "#6c935cff",
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#333a44",
            marginLeft: -1,
            paddingHorizontal: paddingAnim,
          }}
        >
          <TouchableOpacity onPress={onBenchPress} activeOpacity={1}>
            <Ionicons
              name={isBenched ? "play-circle-outline" : "pause-circle-outline"}
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // Default: no bench button, original card
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/playerProfile",
          params: { playerId: id as string },
        })
      }
      activeOpacity={0.8}
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
