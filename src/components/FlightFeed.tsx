import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Users, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import axios from "axios";

interface Flight {
  flightNo: string;
  from: string;
  terminal: string;
  arrival: string;
  aircraft: string;
  capacity: number;
  expectedPax: number;
  loadFactor: number;
  status: string;
  altitude: string;
  velocity: string;
}

interface ApiFlightData {
  callsign: string;
  icao24: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  altitude: string;
  velocity: string;
  on_ground: boolean;
}

// Helper function to determine flight status based on altitude and ground status
const getFlightStatus = (altitude: string, onGround: boolean): string => {
  if (onGround) return "Landed";
  
  const altitudeNum = parseInt(altitude);
  if (altitudeNum < 1000) return "Landing";
  if (altitudeNum < 3000) return "Approaching";
  return "Inbound";
};

// Helper function to estimate terminal based on airline code
const getTerminal = (callsign: string): string => {
  const airlineCode = callsign.substring(0, 3).toUpperCase();
  
  // Singapore Airlines, SilkAir typically use T3
  if (airlineCode.startsWith('SIA') || airlineCode.startsWith('SQ')) return "T3";
  
  // Budget carriers often use T4
  if (airlineCode.startsWith('TR') || airlineCode.startsWith('FY')) return "T4";
  
  // Most international carriers use T1
  return "T1";
};

// Helper function to estimate aircraft type and capacity based on airline
const getAircraftInfo = (callsign: string): { aircraft: string; capacity: number } => {
  const airlineCode = callsign.substring(0, 3).toUpperCase();
  
  // Common aircraft types by airline
  const aircraftTypes = [
    { aircraft: "Boeing 777-300ER", capacity: 340 },
    { aircraft: "Airbus A380", capacity: 517 },
    { aircraft: "Airbus A350-900", capacity: 280 },
    { aircraft: "Boeing 787-9", capacity: 246 },
    { aircraft: "Airbus A330-300", capacity: 290 },
    { aircraft: "Boeing 737-800", capacity: 189 },
  ];
  
  // Return a random aircraft type (in production, this would come from aircraft database)
  return aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
};

// Helper function to calculate ETA
const calculateETA = (altitude: string, velocity: string): string => {
  const altitudeNum = parseInt(altitude);
  const velocityNum = parseInt(velocity);
  
  // Simple estimation based on altitude (lower altitude = closer)
  if (altitudeNum < 1000) return "5 min";
  if (altitudeNum < 3000) return "15 min";
  if (altitudeNum < 5000) return "25 min";
  return "35 min";
};

const getChangiArrivals = async (): Promise<ApiFlightData[]> => {
  const url =
    "https://opensky-network.org/api/states/all?lamin=1.0&lomin=103.5&lamax=1.6&lomax=104.2";

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    console.log(
      `Fetched ${
        response.data.states ? response.data.states.length : 0
      } current flights in Singapore airspace`
    );

    if (!response.data.states) {
      return [];
    }

    return response.data.states.map((state: any) => ({
      callsign: state[1] ? state[1].trim() : "N/A",
      icao24: state[0],
      origin_country: state[2],
      longitude: state[5],
      latitude: state[6],
      altitude: state[7] ? `${Math.round(state[7])} m` : "N/A",
      velocity: state[9] ? `${Math.round(state[9])} m/s` : "N/A",
      on_ground: state[8],
    }));
  } catch (error: any) {
    if (error.response) {
      console.error(
        "Error fetching OpenSky data:",
        error.response.status,
        error.response.statusText
      );
      console.error("Response data:", error.response.data);
    } else {
      console.error("Error fetching OpenSky data:", error.message);
    }
    return [];
  }
};

export type FlightFeedHandle = {
  refresh: () => void;
};

const FlightFeed = forwardRef<FlightFeedHandle>((_, ref) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data: ApiFlightData[] = await getChangiArrivals();
      
      // Transform API data to match our component's expected format
      const transformedFlights: Flight[] = data.map((apiFlight) => {
        const aircraftInfo = getAircraftInfo(apiFlight.callsign);
        const loadFactor = 75 + Math.floor(Math.random() * 20); // 75-95%
        const expectedPax = Math.floor((aircraftInfo.capacity * loadFactor) / 100);
        
        return {
          flightNo: apiFlight.callsign.trim() || "Unknown",
          from: apiFlight.origin_country || "Unknown",
          terminal: getTerminal(apiFlight.callsign),
          arrival: calculateETA(apiFlight.altitude, apiFlight.velocity),
          aircraft: aircraftInfo.aircraft,
          capacity: aircraftInfo.capacity,
          expectedPax: expectedPax,
          loadFactor: loadFactor,
          status: getFlightStatus(apiFlight.altitude, apiFlight.on_ground),
          altitude: apiFlight.altitude,
          velocity: apiFlight.velocity,
        };
      });
      
      // Sort by status priority (Landing > Approaching > Inbound > Landed)
      const statusPriority: { [key: string]: number } = {
        "Landing": 0,
        "Approaching": 1,
        "Inbound": 2,
        "Landed": 3
      };
      
      transformedFlights.sort((a, b) => 
        (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99)
      );
      
      setFlights(transformedFlights);
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError(err instanceof Error ? err.message : 'Failed to load flight data');
    } finally {
      setLoading(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({ refresh: fetchFlights }), [fetchFlights]);

  useEffect(() => {
    fetchFlights();
    
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchFlights, 30000);
    
    return () => clearInterval(interval);
  }, [fetchFlights]);

  return (
    <Card className="glass-card p-4 sm:p-6 border-2 border-info/20 glow-secondary">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 rounded-lg bg-info/20">
          <Plane className="w-5 h-5 text-info" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Live Flight Feed</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Changi Airport Arrivals</p>
        </div>
        {loading && (
          <Loader2 className="w-5 h-5 text-info animate-spin" />
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border-2 border-destructive/30 text-center">
          <p className="text-sm text-destructive font-medium">{error}</p>
          <button 
            onClick={fetchFlights}
            className="mt-2 text-xs text-info hover:underline"
          >
            Try Again
          </button>
        </div>
      )}

      {!error && flights.length === 0 && !loading && (
        <div className="p-8 text-center text-muted-foreground">
          <Plane className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No flights currently tracked</p>
        </div>
      )}

      <div className="space-y-3">
        {flights.map((flight, index) => (
          <div
            key={index}
            className="p-3 sm:p-4 rounded-xl bg-card/80 border border-border/50 hover:border-info/40 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="text-base sm:text-lg font-bold text-info">{flight.flightNo}</div>
                <Badge variant="outline" className="border-info/40 text-info text-xs">
                  {flight.terminal}
                </Badge>
                <Badge 
                  variant={flight.status === "Landing" ? "default" : "secondary"}
                  className={`text-xs ${flight.status === "Landing" ? "bg-success" : ""}`}
                >
                  {flight.status}
                </Badge>
              </div>
              <div className="text-right ml-2">
                <div className="text-base sm:text-lg font-bold text-foreground">{flight.arrival}</div>
                <div className="text-xs text-muted-foreground">ETA</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="text-muted-foreground truncate">From: <span className="text-foreground">{flight.from}</span></div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground ml-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-foreground font-medium">{flight.expectedPax}</span>
                <span className="text-xs">/ {flight.capacity}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30 gap-2">
              <div className="text-xs text-muted-foreground truncate">{flight.aircraft}</div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                  flight.loadFactor >= 90 
                    ? 'bg-success/20 text-success' 
                    : flight.loadFactor >= 75 
                    ? 'bg-warning/20 text-warning'
                    : 'bg-info/20 text-info'
                }`}>
                  {flight.loadFactor >= 90 && <TrendingUp className="w-3 h-3" />}
                  {flight.loadFactor < 90 && flight.loadFactor >= 75 && <AlertCircle className="w-3 h-3" />}
                  <span className="text-xs font-bold">{flight.loadFactor}% Load</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});

FlightFeed.displayName = "FlightFeed";

export default FlightFeed;
