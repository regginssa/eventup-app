import { Image } from "expo-image";
import { ScrollView, StyleSheet, View } from "react-native";

interface ImageGroupProps {
  imgs: string[];
  showCount?: number;
  size?: number;
}

const ImageGroup: React.FC<ImageGroupProps> = ({
  imgs,
  showCount = imgs.length,
  size = 120,
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {imgs.slice(0, showCount).map((img, index) => (
        <View
          key={`img-${index}`}
          className="relative mr-2 rounded-lg overflow-hidden"
          style={{ width: size, height: size }}
        >
          <Image
            source={{ uri: img }}
            style={styles.image}
            contentFit="cover"
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImageGroup;
