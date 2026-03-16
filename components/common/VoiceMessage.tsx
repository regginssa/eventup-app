import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AudioStatus, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

interface VoiceMessageProps {
  url: string;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({
  url,
}: {
  url: string;
}) => {
  const player = useAudioPlayer(url);
  const status = useAudioPlayerStatus(player);

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  // Animated waveform bars
  const bars = [...Array(20).keys()];
  const animations = useRef(bars.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (status.playing) animateBars();
    else stopAnimation();
  }, [status.playing]);

  useEffect(() => {
    const sub = player.addListener(
      "playbackStatusUpdate",
      (status: AudioStatus) => {
        if (status.didJustFinish) {
          player.pause();
          player.seekTo(0);
        }
      },
    );

    return () => sub.remove();
  }, [player]);

  const animateBars = () => {
    const animationsSequence = animations.map((anim) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.2,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    Animated.stagger(100, animationsSequence).start();
  };

  const stopAnimation = () => {
    animations.forEach((a) => a.stopAnimation());
  };

  return (
    <View className="flex flex-row items-center gap-2">
      {/* Play / Pause Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => (status.playing ? player.pause() : player.play())}
      >
        <MaterialCommunityIcons
          name={status.playing ? "pause-circle-outline" : "play-circle-outline"}
          size={24}
          color="#1f2937"
        />
      </TouchableOpacity>

      {/* Waveform */}
      <View className="flex-row items-end gap-[2px] flex-1">
        {bars.map((_, i) => (
          <Animated.View
            key={i}
            style={{
              width: 3,
              height: 16,
              backgroundColor: "#555",
              opacity: animations[i],
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

      {/* Duration */}
      <Text className="text-sm text-gray-700">
        {formatDuration(status.duration)}
      </Text>
    </View>
  );
};

export default VoiceMessage;
