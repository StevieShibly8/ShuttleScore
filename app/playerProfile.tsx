import { usePlayerStore } from "@/stores/playerStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PlayerProfile() {
  const { playerId } = useLocalSearchParams();
  const player = usePlayerStore((state) =>
    state.getPlayerById(playerId as string)
  );

  const w = player?.wins ?? 0;
  const l = player?.losses ?? 0;
  const p = w + l;
  const winRate = p > 0 ? ((w / p) * 100).toFixed(2) : 0;

  const rp = player?.rp ?? 0;
  const stars = Math.max(1, Math.floor(rp / 20) + 1);

  // Animated star for RP 100
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let isMounted = true;

    const spin = () => {
      spinAnim.setValue(0);
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        if (isMounted) pulse();
      });
    };

    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(400),
      ]).start(() => {
        if (isMounted) spin();
      });
    };

    if (rp >= 100) {
      spin();
    }

    return () => {
      isMounted = false;
      spinAnim.stopAnimation();
      pulseAnim.stopAnimation();
    };
  }, [rp, spinAnim, pulseAnim]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!player) {
    return (
      <View className="flex-1 bg-app-background justify-center items-center">
        <Text className="text-white text-2xl font-bold">Player not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-app-background">
      <View className="p-5">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View className="items-center mb-8">
          <Text className="text-3xl text-white font-800 text-center tracking-tight">
            {player.name}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            {rp >= 100
              ? [...Array(5)].map((_, i) => (
                  <Animated.View
                    key={i}
                    style={{
                      transform: [
                        { rotate: spinInterpolate },
                        { scale: pulseAnim },
                      ],
                      shadowColor: "#ffd900ff",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: pulseAnim.interpolate({
                        inputRange: [1, 1.3],
                        outputRange: [6, 16],
                      }),
                      elevation: 8,
                      marginHorizontal: 1,
                    }}
                  >
                    <Ionicons name="star" size={24} color="#ffd900ff" />
                  </Animated.View>
                ))
              : [...Array(stars)].map((_, i) => (
                  <Text key={i} className="text-4xl text-app-warning">
                    ★
                  </Text>
                ))}
          </View>
        </View>

        <View className="w-full max-w-xl bg-app-card border border-app-card-border rounded-xl-plus p-6">
          <Stat label="Games Played" value={p} />
          <Stat label="Wins" value={w} />
          <Stat label="Losses" value={l} />
          <Stat label="Win Rate" value={`${winRate}%`} />
          <Stat label="RP" value={rp} />
        </View>
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-app-modal-border last:border-b-0">
      <Text className="text-app-text-muted text-lg">{label}</Text>
      <Text className="text-white text-lg font-semibold">{value}</Text>
    </View>
  );
}
