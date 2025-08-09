import BadmintonCourt from "@/components/BadmintonCourt";
import Scoreboard from "@/components/Scoreboard";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";

export default function GameScreen() {
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <View className="flex-1 bg-app-black p-5">
      <View className="flex-row items-center mb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-3xl text-white font-800 flex-1">Game</Text>
        <TouchableOpacity
          onPress={() => {
            /* end game logic here */
          }}
          className="bg-red-600 px-5 py-2 rounded-full"
        >
          <Text className="text-white font-bold">End Game</Text>
        </TouchableOpacity>
      </View>
      

      {/* Game Content */}
      <View className="mt-2 mx-2 flex-1 flex-row">
        {/* Left Scoreboard */}
        <View className="mr-2">
          <Scoreboard 
            teamName="Team A"
            player1="Alice"
            player2="Bob"
            score={21}
          />
        </View>

        {/* Badminton Court */}
        <View className="flex-1">
          <BadmintonCourt />
        </View>

        {/* Right Scoreboard */}
        <View className="ml-2">
          <Scoreboard 
            teamName="Team B"
            player1="Charlie"
            player2="Dana"
            score={18}
          />
        </View>
      </View>
    </View>
  );
}
