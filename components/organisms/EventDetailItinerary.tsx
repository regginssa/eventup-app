import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const EventDetailItinerary = () => {
  return (
    <View className="flex-1 gap-4 overflow-hidden">
      {/* Flight */}
      <View className="w-full rounded-lg gap-2">
        <Text className="text-gray-700 font-poppins-semibold mb-2">
          Flight Details
        </Text>

        <View className="flex flex-row items-start gap-2">
          <MaterialIcons name="airlines" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Airline: Emirates EK 182
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={16}
            color="#4b5563"
          />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Departure: JFK New York - Aug 14, 2025 - 10:45 PM
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialCommunityIcons
            name="airplane-takeoff"
            size={16}
            color="#4b5563"
          />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Arrival: Brussels International - Aug 15, 2025 – 11:20 AM
          </Text>
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      {/* Hotel */}
      <View className="w-full rounded-lg gap-2">
        <Text className="text-gray-700 font-poppins-semibold mb-2">
          Hotel Booking
        </Text>

        <View className="flex flex-row items-start gap-2">
          <MaterialIcons name="hotel" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Hotel: Hilton Brussels Grand Place
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialCommunityIcons
            name="clock-check-outline"
            size={16}
            color="#4b5563"
          />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Check-in: Aug 15, 2025 - 2:00 PM
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialCommunityIcons
            name="clock-check-outline"
            size={16}
            color="#4b5563"
          />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Check-out: Aug 18, 2025 – 11:00 AM
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialIcons name="bed" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Room: Deluxe King Suite (Gold) / Standard Double (Standard)
          </Text>
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      {/* Chauffeur Pickup Info (Gold Package Only) */}
      <View className="w-full rounded-lg gap-2">
        <Text className="text-gray-700 font-poppins-semibold mb-2">
          Chauffeur Pickup Info (Gold Package Only)
        </Text>

        <View className="flex flex-row items-start gap-2">
          <MaterialCommunityIcons name="account" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Driver: Alexandre B.
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialIcons name="directions-car" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Car: Black Mercedes S-Class
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialIcons name="luggage" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Pickup: Brussels Airport - Arrivals Terminal
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialIcons name="phone-in-talk" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Contact: +32 478 123 456
          </Text>
        </View>
      </View>
    </View>
  );
};

export default EventDetailItinerary;
