import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

interface SwapButtonProps {
  direction: "horizontal" | "vertical";
  onPress: () => void;
}

export default function SwapButton({ direction, onPress }: SwapButtonProps) {
  const isHorizontal = direction === "horizontal";

  return (
    <TouchableOpacity
      className={`rounded-lg p-4 items-center ${isHorizontal ? "flex-row" : "flex-col"}`}
      onPress={onPress}
      activeOpacity={0.4}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      style={{
        // zIndex: 999,
        backgroundColor: "#1b373dcf",
        opacity: 1,
        padding: 5,
        borderRadius: 15,
        elevation: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.7,
        shadowRadius: 4,
      }}
    >
      <Ionicons
        name="repeat-outline"
        size={30}
        color="#fff"
        style={{
          transform: [{ rotate: isHorizontal ? "0deg" : "90deg" }],
          opacity: 0.6,
        }}
      />
    </TouchableOpacity>
  );
}
