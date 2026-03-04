import { IEvent } from "@/types/event";
import df from "@/utils/date";
import { formatEventLabel } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface OfficialTicketItemProps {
  event: IEvent;
}

const OfficialTicketItem: React.FC<OfficialTicketItemProps> = ({ event }) => {
  const startDate = event?.dates?.start?.date
    ? df.toShortDate(event.dates.start.date)
    : "Date TBA";

  const startTime = event?.dates?.start?.time || "Time TBA";

  const venue =
    event?.location?.name ||
    event?.location?.address ||
    `${event?.location?.city?.name}, ${event?.location?.country?.name}` ||
    "Venue TBA";

  const category =
    event?.classifications?.category ||
    event?.classifications?.vibe?.[0] ||
    "General Event";

  const eventImage = event?.images?.[0];

  return (
    <View className=" shadow-xl shadow-purple-200">
      <LinearGradient
        colors={["#844AFF", "#C427E0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 24, padding: 1 }}
      >
        <View className="bg-white/95 rounded-[23px] p-5 overflow-hidden">
          {/* BACKGROUND WATERMARK */}
          <View className="absolute -right-14 -top-14 opacity-[0.05]">
            <MaterialCommunityIcons
              name="ticket-confirmation-outline"
              size={160}
              color="#000"
            />
          </View>

          {/* HEADER */}
          <View className="flex-row items-center gap-3 mb-5">
            <LinearGradient
              colors={["#844AFF20", "#C427E020"]}
              className="p-2"
              style={{ borderRadius: 12 }}
            >
              <MaterialCommunityIcons
                name="ticket-confirmation"
                size={22}
                color="#844AFF"
              />
            </LinearGradient>

            <View className="flex-1">
              <Text
                className="font-poppins-bold text-slate-900 text-base"
                numberOfLines={1}
              >
                {event?.name || "Event Admission"}
              </Text>
              <Text className="font-dm-sans-bold text-[10px] text-purple-500/60 uppercase mt-0.5">
                {formatEventLabel(category)}
              </Text>
            </View>

            {eventImage && (
              <Image
                source={{ uri: eventImage }}
                style={{ width: 40, height: 40, borderRadius: 10 }}
              />
            )}
          </View>

          {/* EVENT DETAILS */}
          <View className="gap-3">
            {/* DATE */}
            <View className="flex-row items-center gap-2">
              <View className="bg-purple-100 p-1.5 rounded-lg">
                <MaterialCommunityIcons
                  name="calendar"
                  size={14}
                  color="#844AFF"
                />
              </View>
              <Text className="text-slate-600 text-xs">
                {startDate} — {startTime}
              </Text>
            </View>

            {/* VENUE */}
            <View className="flex-row items-center gap-2">
              <View className="bg-purple-100 p-1.5 rounded-lg">
                <MaterialCommunityIcons
                  name="map-marker"
                  size={14}
                  color="#844AFF"
                />
              </View>
              <Text className="text-slate-600 text-xs" numberOfLines={1}>
                {venue}
              </Text>
            </View>

            {/* PRICE */}
            {event?.fee && (
              <View className="flex-row items-center gap-2">
                <View className="bg-purple-100 p-1.5 rounded-lg">
                  <MaterialCommunityIcons
                    name="cash-multiple"
                    size={14}
                    color="#844AFF"
                  />
                </View>
                <Text className="text-slate-600 text-xs" numberOfLines={1}>
                  {event.fee.type === "free"
                    ? "Free Event"
                    : `${event.fee.currency} ${event.fee.amount}`}
                </Text>
              </View>
            )}

            {/* TICKETMASTER WINDOW (IF EXISTS) */}
            {event?.tm?.sales?.startDateTime && (
              <View className="flex-row items-center gap-2">
                <View className="bg-purple-100 p-1.5 rounded-lg">
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={14}
                    color="#844AFF"
                  />
                </View>
                <Text className="text-slate-600 text-xs">
                  Access Code Opens:{" "}
                  {df.toShortDate(event.tm.sales.startDateTime)}
                </Text>
              </View>
            )}
          </View>

          <View className="border-t border-slate-100 my-4" />

          {/* FOOTER NOTE */}
          <Text className="text-[10px] text-slate-400 leading-4 font-dm-sans-medium">
            Your admission includes full access to the event. Detailed digital
            tickets will be issued after checkout.
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default OfficialTicketItem;
