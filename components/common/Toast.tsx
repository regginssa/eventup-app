import React, { useEffect, useState } from "react";
import { Dimensions, Text } from "react-native";
import Animated, {
  FadeOut,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";

export type ToastType = "success" | "error" | "info" | "warn";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
}

const { width } = Dimensions.get("window");

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 2500,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
        ? "bg-red-600"
        : "bg-blue-600";

  return (
    <Animated.View
      entering={SlideInUp}
      exiting={[SlideOutUp.duration(300), FadeOut] as any}
      className={`absolute top-14 self-center ${bgColor} rounded-2xl px-6 py-3 w-[${width * 0.7}px] shadow-lg`}
    >
      <Text className="text-white text-center font-semibold text-base">
        {message}
      </Text>
    </Animated.View>
  );
};

export default Toast;
