import { IMessage } from "@/types/message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface MessageItemProps {
  message: IMessage;
  userId: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, userId }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const msgRef = useRef<View>(null);

  const isMine = message.sender._id === userId;

  const formatTime = (dateInput: string | number | Date): string => {
    const date = new Date(dateInput);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const openPopup = () => {
    msgRef.current?.measure((fx, fy, w, h, px, py) => {
      setPopupPos({
        x: isMine ? px + w - 130 : px,
        y: py - 10,
      });
      setPopupVisible(true);
    });
  };

  return (
    <>
      <Pressable
        ref={msgRef}
        onLongPress={openPopup}
        delayLongPress={200}
        className={`w-full flex flex-row ${isMine ? "justify-end" : "justify-start"}`}
      >
        <View
          className={`w-2/3 ${isMine ? "bg-green-200" : "bg-slate-200"} rounded-xl p-2`}
          style={{ maxHeight: 200 }}
        >
          <ScrollView>
            <Text className="font-poppins-medium text-sm text-gray-800">
              {message.text}
            </Text>
          </ScrollView>

          <View className="w-full flex flex-row items-center justify-end gap-2">
            <Text className="font-dm-sans-medium text-gray-600 text-xs">
              {formatTime(message.createdAt)}
            </Text>

            <MaterialCommunityIcons
              name={message.status === "sent" ? "check" : "check-all"}
              size={16}
              color={message.status === "sent" ? "#4b5563" : "#16a34a"}
            />
          </View>
        </View>
      </Pressable>

      <MessageActionsPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        onEdit={() => {
          setPopupVisible(false);
          console.log("Edit message:", message._id);
        }}
        onDelete={() => {
          setPopupVisible(false);
          console.log("Delete message:", message._id);
        }}
        position={popupPos}
      />
    </>
  );
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  position: { x: number; y: number };
}

const MessageActionsPopup: React.FC<Props> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
  position,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
      <Animated.View
        style={[
          styles.popupContainer,
          {
            top: position.y,
            left: position.x,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Pressable style={styles.option} onPress={onEdit}>
          <Text style={styles.text}>Edit</Text>
        </Pressable>

        <Pressable style={styles.option} onPress={onDelete}>
          <Text style={[styles.text, { color: "#dc2626" }]}>Delete</Text>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 6,
    width: 130,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
});

export default MessageItem;
