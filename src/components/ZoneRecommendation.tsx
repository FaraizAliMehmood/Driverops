import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Clock, Moon, Train } from "lucide-react";
import { useState, useEffect } from "react";

interface Zone {
  name: string;
  priority: "High" | "Medium" | "Low";
  reason: string;
  eta: string;
  multiplier: string;
  color: "success" | "info" | "warning";
  icon?: "moon" | "train";
  timeRestriction?: { start: number; end: number };
}

const getTimeBasedZones = (currentHour: number): Zone[] => {
  const baseZones: Zone[] = [
    {
      name: "Changi Airport",
      priority: "High",
      reason: "5 wide-body arrivals in 45min",
      eta: "15 min",
      multiplier: "1.8x",
      color: "success",
    },
    {
      name: "Marina Bay / CBD",
      priority: "Medium",
      reason: "Lunch hour demand peak",
      eta: "25 min",
      multiplier: "1.3x",
      color: "info",
    },
    {
      name: "Orchard Road",
      priority: "Low",
      reason: "Moderate shopping traffic",
      eta: "20 min",
      multiplier: "1.1x",
      color: "warning",
    },
  ];

  // Add Mandai Zoo / Night Safari after 6 PM (18:00)
  if (currentHour >= 18 || currentHour < 6) {
    baseZones.push({
      name: "Mandai Zoo / Night Safari",
      priority: "Medium",
      reason: "Night Safari closing time - High exit demand",
      eta: "30 min",
      multiplier: "1.5x",
      color: "info",
      icon: "moon",
      timeRestriction: { start: 18, end: 24 },
    });
  }

  // Add Woodlands Train Station during peak commute hours (7-9 AM, 5-8 PM)
  if ((currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 20)) {
    baseZones.push({
      name: "Woodlands Train Station",
      priority: "High",
      reason: "Peak hour - Commuters from Malaysia",
      eta: "35 min",
      multiplier: "1.6x",
      color: "success",
      icon: "train",
      timeRestriction: { start: 7, end: 20 },
    });
  }

  // Sort by priority
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  return baseZones.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};

const ZoneRecommendation = () => {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [zones, setZones] = useState<Zone[]>(getTimeBasedZones(currentHour));

  useEffect(() => {
    // Update zones every minute to check for time-based changes
    const interval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== currentHour) {
        setCurrentHour(newHour);
        setZones(getTimeBasedZones(newHour));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentHour]);

  return (
    <Card className="glass-card p-4 sm:p-6 border-2 border-success/20 glow-primary">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 rounded-lg bg-success/20">
          <MapPin className="w-5 h-5 text-success" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Zone Recommendations</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Smart routing based on live data</p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {zones.map((zone, index) => (
          <div
            key={index}
            className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
              index === 0
                ? "bg-success/10 border-success/30 shadow-lg shadow-success/20"
                : "bg-card/80 border-border/50 hover:border-success/30"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {zone.icon === "moon" && <Moon className="w-4 h-4 text-info" />}
                  {zone.icon === "train" && <Train className="w-4 h-4 text-success" />}
                  <h3 className="text-base sm:text-lg font-bold text-foreground">{zone.name}</h3>
                  <Badge 
                    variant={zone.priority === "High" ? "default" : "outline"}
                    className={`text-xs ${zone.priority === "High" ? "bg-success" : `border-${zone.color}/40 text-${zone.color}`}`}
                  >
                    {zone.priority}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{zone.reason}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 border-t border-border/30 gap-2">
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-foreground">{zone.eta}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-success font-bold">{zone.multiplier}</span>
                </div>
              </div>
              {zone.priority === "High" && (
                <Badge className="bg-success text-success-foreground font-bold text-xs flex-shrink-0">
                  BEST CHOICE
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ZoneRecommendation;
