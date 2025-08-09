import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SwapButtonProps {
  direction: "horizontal" | "vertical";
  onPress: () => void;
}

export default function SwapButton({ direction, onPress }: SwapButtonProps) {
  const isHorizontal = direction === "horizontal";
  
  return (
    <TouchableOpacity 
      className={`rounded-lg p-4 ${
        isHorizontal ? "flex-row" : "flex-col"
      } items-center`}
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      style={{ zIndex: 999 }}
    >
      {isHorizontal ? (
        <>
          <Ionicons name="repeat-outline" size={36} color="darkgreen" />
        </>
      ) : (
        <>
          <Ionicons 
            name="repeat-outline" 
            size={36} 
            color="darkgreen"
            style={{transform: [{rotate: '90deg'}]}}
          />
        </>
      )}
    </TouchableOpacity>
  );
}