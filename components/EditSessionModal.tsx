import { useSessionStore } from "@/stores/sessionStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EditSessionModalProps {
  visible: boolean;
  onClose: () => void;
  sessionId: string;
}

export const EditSessionModal = ({
  visible,
  onClose,
  sessionId,
}: EditSessionModalProps) => {
  const session = useSessionStore((state) => state.getSessionById(sessionId));
  const updateSession = useSessionStore((state) => state.updateSession);

  // Local state for editing
  const [duration, setDuration] = useState<number>(2);
  const [customDuration, setCustomDuration] = useState<string>("");
  const [miscCosts, setMiscCosts] = useState<
    { label: string; amount: string }[]
  >([]);

  // Initialize state from session
  useEffect(() => {
    if (session) {
      setDuration(session.sessionDuration ?? 2);
      setCustomDuration("");
      setMiscCosts(
        session.miscCosts?.map((mc) => ({
          label: mc.label,
          amount: mc.amount.toString(),
        })) ?? []
      );
    }
  }, [session, visible]);

  // Handle misc cost changes
  const handleMiscLabelChange = (idx: number, label: string) => {
    setMiscCosts((prev) =>
      prev.map((mc, i) => (i === idx ? { ...mc, label } : mc))
    );
  };
  const handleMiscAmountChange = (idx: number, amount: string) => {
    // Only allow numbers and decimals
    if (!/^\d*\.?\d*$/.test(amount)) return;
    setMiscCosts((prev) =>
      prev.map((mc, i) => (i === idx ? { ...mc, amount } : mc))
    );
  };
  const handleAddMiscCost = () => {
    setMiscCosts((prev) => [...prev, { label: "", amount: "" }]);
  };
  const handleRemoveMiscCost = (idx: number) => {
    setMiscCosts((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save changes
  const handleSave = () => {
    const sessionDuration =
      customDuration !== "" ? parseFloat(customDuration) : duration;
    updateSession(sessionId, {
      sessionDuration,
      miscCosts: miscCosts
        .filter((mc) => mc.label.trim() && mc.amount.trim())
        .map((mc) => ({
          label: mc.label.trim(),
          amount: parseFloat(mc.amount) || 0,
        })),
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <View className="flex-1 bg-app-overlay justify-end">
        <View className="rounded-t-3xl pt-3 px-5 pb-4 bg-app-modal-bg">
          <Text className="text-center mt-4 mb-6 text-2xl font-bold text-app-text-primary">
            Edit Session
          </Text>

          <ScrollView
            style={{ maxHeight: 440 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Duration */}
            <Text className="text-lg font-semibold text-app-text-primary mb-2">
              Duration
            </Text>
            <View className="flex-row mb-4 gap-2">
              {[1, 1.5, 2].map((opt) => (
                <TouchableOpacity
                  key={opt}
                  className={`flex-1 py-2 rounded-lg items-center border ${
                    customDuration === "" && duration === opt
                      ? "bg-app-primary border-app-primary"
                      : "bg-transparent border-app-primary"
                  }`}
                  onPress={() => {
                    setDuration(opt);
                    setCustomDuration("");
                  }}
                >
                  <Text
                    className={`font-semibold ${
                      customDuration === "" && duration === opt
                        ? "text-white"
                        : "text-app-primary"
                    }`}
                  >
                    {opt} hr{opt !== 1 ? "s" : ""}
                  </Text>
                </TouchableOpacity>
              ))}
              <TextInput
                className="flex-1 border border-app-primary rounded-lg px-3 py-2 text-base text-app-text-primary bg-app-modal-bg"
                placeholder="Custom"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={customDuration}
                onChangeText={(text) => {
                  if (/^\d*\.?\d*$/.test(text)) {
                    setCustomDuration(text);
                  }
                }}
                onFocus={() => setDuration(0)}
              />
            </View>

            {/* Miscellaneous Costs */}
            <Text className="text-lg font-semibold text-app-text-primary mb-2">
              Other Costs
            </Text>
            {miscCosts.map((mc, idx) => (
              <View key={idx} className="flex-row items-center mb-2 gap-2">
                <TextInput
                  className="flex-1 border border-app-primary rounded-lg px-3 py-2 text-base text-app-text-primary bg-app-modal-bg"
                  placeholder="Label"
                  placeholderTextColor="#aaa"
                  value={mc.label}
                  onChangeText={(text) => handleMiscLabelChange(idx, text)}
                />
                <TextInput
                  className="w-24 border border-app-primary rounded-lg px-3 py-2 text-base text-app-text-primary bg-app-modal-bg"
                  placeholder="Amount"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={mc.amount}
                  onChangeText={(text) => handleMiscAmountChange(idx, text)}
                />
                <TouchableOpacity
                  className="ml-1"
                  onPress={() => handleRemoveMiscCost(idx)}
                >
                  <MaterialIcons
                    name="remove-circle"
                    size={24}
                    color="#ef4444"
                  />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              className="flex-row items-center justify-center py-3 mt-2 rounded-lg border border-dashed border-app-primary"
              onPress={handleAddMiscCost}
            >
              <MaterialIcons name="add" size={20} color="#6c935c" />
              <Text className="text-app-primary text-base font-semibold ml-2">
                Add Cost
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mt-6">
            <TouchableOpacity
              className="flex-1 py-4 rounded-xl border-2 border-app-primary items-center"
              onPress={handleCancel}
            >
              <Text className="text-app-primary text-base font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-4 rounded-xl items-center bg-app-primary"
              onPress={handleSave}
            >
              <Text className="text-app-white text-base font-semibold">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
