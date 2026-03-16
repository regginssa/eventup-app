import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

interface StreamerProps {
  isPlaying: boolean;
}

const Streamer: React.FC<StreamerProps> = ({ isPlaying }) => {
  const bars = [...Array(20).keys()];
  const animations = useRef(bars.map(() => new Animated.Value(0))).current;

  const startAnimation = () => {
    animations.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 300 + i * 40,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300 + i * 40,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  };

  const stopAnimation = () => {
    animations.forEach((anim) => {
      anim.stopAnimation();
      anim.setValue(0);
    });
  };

  useEffect(() => {
    if (isPlaying) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return stopAnimation;
  }, [isPlaying]);

  return (
    <View className="flex-row items-end gap-[2px] flex-1 w-full">
      {bars.map((_, i) => (
        <Animated.View
          key={i}
          style={{
            width: 3,
            height: 16,
            backgroundColor: "#555",
            borderRadius: 5,
            transform: [
              {
                scaleY: animations[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
};

export default Streamer;
