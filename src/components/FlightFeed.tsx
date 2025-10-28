import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Users, TrendingUp, AlertCircle } from "lucide-react";

const flights = [
  {
    flightNo: "SQ118",
    from: "Tokyo NRT",
    terminal: "T3",
    arrival: "14:25",
    aircraft: "Boeing 777-300ER",
    capacity: 340,
    expectedPax: 312,
    loadFactor: 92,
    status: "Landing",
  },
  {
    flightNo: "EK354",
    from: "Dubai DXB",
    terminal: "T1",
    arrival: "14:40",
    aircraft: "Airbus A380",
    capacity: 517,
    expectedPax: 495,
    loadFactor: 96,
    status: "Inbound",
  },
  {
    flightNo: "QF52",
    from: "Sydney SYD",
    terminal: "T1",
    arrival: "14:55",
    aircraft: "Airbus A380",
    capacity: 484,
    expectedPax: 458,
    loadFactor: 95,
    status: "Inbound",
  },
  {
    flightNo: "BA12",
    from: "London LHR",
    terminal: "T1",
    arrival: "15:10",
    aircraft: "Boeing 787-9",
    capacity: 216,
    expectedPax: 172,
    loadFactor: 80,
    status: "Scheduled",
  },
  {
    flightNo: "CX716",
    from: "Hong Kong HKG",
    terminal: "T1",
    arrival: "15:30",
    aircraft: "Airbus A350-900",
    capacity: 280,
    expectedPax: 238,
    loadFactor: 85,
    status: "Scheduled",
  },
];

const FlightFeed = () => {
  return (
    <Card className="glass-card p-4 sm:p-6 border-2 border-info/20 glow-secondary">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 rounded-lg bg-info/20">
          <Plane className="w-5 h-5 text-info" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Live Flight Feed</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Changi Airport Arrivals</p>
        </div>
      </div>

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
};

export default FlightFeed;
