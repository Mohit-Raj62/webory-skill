export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: "sale" | "rent";
  bedrooms: number;
  bathrooms: number;
  area: number; // in square feet
  images: string[];
  features: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Modern Luxury Villa",
    description:
      "Stunning modern villa with panoramic city views, featuring an infinity pool and smart home technology. This exceptional property offers the perfect blend of luxury and comfort.",
    price: 1250000,
    location: "Beverly Hills, CA",
    type: "sale",
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224",
    ],
    features: [
      "Infinity Pool",
      "Smart Home System",
      "Home Theater",
      "Wine Cellar",
      "Gourmet Kitchen",
      "3-Car Garage",
    ],
    agent: {
      name: "Sarah Johnson",
      phone: "(310) 555-0123",
      email: "sarah.j@realestate.com",
    },
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    title: "Downtown Luxury Apartment",
    description:
      "High-end apartment in the heart of downtown, offering spectacular views and premium amenities. Perfect for urban professionals seeking luxury living.",
    price: 3500,
    location: "Downtown Los Angeles, CA",
    type: "rent",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    ],
    features: [
      "Floor-to-Ceiling Windows",
      "Modern Kitchen",
      "Fitness Center",
      "Concierge Service",
      "Rooftop Lounge",
      "Secured Parking",
    ],
    agent: {
      name: "Michael Chen",
      phone: "(213) 555-0456",
      email: "michael.c@realestate.com",
    },
    createdAt: "2024-03-14",
  },
  {
    id: "3",
    title: "Beachfront Paradise",
    description:
      "Breathtaking beachfront property with direct access to pristine sandy beaches. Features an open concept design and stunning ocean views from every room.",
    price: 2750000,
    location: "Malibu, CA",
    type: "sale",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    ],
    features: [
      "Private Beach Access",
      "Ocean Views",
      "Outdoor Kitchen",
      "Swimming Pool",
      "Guest House",
      "Large Deck",
    ],
    agent: {
      name: "Emily Rodriguez",
      phone: "(424) 555-0789",
      email: "emily.r@realestate.com",
    },
    createdAt: "2024-03-13",
  },
  {
    id: "4",
    title: "Cozy Suburban Home",
    description:
      "Charming family home in a quiet suburban neighborhood. Recently renovated with modern amenities while maintaining its classic charm.",
    price: 750000,
    location: "Pasadena, CA",
    type: "sale",
    bedrooms: 3,
    bathrooms: 2,
    area: 2000,
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607",
    ],
    features: [
      "Renovated Kitchen",
      "Hardwood Floors",
      "Large Backyard",
      "Fireplace",
      "Attached Garage",
      "Garden",
    ],
    agent: {
      name: "David Thompson",
      phone: "(626) 555-0321",
      email: "david.t@realestate.com",
    },
    createdAt: "2024-03-12",
  },
  {
    id: "5",
    title: "Modern Studio Apartment",
    description:
      "Stylish studio apartment in a trendy neighborhood. Perfect for young professionals or students. Includes modern amenities and great community features.",
    price: 1800,
    location: "Santa Monica, CA",
    type: "rent",
    bedrooms: 0,
    bathrooms: 1,
    area: 550,
    images: [
      "https://images.unsplash.com/photo-1522156373667-4c7234bbd804",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
    ],
    features: [
      "Modern Appliances",
      "Built-in Storage",
      "Community Pool",
      "Gym Access",
      "Bike Storage",
      "Laundry Facility",
    ],
    agent: {
      name: "Lisa Park",
      phone: "(310) 555-9876",
      email: "lisa.p@realestate.com",
    },
    createdAt: "2024-03-11",
  },
];
