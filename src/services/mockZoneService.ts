/**
 * Mock Zone Service
 * Use this for testing the Zone Management UI without a backend API
 * 
 * To use this mock service, update the import in ZoneManagement.tsx:
 * import { zoneService } from "@/services/mockZoneService";
 */

interface ZoneData {
  zone_name: string;
  is_active: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Zone extends ZoneData {
  _id: string;
  created_at: string;
  updated_at: string;
}

// Mock database
let mockZones: Zone[] = [
  {
    _id: "6541abc123def456789",
    zone_name: "Marina Bay",
    is_active: true,
    coordinates: {
      lat: 1.28,
      lng: 103.86,
    },
    created_at: "2025-10-27T10:00:00.000Z",
    updated_at: "2025-10-27T10:00:00.000Z",
  },
  {
    _id: "6541abc123def456790",
    zone_name: "Orchard Road",
    is_active: true,
    coordinates: {
      lat: 1.304,
      lng: 103.832,
    },
    created_at: "2025-10-27T11:00:00.000Z",
    updated_at: "2025-10-27T11:00:00.000Z",
  },
  {
    _id: "6541abc123def456791",
    zone_name: "Sentosa",
    is_active: false,
    coordinates: {
      lat: 1.249,
      lng: 103.83,
    },
    created_at: "2025-10-27T12:00:00.000Z",
    updated_at: "2025-10-27T12:00:00.000Z",
  },
  {
    _id: "6541abc123def456792",
    zone_name: "Changi Airport",
    is_active: true,
    coordinates: {
      lat: 1.364,
      lng: 103.991,
    },
    created_at: "2025-10-27T13:00:00.000Z",
    updated_at: "2025-10-27T13:00:00.000Z",
  },
];

// Helper to generate IDs
const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Simulate network delay
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const zoneService = {
  // Create a new zone
  createZone: async (data: ZoneData) => {
    await delay();
    
    const newZone: Zone = {
      _id: generateId(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockZones.push(newZone);

    return {
      message: "Zone created successfully",
      data: newZone,
    };
  },

  // Get all zones
  getAllZones: async () => {
    await delay();

    return {
      message: "Zones retrieved successfully",
      count: mockZones.length,
      data: mockZones,
    };
  },

  // Get zone by ID
  getZoneById: async (id: string) => {
    await delay();

    const zone = mockZones.find((z) => z._id === id);

    if (!zone) {
      throw new Error("Zone not found");
    }

    return {
      message: "Zone retrieved successfully",
      data: zone,
    };
  },

  // Update zone by ID
  updateZone: async (id: string, data: Partial<ZoneData>) => {
    await delay();

    const zoneIndex = mockZones.findIndex((z) => z._id === id);

    if (zoneIndex === -1) {
      throw new Error("Zone not found");
    }

    mockZones[zoneIndex] = {
      ...mockZones[zoneIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };

    return {
      message: "Zone updated successfully",
      data: mockZones[zoneIndex],
    };
  },

  // Delete zone by ID
  deleteZone: async (id: string) => {
    await delay();

    const zoneIndex = mockZones.findIndex((z) => z._id === id);

    if (zoneIndex === -1) {
      throw new Error("Zone not found");
    }

    const deletedZone = mockZones.splice(zoneIndex, 1)[0];

    return {
      message: "Zone deleted successfully",
      data: deletedZone,
    };
  },

  // Get active zones only
  getActiveZones: async () => {
    await delay();

    const activeZones = mockZones.filter((z) => z.is_active);

    return {
      message: "Active zones retrieved successfully",
      count: activeZones.length,
      data: activeZones,
    };
  },
};

