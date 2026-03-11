import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GoogleIcon = require("@/assets/images/icons/google.png");
const AppleIcon = require("@/assets/images/icons/apple.png");

// Define your brand colors
const BRAND_GRADIENT = ["#C427E0", "#844AFF", "#12A9FF"];
const STROKE_GRADIENT = ["#BF28E0", "#FFFFFF", "#17A3FE"];
const GOLD_GRADIENT = ["#FACC15", "#EAB308", "#CA8A04"]; // Shimmering Gold
const GLASS_GRADIENT = ["#4F46E5", "#7C3AED", "#C026D3"]; // Deep Indigo/Glass

interface ButtonProps {
  type:
    | "primary"
    | "outline"
    | "text"
    | "white"
    | "social"
    | "gradient-soft"
    | "gradient-outline"
    | "gradient-gold"
    | "gradient-glass";
  socialType?: "google" | "apple";
  label: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  buttonClassName?: string;
  textClassName?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  type,
  socialType,
  label,
  icon,
  iconPosition,
  buttonClassName,
  textClassName,
  loading,
  disabled,
  onPress,
}) => {
  const renderContent = (textColor: string = "text-white") => (
    <View className="flex-row items-center justify-center gap-2 px-4">
      {loading ? (
        <ActivityIndicator
          size={16}
          color={textColor === "text-white" ? "#fff" : "#844AFF"}
        />
      ) : (
        <>
          {iconPosition === "left" && icon}
          <Text
            className={`${textColor} font-poppins-semibold text-center ${textClassName}`}
          >
            {label}
          </Text>
          {iconPosition === "right" && icon}
        </>
      )}
    </View>
  );

  // Helper for gradient buttons to reduce repetition
  const GradientButton = (colors: string[], isSecondary: boolean = false) => (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`h-12 overflow-hidden rounded-full shadow-md ${buttonClassName}`}
      disabled={loading || disabled}
      onPress={onPress}
    >
      <LinearGradient
        colors={disabled ? ["#94a3b8", "#cbd5e1"] : (colors as any)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex-1 items-center justify-center"
      >
        {renderContent()}
      </LinearGradient>
    </TouchableOpacity>
  );

  // 1. PRIMARY: Your Brand Gradient
  if (type === "primary") return GradientButton(BRAND_GRADIENT);

  // 2. GRADIENT GOLD: For Premium/VIP actions
  if (type === "gradient-gold") return GradientButton(GOLD_GRADIENT);

  // 3. GRADIENT GLASS: Deep, vibrant contrast
  if (type === "gradient-glass") return GradientButton(GLASS_GRADIENT);

  // 4. GRADIENT SOFT: Light Pastel / Glass style
  if (type === "gradient-soft") {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        className={`h-12 overflow-hidden rounded-full border border-purple-100/50 ${buttonClassName}`}
        onPress={onPress}
        disabled={loading || disabled}
      >
        <View className="flex-1 bg-purple-50 items-center justify-center">
          <LinearGradient
            colors={["#844AFF15", "#C427E010"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0"
          />
          {renderContent("text-purple-600")}
        </View>
      </TouchableOpacity>
    );
  }

  // 5. GRADIENT OUTLINE: Transparent with Gradient Border/Text
  if (type === "gradient-outline") {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className={`h-12 ${buttonClassName}`}
        onPress={onPress}
        disabled={loading || disabled}
      >
        <LinearGradient
          colors={STROKE_GRADIENT as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-1 p-[1.5px] rounded-full"
        >
          <View className="flex-1 bg-white rounded-[11px] items-center justify-center">
            <Text className="text-purple-600 font-poppins-semibold">
              {label}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // SOCIAL & OTHER TYPES (UNCHANGED)
  if (type === "social" && socialType) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className={`h-12 rounded-full bg-white border border-slate-100 flex-row items-center justify-center gap-3 ${buttonClassName}`}
        disabled={loading}
        onPress={onPress}
      >
        <Image
          source={socialType === "apple" ? AppleIcon : GoogleIcon}
          style={styles.socialIcon}
        />
        <Text className="text-slate-600 font-poppins-semibold text-sm">
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  if (type === "text") {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className={`py-2 ${buttonClassName}`}
        onPress={onPress}
      >
        <Text
          className={`text-slate-400 font-poppins-semibold ${textClassName}`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  socialIcon: {
    width: 20,
    height: 20,
  },
});

export default Button;
