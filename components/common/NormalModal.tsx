import { Entypo } from "@expo/vector-icons";
import { Modal as RNModal, Text, TouchableOpacity, View } from "react-native";

interface NormalModalProps {
  children: React.ReactNode;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

const NormalModal: React.FC<NormalModalProps> = ({
  children,
  title,
  isOpen,
  onClose,
}) => {
  return (
    <RNModal
      animationType="fade"
      visible={isOpen}
      onRequestClose={onClose}
      transparent
      statusBarTranslucent
    >
      {/* BACKDROP */}
      <View className="flex-1 bg-black/50 items-center justify-center px-4">
        {/* MODAL CONTAINER */}
        <View className="w-full max-w-sm bg-white rounded-xl p-4 shadow-lg">
          {/* HEADER */}
          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="font-poppins-semibold text-lg text-gray-700 flex-1">
              {title || ""}
            </Text>

            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <Entypo name="cross" size={16} color="#1f2937" />
            </TouchableOpacity>
          </View>

          {/* BODY */}
          {children}
        </View>
      </View>
    </RNModal>
  );
};

export default NormalModal;
