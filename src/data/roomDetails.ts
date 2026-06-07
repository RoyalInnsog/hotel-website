export interface RoomDetail {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  dimensions: string;
  bedSize: string;
  occupancy: string;
  highlight: string;
  description: string;
  features: string[];
  amenities: string[];
  gallerySpan: string;
}

export const ROOM_DETAILS: RoomDetail[] = [
  {
    id: 'executive-suite',
    title: 'Executive Suite',
    category: 'Signature Room',
    image: '/images/room1.jpg',
    alt: 'Executive suite at Royal Inn Hotel',
    dimensions: '320 sq ft',
    bedSize: 'King bed with premium linen',
    occupancy: '2 adults',
    highlight: 'Quiet upper-floor suite for restful overnight stays.',
    description:
      'A spacious room designed around calm arrivals, soft lighting, and a polished work-and-rest layout for travelers staying near New Bus Stand, Suratgarh, Rajasthan.',
    features: ['Separate lounge chair', 'Blackout curtains', 'Dedicated work desk', 'Wardrobe storage'],
    amenities: ['24/7 room service', 'High-speed Wi-Fi', 'Premium toiletries', 'Daily housekeeping'],
    gallerySpan: 'col-span-1 md:col-span-2 row-span-2',
  },
  {
    id: 'premium-room',
    title: 'Premium Room',
    category: 'Guest Room',
    image: '/images/room2.jpg',
    alt: 'Premium room at Royal Inn Hotel',
    dimensions: '260 sq ft',
    bedSize: 'Queen bed with cushioned headboard',
    occupancy: '2 adults',
    highlight: 'Refined comfort with an efficient, uncluttered layout.',
    description:
      'A polished premium room with a warm cream palette, ample bedside lighting, and the practical comforts expected during a seamless city stay.',
    features: ['Bedside controls', 'Compact writing surface', 'Full-length mirror', 'Luggage bench'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Room dining', 'Laundry support'],
    gallerySpan: 'col-span-1 row-span-1',
  },
  {
    id: 'reception-lounge',
    title: 'Reception Lounge',
    category: 'Arrival Space',
    image: '/images/hallway.jpg',
    alt: 'Reception lounge and hallway at Royal Inn Hotel',
    dimensions: 'Open guest circulation zone',
    bedSize: 'Concierge seating nearby',
    occupancy: 'Guest assistance desk',
    highlight: 'A composed welcome area for quick check-ins and local guidance.',
    description:
      'The arrival path is kept uncluttered, well-lit, and easy to navigate so guests can move from reception to room without friction.',
    features: ['Clear wayfinding', 'Front desk support', 'Secure entry flow', 'Luggage assistance'],
    amenities: ['24-hour reception', 'Local travel guidance', 'CCTV coverage', 'Cashless payments'],
    gallerySpan: 'col-span-1 row-span-1',
  },
  {
    id: 'exterior-arrival',
    title: 'Royal Inn Arrival',
    category: 'Hotel Exterior',
    image: '/images/exterior.jpg',
    alt: 'Royal Inn Hotel exterior near New Bus Stand, Suratgarh, Rajasthan',
    dimensions: 'Near New Bus Stand, Suratgarh, Rajasthan',
    bedSize: 'Upper-floor room access',
    occupancy: 'Guest parking and arrivals',
    highlight: 'Easy-to-find city location with a calm, secure arrival sequence.',
    description:
      'Royal Inn Hotel is positioned for convenient arrivals near New Bus Stand, Suratgarh, Rajasthan, with practical access for families and business travelers.',
    features: ['Near New Bus Stand, Suratgarh, Rajasthan', 'Secure parking support', 'Upper-floor rooms', 'Visible frontage'],
    amenities: ['Front desk assistance', 'UPI and card payments', 'Pet-friendly support', 'Local directions'],
    gallerySpan: 'col-span-1 md:col-span-2 row-span-1',
  },
];

export function getRoomDetail(id: string): RoomDetail {
  return ROOM_DETAILS.find((room) => room.id === id) ?? ROOM_DETAILS[0];
}
