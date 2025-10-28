import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Wind, Droplets, TrendingUp, MapPin } from "lucide-react";

const regionalSurge = [
  { region: "Changi / East", surge: 40, condition: "Heavy Rain" },
  { region: "Central / CBD", surge: 12, condition: "Light Rain" },
  { region: "North (Woodlands)", surge: 8, condition: "Overcast" },
];

const WeatherAlert = () => {
  return (
    <Card className="glass-card p-4 sm:p-6 border-2 border-info/20">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 rounded-lg bg-info/20">
          <CloudRain className="w-5 h-5 text-info" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Weather Impact</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Rain surge prediction</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="p-3 sm:p-4 rounded-xl bg-warning/10 border-2 border-warning/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
              <span className="text-sm sm:text-base font-bold text-foreground">Heavy Rain Alert</span>
            </div>
            <Badge className="bg-warning text-warning-foreground text-xs">Active</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Heavy rain predicted in 45 minutes around Changi area
          </p>
          
          <div className="space-y-2">
            {regionalSurge.map((item, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-2 sm:p-3 rounded-lg ${
                  index === 0 
                    ? 'bg-success/20 border border-success/30' 
                    : 'bg-card/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-foreground">{item.region}</div>
                    <div className="text-xs text-muted-foreground">{item.condition}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-success font-bold text-sm">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">+{item.surge}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-xl bg-card/80 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-4 h-4 text-info" />
              <span className="text-xs text-muted-foreground">Wind Speed</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-foreground">12 km/h</div>
            <div className="text-xs text-muted-foreground mt-1">Moderate</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-card/80 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-info" />
              <span className="text-xs text-muted-foreground">Humidity</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-foreground">78%</div>
            <div className="text-xs text-muted-foreground mt-1">High</div>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-success/10 border border-success/30">
          <div className="text-xs sm:text-sm font-medium text-success mb-2">💡 Pro Tip</div>
          <p className="text-xs text-muted-foreground">
            Position near Changi before rain starts. Airport demand spikes during heavy rain.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WeatherAlert;
