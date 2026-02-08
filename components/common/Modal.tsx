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
      {/* BACKDROP */}
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
        onPress={onClose}
      />

      {/* SHEET */}
      <View
        className="bg-white rounded-t-2xl p-5"
        style={{
          height: scrolled ? "auto" : SHEET_MAX_HEIGHT,
        }}
      >
        {/* HANDLE */}
        <View className="items-center mb-3">
          <View className="w-12 h-1 bg-gray-300 rounded-full" />
        </View>

        {/* HEADER */}
        <View className="flex-row items-center gap-4 mb-3">
          <Text className="font-poppins-semibold text-lg text-gray-700 flex-1">
            {title}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
          >
            <Entypo name="cross" size={16} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* BODY */}
        {scrolled ? (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1">{children}</View>
        )}
      </View>
    </RNModal>
  );
};

export default Modal;
