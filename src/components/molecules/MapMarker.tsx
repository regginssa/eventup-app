import { TCoordinate } from "@/src/types";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

const MarkerIcon = require("@/assets/images/icons/map_marker.png");

interface MapMarkerProps {
  coordinate: TCoordinate;
  onPress?: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ coordinate, onPress }) => {
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View className="w-[21.33px] h-[26.67px] relative">
        <Image
          source={MarkerIcon}
          alt="marker"
          style={styles.image}
          contentFit="cover"
        />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

export default MapMarker;
