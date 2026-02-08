import { BlurView } from "expo-blur";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <BlurView intensity={50} className="flex-1 justify-center items-center">
        <View className="w-4/5 bg-white p-6 rounded-2xl shadow-lg">
          <Text className="text-xl font-bold text-center mb-2">{title}</Text>
          <Text className="text-gray-600 text-center mb-6">{message}</Text>

          <View className="flex-row justify-center space-x-3">
            <TouchableOpacity
              onPress={onCancel}
              className="bg-gray-200 px-5 py-2.5 rounded-xl"
            >
              <Text className="font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="bg-red-500 px-5 py-2.5 rounded-xl"
            >
              <Text className="text-white font-bold">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default ConfirmDialog;
