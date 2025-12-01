import { Entypo } from "@expo/vector-icons";
import {
  Dimensions,
  Pressable,
  Modal as RNModal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ModalProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  height?: number;
  scrolled?: boolean;
  onClose: () => void;
}

const SHEET_MAX_HEIGHT = Dimensions.get("window").height * 0.75;

const Modal: React.FC<ModalProps> = ({
  children,
  title,
  scrolled,
  isOpen,
  onClose,
}) => {
  return (
    <RNModal
      animationType="slide"
      visible={isOpen}
      onRequestClose={onClose}
      transparent
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable className="flex-1 bg-black/30" onPress={onClose}>
        {/* Bottom sheet wrapper */}
        <View className="flex-1 justify-end">
          {/* Sheet */}
          <View
            className="bg-white rounded-t-2xl p-4"
            style={{
              maxHeight: SHEET_MAX_HEIGHT,
              height: !scrolled ? SHEET_MAX_HEIGHT : "auto",
              width: "100%",
            }}
            onStartShouldSetResponder={() => true}
          >
            {/* Handle */}
            <View className="items-center mb-3">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-poppins-semibold text-lg text-gray-700">
                {title}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                onPress={onClose}
              >
                <Entypo name="cross" size={16} color="#1f2937" />
              </TouchableOpacity>
            </View>

            {/* Body */}
            {scrolled ? (
              <ScrollView style={{ paddingBottom: 20, paddingHorizontal: 10 }}>
                {children}
              </ScrollView>
            ) : (
              <View className="flex-1">{children}</View>
            )}
          </View>
        </View>
      </Pressable>
    </RNModal>
  );
};

export default Modal;
