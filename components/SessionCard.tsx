import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Text, View } from "react-native";

export default function SessionCard({
  session,
  variant = "default",
  active = false,
  onPress,
}: {
  session: any;
  variant?: "default" | "primary";
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Card variant={variant}>
      <CardTitle className={variant === "primary" ? "text-app-primary" : ""}>
        <Text
          className={
            variant === "primary"
              ? "text-app-primary"
              : "text-white font-semibold text-lg"
          }
        >
          {active ? "Live Session" : session.date}
        </Text>
      </CardTitle>
      <CardHeader>
        <Text className="text-app-text-secondary text-sm mb-2">
          {active
            ? session.date
            : `${session.pastGames.length} games completed`}
        </Text>
      </CardHeader>
      <CardContent>
        {active && (
          <Text className="text-app-text-secondary text-sm">
            {session.pastGames.length} games played
          </Text>
        )}
      </CardContent>
      <CardFooter>
        {active && (
          <View className="flex-row justify-between items-center">
            <View className="bg-app-primary px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">ACTIVE</Text>
            </View>
          </View>
        )}
      </CardFooter>
    </Card>
  );
}
