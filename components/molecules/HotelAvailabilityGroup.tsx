import { fetchHotelDetails } from "@/api/scripts/booking";
import { setBookingHotel } from "@/redux/slices/booking.slice";
import { RootState } from "@/redux/store";
import { THotelAvailability } from "@/types";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, HotelItem, Modal, Spinner } from "../common";

interface HotelAvailabilityGroupProps {
  sessionId?: string;
  recommend?: THotelAvailability | null;
  availabilities: THotelAvailability[];
  isSearched: boolean;
  onSelect: (hotel: THotelAvailability) => void;
}

const HotelAvailabilityGroup: React.FC<HotelAvailabilityGroupProps> = ({
  sessionId,
  recommend,
  availabilities,
  isSearched,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isImageOpen, setIsImageOpen] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { hotel } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();

  const renderItem = ({ item }: { item: THotelAvailability }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        className="w-full p-3 bg-white border border-gray-200 rounded-xl"
        style={styles.listContainer}
        onPress={() => {
          onSelect(item);
          setIsOpen(false);
        }}
      >
        <HotelItem hotel={item} hiddenHeader={true} hiddenImages={true} />
      </TouchableOpacity>
    );
  };

  const handleViewImages = async () => {
    if (
      !sessionId ||
      !recommend?.hotelId ||
      !recommend.productId ||
      !recommend.tokenId
    )
      return;

    try {
      setLoading(true);
      setIsImageOpen(true);

      const { hotelId, productId, tokenId } = recommend;

      const response = await fetchHotelDetails(
        sessionId,
        hotelId,
        productId,
        tokenId
      );

      if (response.data) {
        dispatch(
          setBookingHotel({
            ...(hotel as any),
            recommend: { ...hotel?.recommend, details: response.data },
          })
        );

        const images = response.data.hotelImages.map((hi) => hi.url);
        setImages(images);
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  if (isSearched && !recommend) {
    return (
      <View className="w-full flex flex-col items-center justify-center gap-2">
        <MaterialCommunityIcons
          name="bank-off-outline"
          size={24}
          color="#4b5563"
        />
        <Text className="font-poppins-semibold text-gray-600">
          No available hotels
        </Text>
      </View>
    );
  }

  return (
    <>
      {recommend && (
        <View className="w-full gap-4 overflow-hidden">
          <View className="flex flex-row items-center gap-2">
            <MaterialIcons name="hotel" size={20} color="#374151" />
            <Text className="font-dm-sans-bold text-gray-700">
              Available Hotels
            </Text>
          </View>

          <HotelItem
            hotel={recommend}
            hiddenHeader={true}
            onViewImages={handleViewImages}
          />

          <Button
            type="text"
            label="See more"
            textClassName="text-gray-700"
            buttonClassName="h-8"
            onPress={() => setIsOpen(true)}
          />
        </View>
      )}

      <Modal
        title="Available Hotels"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <FlatList
          data={availabilities}
          keyExtractor={(item) => item.hotelId}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 16 }}
        />
      </Modal>

      <Modal
        title={recommend?.hotelName || ""}
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
      >
        {loading ? (
          <Spinner size="md" />
        ) : images.length === 0 ? (
          <View className="w-full flex flex-col items-center justify-center gap-2">
            <MaterialIcons
              name="image-not-supported"
              size={24}
              color="#374151"
            />
            <Text className="font-poppins-semibold text-gray-700 text-base text-center">
              No Images
            </Text>
          </View>
        ) : (
          <FlatList
            data={images}
            renderItem={({ item }) => (
              <View
                className="w-full h-[150px] relative overflow-hidden rounded-lg bg-white border border-gray-200 mb-3"
                style={styles.listContainer}
              >
                <Image
                  source={{ uri: item }}
                  alt={recommend?.hotelName}
                  contentFit="cover"
                  style={styles.image}
                />
              </View>
            )}
          />
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default HotelAvailabilityGroup;
