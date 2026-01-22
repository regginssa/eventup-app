import { TDropdownItem } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TabsProps {
  tabs: TDropdownItem[];
  selectedTab: TDropdownItem;
  tabClassName?: string;
  onSelct: (tab: TDropdownItem) => void;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  selectedTab,
  onSelct,
  tabClassName,
}) => {
  return (
    <View className="flex flex-row gap-2">
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          className={tabClassName}
          onPress={() => onSelct(tab)}
        >
          <View className="flex flex-row items-center justify-center gap-1 p-2">
            {tab.icon}
            <Text className="font-poppins-semibold text-gray-800 text-center whitespace-nowrap">
              {tab.label}
            </Text>
          </View>

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
