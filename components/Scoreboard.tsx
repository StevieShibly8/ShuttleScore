import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text, TouchableOpacity, View } from "react-native";

interface ScoreboardProps {
  teamName: string;
  player1: string;
  player2: string;
  score: number;
}

export default function Scoreboard({
  teamName,
  player1,
  player2,
  score,
}: ScoreboardProps) {
  return (
    <View className="w-36">
      <Card className="h-full p-2">
        <CardHeader className="items-center">
          <CardTitle className="text-base font-bold">{teamName}</CardTitle>
          <CardTitle className="text-base font-bold">{player1}</CardTitle>
          <CardTitle className="text-base font-bold">{player2}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 justify-start pt-2">
          <View className="items-center mb-8">
            <Text className="text-white text-4xl font-bold">{score}</Text>
          </View>
          <View className="items-center flex-1 justify-center">
            <TouchableOpacity
              className="bg-app-success-card w-20 h-16 rounded-lg items-center justify-center border border-app-primary-border"
              onPress={() => {
                // Increment logic will be added later
              }}
            >
              <Text className="text-white text-4xl leading-none">+</Text>
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
