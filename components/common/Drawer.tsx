import Constants from "expo-constants";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Pressable, View } from "react-native";

const { width } = Dimensions.get("window");
const statusBarHeight = Constants.statusBarHeight;

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header?: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  header,
  children,
}) => {
  const translateX = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isOpen ? 0 : width,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <View className="absolute inset-0">
      {/* Overlay */}
      {isOpen && (
        <Pressable onPress={onClose} className="absolute inset-0 bg-black/40" />
      )}

      {/* Drawer container */}
      <Animated.View
        className={`absolute top-0 right-0 h-full bg-white rounded-t-2xl p-6 gap-8 z-50 flex-1`}
        style={[
          {
            top: statusBarHeight + 10,
            width: width,
            transform: [{ translateX }],
          },
        ]}
      >
        {header}
        {children}
      </Animated.View>
    </View>
  );
};

export default Drawer;
