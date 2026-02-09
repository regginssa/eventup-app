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
      {/* HEADER */}
      <View className="flex flex-row items-center justify-between px-4 pt-4">
        <Text className="font-poppins-semibold text-lg text-gray-700 flex-1">
          {title && title}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
        >
          <Entypo name="cross" size={16} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <View className="flex-1 p-4">{children}</View>
    </RNModal>
  );
};

export default NormalModal;
