import React from "react";
import {
  Dimensions,
  Modal,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ModalPopupProps {
  visible: boolean;
  messageTitle?: string;
  messageBody?: string;
  cancelText?: string;
  confirmText?: string;
  cancelButtonColor?: string;
  confirmButtonColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export default function ModalPopup({
  visible,
  messageTitle,
  messageBody,
  cancelText,
  confirmText,
  cancelButtonColor,
  confirmButtonColor,
  containerStyle,
  icon,
  onCancel,
  onConfirm,
}: ModalPopupProps) {
  const { width, height } = Dimensions.get("window");
  const modalWidth = Math.min(width, height) * 0.8;

  return (
    <View>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View
          style={[
            {
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.8)",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
          ]}
        >
          <View
            style={[
              {
                backgroundColor: "#1b2129ff",
                padding: 32,
                borderRadius: 16,
                alignItems: "center",
                width: modalWidth,
                maxWidth: 500,
                position: "relative",
              },
              containerStyle,
            ]}
          >
            {/* Icon in top left */}
            {icon && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
              >
                {icon}
              </View>
            )}
            <Text style={{ color: "#bbb", fontSize: 20, marginBottom: 30 }}>
              {messageTitle}
            </Text>
            <Text style={{ color: "#bbb", fontSize: 14, marginBottom: 30 }}>
              {messageBody}
            </Text>
            <View style={{ flexDirection: "row", gap: 50 }}>
              {cancelText !== undefined && (
                <TouchableOpacity
                  onPress={onCancel}
                  style={{
                    backgroundColor: cancelButtonColor,
                    paddingVertical: 12,
                    paddingHorizontal: 30,
                    borderRadius: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.7,
                    shadowRadius: 3.84,
                    elevation: 8,
                  }}
                >
                  <Text style={{ color: "#bbb", fontSize: 16 }}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onConfirm}
                style={{
                  backgroundColor: confirmButtonColor,
                  paddingVertical: 12,
                  paddingHorizontal: 30,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.7,
                  shadowRadius: 3.84,
                  elevation: 8,
                }}
              >
                <Text
                  style={{ color: "#bbb", fontWeight: "bold", fontSize: 16 }}
                >
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
