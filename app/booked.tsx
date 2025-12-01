import { Button, TicketQR } from "@/components/common";
import { BookedContainer } from "@/components/organisms";
import { useTheme } from "@/components/providers/ThemeProvider";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

const BookedLightImage = require("@/assets/images/booked_image.png");
const BookedDarkImage = require("@/assets/images/booked_image_dark.png");

const EventTicket = () => {
  const { theme } = useTheme();

  const items = [
    {
      label: "Tomorrowland Festival 2025",
      icon: "calendar-badge-outline",
    },
    {
      label: "August 15, 2025 – 7:00 PM",
      icon: "calendar-clock-outline",
    },
    {
      label: "Lisboa, Portugal",
      icon: "map-marker-outline",
    },
    {
      label: "VIP (Gold Package)",
      icon: "check-decagram-outline",
    },
    {
      label: "VIP Lane – Zone A",
      icon: "shield-airplane-outline",
    },
  ];

  return (
    <View
      className={`w-full ${
        theme === "light" ? "bg-white" : "bg-[#171C1C]"
      } rounded-xl p-4 gap-3 overflow-hidden`}
    >
      <Text
        className={`font-poppins-semibold ${
          theme === "light" ? "text-gray-700" : "text-gray-200"
        }`}
      >
        Event Ticket
      </Text>

      <View className="w-full flex flex-row gap-3">
        <TicketQR size={120} />

        <View className="flex-1 items-start justify-between gap-1">
          {items.map((item, index) => (
            <View key={index} className="flex flex-row items-center gap-1.5">
              <MaterialCommunityIcons
                name={item.icon as any}
                size={16}
                color={theme === "light" ? "#4b5563" : "#9ca3af"}
              />
              <Text
                className={`font-dm-sans text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                } line-clamp-1`}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const FlightDetails = () => {
  const { theme } = useTheme();

  const items = [
    {
      label: "Airline: Emirates EK 182",
      icon: (
        <MaterialIcons
          name="airlines"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Departure: JFK New York - Aug 14, 2025 – 10:45 PM",
      icon: (
        <MaterialCommunityIcons
          name="calendar-clock-outline"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Arrival: Brussels International - Aug 15, 2025 – 11:20 AM",
      icon: (
        <MaterialCommunityIcons
          name="airplane-landing"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Class: Economy (Standard) / Business (Gold)",
      icon: (
        <MaterialIcons
          name="flight-class"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Confirmation Code: 6YQ4D2",
      icon: (
        <MaterialIcons
          name="event-seat"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
  ];

  return (
    <View
      className={`w-full ${
        theme === "light" ? "bg-white" : "bg-[#171C1C]"
      } rounded-xl p-4 gap-3 overflow-hidden`}
    >
      <Text
        className={`font-poppins-semibold ${
          theme === "light" ? "text-gray-700" : "text-gray-200"
        }`}
      >
        Flight Details
      </Text>

      <View className="w-full flex flex-col items-start gap-2">
        {items.map((item, index) => (
          <View key={index} className="flex flex-row items-start gap-1.5">
            {item.icon}
            <Text
              className={`font-dm-sans text-sm ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              } line-clamp-2`}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const HotelBooking = () => {
  const { theme } = useTheme();

  const items = [
    {
      label: "Hotel: Hilton Brussels Grand Place",
      icon: (
        <MaterialIcons
          name="hotel"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Check-in: Aug 15, 2025 – 2:00 PM",
      icon: (
        <MaterialCommunityIcons
          name="clock"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Check-out: Aug 18, 2025 – 11:00 AM",
      icon: (
        <MaterialCommunityIcons
          name="clock"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Room: Deluxe King Suite (Gold) / Standard Double (Standard)",
      icon: (
        <MaterialIcons
          name="bed"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Reservation Number: HIL-92731",
      icon: (
        <MaterialCommunityIcons
          name="ticket-confirmation-outline"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
  ];

  return (
    <View
      className={`w-full ${
        theme === "light" ? "bg-white" : "bg-[#171C1C]"
      } rounded-xl p-4 gap-3 overflow-hidden`}
    >
      <Text
        className={`font-poppins-semibold ${
          theme === "light" ? "text-gray-700" : "text-gray-200"
        }`}
      >
        Hotel Booking
      </Text>

      <View className="w-full flex flex-col items-start gap-2">
        {items.map((item, index) => (
          <View key={index} className="flex flex-row items-start gap-1.5">
            {item.icon}
            <Text
              className={`font-dm-sans text-sm ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              } line-clamp-2`}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const ChauffeurPickupInfo = () => {
  const { theme } = useTheme();

  const items = [
    {
      label: "Driver: Alexandre B.",
      icon: (
        <MaterialCommunityIcons
          name="account"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Car: Black Mercedes S-Class",
      icon: (
        <MaterialIcons
          name="directions-car"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Pickup: Brussels Airport - Arrivals Terminal",
      icon: (
        <MaterialIcons
          name="luggage"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Contact: +32 478 123 456",
      icon: (
        <MaterialIcons
          name="phone-in-talk"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
  ];

  return (
    <View
      className={`w-full ${
        theme === "light" ? "bg-white" : "bg-[#171C1C]"
      } rounded-xl p-4 gap-3 overflow-hidden`}
    >
      <Text
        className={`font-poppins-semibold ${
          theme === "light" ? "text-gray-700" : "text-gray-200"
        }`}
      >
        Chauffeur Pickup Info (Gold Package Only)
      </Text>

      <View className="w-full flex flex-col items-start gap-2">
        {items.map((item, index) => (
          <View key={index} className="flex flex-row items-start gap-1.5">
            {item.icon}
            <Text
              className={`font-dm-sans text-sm ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              } line-clamp-2`}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const TripSummary = () => {
  const { theme } = useTheme();

  const services = ["Flights", "Hotel", "Tickets", "Transfer"];

  return (
    <View
      className={`w-full ${
        theme === "light" ? "bg-white" : "bg-[#171C1C]"
      } rounded-xl p-4 gap-3 overflow-hidden`}
    >
      <View className="w-full flex flex-row items-center justify-between">
        <Text
          className={`font-poppins-semibold ${
            theme === "light" ? "text-gray-700" : "text-gray-200"
          }`}
        >
          Trip Summary
        </Text>
        <Text className="font-poppins-semibold text-green-500">Confirmed</Text>
      </View>

      <View className="w-full gap-2">
        <View className="w-full flex flex-row items-start gap-6">
          <View className="flex-1 flex-row items-center gap-4">
            {services.map((service, index) => (
              <View key={index} className="flex flex-row items-center gap-1">
                <View className="w-2 h-2 rounded-full bg-gray-400"></View>
                <Text
                  className={`font-dm-sans ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {service}
                </Text>
              </View>
            ))}
          </View>
          <Text
            className={`font-poppins-medium text-lg ${
              theme === "light" ? "text-gray-500" : "text-gray-200"
            }`}
          >
            $120
          </Text>
        </View>

        <View className="w-full flex flex-row items-start gap-6">
          <View className="flex-1 flex-row items-center gap-4">
            <View className="flex flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-gray-400"></View>
              <Text
                className={`font-dm-sans ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Charlie commission
              </Text>
            </View>
          </View>
          <Text
            className={`font-poppins-medium text-lg ${
              theme === "light" ? "text-gray-500" : "text-gray-200"
            }`}
          >
            $24
          </Text>
        </View>
      </View>

      <View
        className={`w-full h-[1px] ${
          theme === "light" ? "bg-gray-200" : "bg-gray-700"
        }`}
      ></View>

      <View className="w-full flex flex-row items-center justify-between">
        <Text
          className={`font-poppins-semibold text-lg ${
            theme === "light" ? "text-gray-700" : "text-gray-200"
          }`}
        >
          Total
        </Text>

        <Text
          className={`font-poppins-semibold text-lg ${
            theme === "light" ? "text-gray-700" : "text-gray-200"
          }`}
        >
          $144
        </Text>
      </View>
    </View>
  );
};

const BookedScreen = () => {
  const { theme } = useTheme();

  return (
    <BookedContainer>
      <View className="relative w-[381px] h-[221px]">
        <Image
          source={theme === "light" ? BookedLightImage : BookedDarkImage}
          alt="Booking confirmed"
          contentFit="cover"
          style={styles.image}
        />
      </View>

      <EventTicket />
      <FlightDetails />
      <HotelBooking />
      <ChauffeurPickupInfo />
      <TripSummary />

      <View className="w-full gap-4 mb-24">
        <Button
          type="primary"
          label="Download Itinerary"
          buttonClassName="h-12"
        />
        <Button type="primary" label="Add to Calendar" buttonClassName="h-12" />
        <Button
          type="primary"
          label="Share with Friends"
          buttonClassName="h-12"
        />
      </View>
    </BookedContainer>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

export default BookedScreen;
