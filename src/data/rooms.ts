// src/data/rooms.ts
export type Room = {
  id: string; // must match RoomCard ids
  type: string;
  name: string;
  image: string;
  price: number;
  badge?: string;
  meta: string;

  // rich details
  description: string;
  gallery: string[];
  features: string[];
  policies?: string[];
};

export const ROOMS: Room[] = [
  {
    id: "1",
    type: "Premium Suite",
    name: "Deluxe Ocean Suite",
    image: "/images/room1.jpg",
    price: 450,
    meta: "King Bed · 2 Guests · Ocean View",
    description:
      "A serene ocean-facing suite designed for quiet comfort, refined finishes, and a calming coastal ambiance.",
    gallery: ["/images/room1.jpg", "/images/room2.jpg", "/images/room3.jpg"],
    features: ["Ocean view", "King bed", "Rain shower", "Smart TV", "Fast Wi-Fi"],
    policies: ["Check-in: 3:00 PM", "Check-out: 12:00 NN", "No smoking"],
  },
  {
    id: "2",
    type: "Executive Suite",
    name: "Presidential Suite",
    image: "/images/room2.jpg",
    price: 850,
    badge: "MOST POPULAR",
    meta: "King Bed · 4 Guests · Panoramic View",
    description:
      "Our most prestigious suite—spacious, elegant, and built for unforgettable stays with panoramic views.",
    gallery: ["/images/room2.jpg", "/images/room1.jpg", "/images/room5.jpg"],
    features: [
      "Panoramic view",
      "King bed",
      "Separate lounge",
      "Premium amenities",
      "Fast Wi-Fi",
    ],
    policies: ["Check-in: 3:00 PM", "Check-out: 12:00 NN", "No smoking"],
  },
  {
    id: "3",
    type: "Signature Suite",
    name: "Garden Villa Suite",
    image: "/images/room3.jpg",
    price: 550,
    meta: "King Bed · 3 Guests · Garden View",
    description:
      "A peaceful villa-style suite with garden views—perfect for guests who want privacy and calm.",
    gallery: ["/images/room3.jpg", "/images/room4.jpg", "/images/room1.jpg"],
    features: ["Garden view", "King bed", "Private terrace", "Fast Wi-Fi"],
    policies: ["Check-in: 3:00 PM", "Check-out: 12:00 NN", "No smoking"],
  },
  {
    id: "4",
    type: "Luxury Suite",
    name: "Hillside Retreat Suite",
    image: "/images/room4.jpg",
    price: 600,
    meta: "Queen Bed · 2 Guests · Hillside View",
    description:
      "A quiet retreat above the resort—soft textures, warm lighting, and an elevated hillside view.",
    gallery: ["/images/room4.jpg", "/images/room3.jpg", "/images/room2.jpg"],
    features: ["Hillside view", "Queen bed", "Lounge area", "Fast Wi-Fi"],
    policies: ["Check-in: 3:00 PM", "Check-out: 12:00 NN", "No smoking"],
  },
  {
    id: "5",
    type: "Classic Suite",
    name: "Cityscape Suite",
    image: "/images/room5.jpg",
    price: 400,
    meta: "Queen Bed · 2 Guests · City View",
    description:
      "A modern city-facing suite with a clean, polished layout—ideal for business or quick luxury stays.",
    gallery: ["/images/room5.jpg", "/images/room2.jpg", "/images/room4.jpg"],
    features: ["City view", "Queen bed", "Work desk", "Smart TV", "Fast Wi-Fi"],
    policies: ["Check-in: 3:00 PM", "Check-out: 12:00 NN", "No smoking"],
  },
];
