import { TDropdownItem } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TabsProps {
  tabs: TDropdownItem[];
  selectedTab: TDropdownItem;
  onSelct: (tab: TDropdownItem) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, selectedTab, onSelct }) => {
  return (
    <View className="w-full flex flex-row items-center justify-between">
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          className="gap-2"
          onPress={() => onSelct(tab)}
        >
          <Text className="font-poppins-semibold text-gray-800 text-center">
            {tab.label}
          </Text>

          <View className="w-full h-[1px]">
            {selectedTab.value === tab.value && (
              <LinearGradient
                colors={["#C427E0", "#844AFF", "#12A9FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              ></LinearGradient>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default Tabs;
