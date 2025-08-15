import React from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface QuitConfirmPopupProps {
  visible: boolean;
  messageTitle?: string;
  messageBody?: string;
  cancelText?: string;
  confirmText?: string;
  cancelButtonColor?: string;
  confirmButtonColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onCancel: () => void;
  onQuit: () => void;
}

export default function QuitConfirmPopup({
  visible,
  messageTitle = "Popup title goes here",
  messageBody = "Popup body goes here",
  cancelText = "Cancel",
  confirmText = "Confirm",
  cancelButtonColor = "#444",
  confirmButtonColor = "#921721bc",
  containerStyle,
  onCancel,
  onQuit,
}: QuitConfirmPopupProps) {
  if (!visible) return null;

  return (
    <View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        },
        containerStyle,
      ]}
    >
      <View
        style={{
          backgroundColor: "#222",
          padding: 32,
          borderRadius: 16,
          alignItems: "center",
          width: 380,
        }}
      >
        <Text style={{ color: "#bbb", fontSize: 22, marginBottom: 30 }}>
          {messageTitle}
        </Text>
        <Text style={{ color: "#bbb", fontSize: 18, marginBottom: 30 }}>
          {messageBody}
        </Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity
            onPress={onCancel}
            style={{
              backgroundColor: cancelButtonColor,
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 8,
              marginRight: 38,
            }}
          >
            <Text style={{ color: "#bbb", fontSize: 18 }}>{cancelText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onQuit}
            style={{
              backgroundColor: confirmButtonColor,
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#bbb", fontWeight: "bold", fontSize: 18 }}>
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
