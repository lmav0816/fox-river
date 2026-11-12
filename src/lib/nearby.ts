// Coordinates from the US Census geocoder and OpenStreetMap, November 2026.
// Drive times are rounded up from OpenStreetMap routing and ignore traffic.
export type LatLng = [number, number];

export const parkLocation: LatLng = [42.4789, -88.1775];

export type Attraction = {
  id: string;
  name: string;
  distance: string;
  description: string;
  /** Pins shown on the map for this attraction. */
  pins: { name: string; position: LatLng; note?: string }[];
};

export const attractions: Attraction[] = [
  {
    id: "chain",
    name: "The Chain O'Lakes",
    distance: "Right from our docks",
    description:
      "Our stretch of the Fox River flows straight into the Chain O'Lakes, so the best lake bars are a boat ride away: Blarney Island, the Sandbar, Sunset Grill, and many more.",
    pins: [
      {
        name: "Blarney Island",
        position: [42.444, -88.1651],
        note: "Lake bar, by boat",
      },
      {
        name: "Sunset Grill on Bluff Lake",
        position: [42.448, -88.1261],
        note: "Lake bar, by boat or car",
      },
    ],
  },
  {
    id: "state-park",
    name: "Chain O'Lakes State Park",
    distance: "About 15 minutes by car",
    description:
      "Hiking trails, fishing, and picnic spots in a state park where the Fox River meets three natural lakes.",
    pins: [{ name: "Chain O'Lakes State Park", position: [42.4585, -88.1768] }],
  },
  {
    id: "six-flags",
    name: "Six Flags Great America",
    distance: "About 30 minutes by car",
    description:
      "Roller coasters, rides, and the Hurricane Harbor water park in Gurnee.",
    pins: [{ name: "Six Flags Great America", position: [42.3679, -87.9337] }],
  },
  {
    id: "lake-geneva",
    name: "Lake Geneva",
    distance: "About 30 minutes by car",
    description:
      "Lakefront shops, restaurants, and boat tours just over the Wisconsin line.",
    pins: [{ name: "Lake Geneva, Wisconsin", position: [42.5918, -88.4345] }],
  },
  {
    id: "chicago",
    name: "Chicago",
    distance: "About 90 minutes by car",
    description:
      "Museums, the lakefront, and big-city dining, close enough for a day trip.",
    pins: [{ name: "Chicago", position: [41.8826, -87.6226] }],
  },
];
