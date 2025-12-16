import { setBookingTransfer } from "@/redux/slices/booking.slice";
import { TTransfer, TTransferProduct } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { TransferItem } from "../common";

interface TransferAvailabilityGroupProps {
  transfer: TTransfer | null;
  isSearched?: boolean;
  available?: boolean;
  hiddenSeeMore?: boolean;
}

const TransferAvailabilityGroup: React.FC<TransferAvailabilityGroupProps> = ({
  transfer,
  isSearched,
  available,
  hiddenSeeMore,
}) => {
  const dispatch = useDispatch();

  const moveProductToFirst = (
    products: TTransferProduct[],
    selected: TTransferProduct
  ): TTransferProduct[] => {
    return [
      selected,
      ...products.filter(
        (p) => p.general.productId !== selected.general.productId
      ),
    ];
  };

  if (isSearched && !transfer) {
    return (
      <View className="w-full flex flex-col items-center justify-center gap-2">
        <MaterialCommunityIcons name="car-off" size={24} color="#4b5563" />
        <Text className="font-poppins-semibold text-gray-600">
          No available transfers
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full gap-4">
      <View className="flex flex-row items-center gap-2">
        <MaterialCommunityIcons name="car-outline" size={20} color="#374151" />
        <Text className="font-dm-sans-bold text-gray-700">
          {available ? "Available" : ""} Transfers
        </Text>
      </View>

      <TransferItem
        transfer={transfer?.ah}
        hiddenSeeMore={hiddenSeeMore}
        onSelect={(selectedProduct: TTransferProduct) => {
          if (!transfer?.ah?.travelling?.products) return;

          const reorderedProducts = moveProductToFirst(
            transfer.ah.travelling.products,
            selectedProduct
          );

          dispatch(
            setBookingTransfer({
              ...transfer,
              ah: {
                ...transfer.ah,
                travelling: {
                  ...transfer.ah.travelling,
                  products: reorderedProducts,
                },
              },
            })
          );
        }}
      />

      <View className="w-full h-[1px] bg-gray-200"></View>

      <TransferItem
        transfer={transfer?.he}
        hiddenSeeMore={hiddenSeeMore}
        onSelect={(selectedProduct: TTransferProduct) => {
          if (!transfer?.ah?.travelling?.products) return;

          const reorderedProducts = moveProductToFirst(
            transfer.ah.travelling.products,
            selectedProduct
          );

          dispatch(
            setBookingTransfer({
              ...transfer,
              he: {
                ...transfer.he,
                travelling: {
                  ...transfer.he.travelling,
                  products: reorderedProducts,
                },
              },
            })
          );
        }}
      />
    </View>
  );
};

export default TransferAvailabilityGroup;
