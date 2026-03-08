// LocationPicker.tsx
import { GOOGLE_API_KEY } from "@/config/env";
import { TLocation } from "@/types";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LocationSuggestion {
  description: string;
  place_id: string;
}

interface LocationPickerProps {
  label?: string;
  placeholder?: string;
  invalid?: boolean;
  invalidText?: string;
  value: TLocation | null;
  onPick: (location: TLocation) => void;
  country?: string;
  region?: string;
  city?: string; // e.g. "Ipswich"
  bordered?: boolean;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  label,
  placeholder,
  invalid,
  invalidText,
  value,
  onPick,
  country,
  region,
  city,
  bordered,
}) => {
  const [input, setInput] = useState<string>(value?.description ?? "");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translatedPlaceholder, setTranslatedPlaceholder] =
    useState<string>("");

  // --- NEW: refs to control behavior after selecting a suggestion ---
  const skipNextFetchRef = useRef(false);
  const debounceRef = useRef<any>(null);
  const inputRef = useRef<TextInput | null>(null);

  // translate placeholder
  //   useEffect(() => {
  //     const translate = async () => {
  //       if (!placeholder) return "";
  //       const translatedText = await translateText(placeholder);
  //       setTranslatedPlaceholder(translatedText);
  //     };
  //     translate();
  //   }, [placeholder, translateText]);

  // keep input in sync if parent updates `value`
  useEffect(() => {
    if (value?.description && value.description !== input) {
      setInput(value.description);
    }
  }, [value?.description]);

  useEffect(() => {
    // Skip one cycle right after a user picks a suggestion
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }

    if (input.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setLoading(true);

        let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input,
        )}&key=${GOOGLE_API_KEY}&language=en`;

        if (country) {
          url += `&components=country:${country}`;
        }

        const response = await fetch(url);
        const json = await response.json();

        if (json.predictions) {
          let preds: LocationSuggestion[] = json.predictions;

          // Filter by city/region if provided
          if (region || city) {
            const filtered = preds.filter((p) => {
              const desc = p.description.toLowerCase();
              return (
                (region && desc.includes(region.toLowerCase())) ||
                (city && desc.includes(city.toLowerCase()))
              );
            });

            // Use filtered if found, otherwise fallback to original
            preds = filtered.length > 0 ? filtered : preds;
          }

          setSuggestions(preds);
          setShowSuggestions(preds.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Autocomplete error:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce (and clear previous timer)
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchSuggestions, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, country, region, city]);

  const extractCityName = (components: any[]): string | null => {
    const cityComponent = components.find(
      (component: any) =>
        component.types.includes("locality") ||
        component.types.includes("postal_town") ||
        component.types.includes("administrative_area_level_2"),
    );
    return cityComponent?.long_name || null;
  };

  const handlePick = async (description: string, placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}&language=en`,
      );
      const json = await response.json();

      const location = json.result?.geometry?.location;
      const components = json.result?.address_components || [];

      const cityName = extractCityName(components);

      let valid = true;
      if (region) {
        const allText = components.map((c: any) => c.long_name.toLowerCase());

        if (
          region &&
          !allText.some((t: string) => t.includes(region.toLowerCase()))
        ) {
          valid = false;
        }
      }

      if (!valid) {
        Alert.alert("Invalid address", "Picked place is outside allowed area");
        return;
      }

      if (location) {
        skipNextFetchRef.current = true;

        if (debounceRef.current) clearTimeout(debounceRef.current);

        onPick({
          description,
          coordinate: {
            latitude: location.lat,
            longitude: location.lng,
          },
          cityName: cityName || "",
        });

        setInput(description);
        setSuggestions([]);
        setShowSuggestions(false);

        inputRef.current?.blur();
      } else {
        console.warn("No geometry found in Place Details.");
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <View className="w-full flex flex-col items-start gap-2 relative">
      {label && (
        <Text className="font-dm-sans text-sm text-gray-700">{label}</Text>
      )}
      <View
        className={`py-1 px-4 gap-2 bg-white rounded-full flex flex-row items-center ${
          bordered ? "border border-gray-200" : ""
        }`}
      >
        <Feather name="map" size={16} color="#4b5563" />
        <TextInput
          ref={inputRef}
          placeholder={placeholder}
          className="flex-1 bg-none text-black font-dm-sans text-sm"
          value={input}
          onChangeText={(t) => {
            setInput(t);
            skipNextFetchRef.current = false;
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
        />
        <Entypo name="chevron-small-down" size={16} color="#4b5563" />
      </View>

      {invalid && invalidText && (
        <Text className="text-red-500 text-[12px] leading-4">
          {invalidText}
        </Text>
      )}

      {(showSuggestions || loading) && (
        <View style={styles.dropContainer}>
          {loading ? (
            <View className="py-4 px-4">
              <ActivityIndicator size="small" color="#314158" />
            </View>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled">
              {suggestions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  className="px-4 py-3 border-b border-slate-100 flex flex-row items-center gap-2"
                  onPress={() => handlePick(item.description, item.place_id)}
                >
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color="#62748E"
                  />
                  <Text
                    numberOfLines={1}
                    className="text-[14px] text-slate-700 flex-1"
                  >
                    {item.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: "absolute",
    top: "100%",
    marginTop: 4,
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    zIndex: 999,
    maxHeight: 250,
  },
});

export default LocationPicker;
