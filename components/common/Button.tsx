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

interface ButtonProps {
  type: "primary" | "outline" | "text" | "white" | "social";
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
  if (type === "outline") {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className={`border border-[#BF28E0] rounded-md items-center justify-center ${buttonClassName}`}
        disabled={loading}
        onPress={onPress}
      >
        <Text className="text-white font-poppins-medium text-center">
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  if (type === "primary") {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className={buttonClassName}
        disabled={loading || disabled}
        onPress={onPress}
      >
        {disabled ? (
          <View className="flex-1 flex-row bg-gray-400 items-center justify-center gap-2 rounded-md">
            <Text
              className={`text-gray-300 font-poppins-medium text-center ${textClassName}`}
            >
              {label}
            </Text>
          </View>
        ) : (
          <LinearGradient
            colors={["#BF28E0", "#FFFFFF", "#17A3FE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryGradient}
          >
            <LinearGradient
              colors={["#C427E0", "#844AFF", "#12A9FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryInner}
            >
              <View className="flex-1 flex-row items-center justify-center gap-2">
                {iconPosition === "left" && icon && !loading && icon}
                {iconPosition === "left" && icon && loading && (
                  <ActivityIndicator size={16} color="#ffffff" />
                )}
                <Text
                  className={`text-white font-poppins-medium text-center ${textClassName}`}
                >
                  {label}
                </Text>
                {!icon && !iconPosition && loading && (
                  <ActivityIndicator size={16} color="#ffffff" />
                )}
                {iconPosition === "right" && icon && !loading && icon}
                {iconPosition === "right" && icon && loading && (
                  <ActivityIndicator size={16} color="#ffffff" />
                )}
              </View>
            </LinearGradient>
          </LinearGradient>
        )}
      </TouchableOpacity>
    );
  }

  if (type === "social" && socialType) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className={`rounded-md ${buttonClassName} bg-white flex flex-row items-center justify-center gap-2`}
        disabled={loading}
        onPress={onPress}
      >
        {loading ? (
          <ActivityIndicator size={16} color="#6b7280" />
        ) : (
          <>
            <Image source={GoogleIcon} style={styles.socialIcon} />
            <Text
              className={`text-gray-500 font-poppins-medium text-sm text-center ${textClassName}`}
            >
              {label}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  if (type === "text") {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className={`items-center justify-center ${buttonClassName}`}
        disabled={loading}
        onPress={onPress}
      >
        <Text className={`${textClassName} font-poppins-medium text-sm`}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  if (type === "white") {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className={`rounded-md ${buttonClassName} bg-white flex flex-row items-center justify-center gap-2`}
        disabled={loading}
        onPress={onPress}
      >
        {loading ? (
          <ActivityIndicator size={16} color="#6b7280" />
        ) : (
          <>
            {iconPosition === "left" && icon && icon}
            <Text
              className={`text-gray-500 font-poppins-medium text-sm text-center ${textClassName}`}
            >
              {label}
            </Text>
            {iconPosition === "right" && icon && icon}
          </>
        )}
      </TouchableOpacity>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  primaryGradient: {
    flex: 1,
    borderRadius: 6,
  },
  primaryInner: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
  },
  socialIcon: {
    width: 16,
    height: 16,
  },
});

export default Button;
