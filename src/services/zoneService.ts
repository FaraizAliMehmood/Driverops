import axios from "axios";

// Configure your API base URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface ZoneData {
  zone_name: string;
  is_active: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const zoneService = {
  // Create a new zone
  createZone: async (data: ZoneData) => {
    const response = await axios.post(`${API_BASE_URL}/api/zones`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  // Get all zones
  getAllZones: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/zones`);
    return response.data;
  },

  // Get zone by ID
  getZoneById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/zones/${id}`);
    return response.data;
  },

  // Update zone by ID
  updateZone: async (id: string, data: Partial<ZoneData>) => {
    const response = await axios.put(`${API_BASE_URL}/api/zones/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  // Delete zone by ID
  deleteZone: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/api/zones/${id}`);
    return response.data;
  },

  // Get active zones only
  getActiveZones: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/zones/active/list`);
    return response.data;
  },
};

