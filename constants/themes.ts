export const LIGHT_THEME = {
  bg: "bg-[#EEF0FC]",
};

export const COLORFUL_MAP_STYLE = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f3f1ff" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#5c4699" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }],
  },

  // Water — deeper aqua blue
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#9ed7ff" }], // richer version of #12A9FF
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#17A3FE" }],
  },

  // Parks — cool mint-lavender
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#d9f2df" }],
  },

  // Points of Interest — magenta glow
  {
    featureType: "poi",
    elementType: "geometry.fill",
    stylers: [{ color: "#eed5ff" }], // mix of #BF28E0 and #C427E0
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a04deb" }],
  },

  // Roads — light gray with glowing purple edges
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f8f6ff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d1b8ff" }], // pale #844AFF edge
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#f1e0ff" }], // stronger lilac hue
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#844AFF" }],
  },

  // Transit lines — electric purple-blue tone
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#c8a7ff" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#e7b9ff" }],
  },

  // Landscape — slightly darker lavender base
  {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [{ color: "#f0e9ff" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry.fill",
    stylers: [{ color: "#ece3ff" }],
  },

  // Hide minor clutter
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
];
