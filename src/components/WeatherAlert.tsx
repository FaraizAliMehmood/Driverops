import { forwardRef, useImperativeHandle } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Wind, Droplets, TrendingUp, MapPin, Cloud, CloudDrizzle, Sun, Loader2 } from "lucide-react";
import { useWeather } from "@/hooks/use-weather";

// WMO Weather interpretation codes
const getWeatherDescription = (code: number): { condition: string; severity: 'clear' | 'light' | 'moderate' | 'heavy' } => {
  if (code === 0) return { condition: "Clear Sky", severity: 'clear' };
  if (code <= 3) return { condition: "Partly Cloudy", severity: 'light' };
  if (code <= 48) return { condition: "Foggy", severity: 'light' };
  if (code <= 57) return { condition: "Drizzle", severity: 'light' };
  if (code <= 67) return { condition: "Light Rain", severity: 'light' };
  if (code <= 77) return { condition: "Rain", severity: 'moderate' };
  if (code <= 82) return { condition: "Heavy Rain", severity: 'heavy' };
  if (code <= 86) return { condition: "Rain Showers", severity: 'moderate' };
  if (code <= 99) return { condition: "Thunderstorm", severity: 'heavy' };
  return { condition: "Unknown", severity: 'light' };
};

const getWeatherIcon = (code: number) => {
  if (code === 0) return Sun;
  if (code <= 3) return Cloud;
  if (code <= 67) return CloudDrizzle;
  return CloudRain;
};

const getSurgeFromWeather = (severity: string): number => {
  switch (severity) {
    case 'heavy': return 40;
    case 'moderate': return 20;
    case 'light': return 8;
    default: return 5;
  }
};

const getWindDescription = (speed: number): string => {
  if (speed < 5) return "Light";
  if (speed < 20) return "Moderate";
  if (speed < 40) return "Strong";
  return "Very Strong";
};

export type WeatherAlertHandle = {
  refresh: () => void;
};

const WeatherAlert = forwardRef<WeatherAlertHandle>((_, ref) => {
  const { weather, loading, error, refresh } = useWeather();

  useImperativeHandle(ref, () => ({ refresh }), [refresh]);
  // Get weather info
  const weatherInfo = weather ? getWeatherDescription(weather.weathercode) : null;
  const baseSurge = weatherInfo ? getSurgeFromWeather(weatherInfo.severity) : 8;
  const WeatherIconComponent = weather ? getWeatherIcon(weather.weathercode) : CloudRain;
  
  // Calculate regional surge based on actual weather
  const regionalSurge = [
    { region: "Changi / East", surge: baseSurge, condition: weatherInfo?.condition || "Loading..." },
    { region: "Central / CBD", surge: Math.max(5, baseSurge - 10), condition: weatherInfo?.condition || "Loading..." },
    { region: "North (Woodlands)", surge: Math.max(5, baseSurge - 15), condition: weatherInfo?.condition || "Loading..." },
  ];

  const windSpeed = weather?.windspeed || 0;
  const windDesc = getWindDescription(windSpeed);
  const temperature = weather?.temperature || 0;
  
  // Estimate humidity based on temperature and weather (Singapore is typically 70-90%)
  const estimatedHumidity = temperature > 28 ? 85 : 75;

  return (
    <Card className="glass-card p-4 sm:p-6 border-2 border-info/20">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 rounded-lg bg-info/20">
          <CloudRain className="w-5 h-5 text-info" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Weather Impact</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Live weather & surge prediction</p>
        </div>
        {loading && <Loader2 className="w-5 h-5 text-info animate-spin" />}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border-2 border-destructive/30 text-center">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      {!error && (
        <div className="space-y-4 sm:space-y-6">
          <div className={`p-3 sm:p-4 rounded-xl border-2 ${
            weatherInfo?.severity === 'heavy' 
              ? 'bg-warning/10 border-warning/30'
              : weatherInfo?.severity === 'moderate'
              ? 'bg-info/10 border-info/30'
              : 'bg-success/10 border-success/30'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <WeatherIconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  weatherInfo?.severity === 'heavy' ? 'text-warning' : 'text-info'
                }`} />
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {weatherInfo?.condition || "Loading..."}
                </span>
              </div>
              <Badge className={`text-xs ${
                weatherInfo?.severity === 'heavy' 
                  ? 'bg-warning text-warning-foreground'
                  : weatherInfo?.severity === 'moderate'
                  ? 'bg-info text-info-foreground'
                  : 'bg-success text-success-foreground'
              }`}>
                {weatherInfo?.severity === 'heavy' ? 'Alert' : 
                 weatherInfo?.severity === 'moderate' ? 'Watch' : 'Normal'}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Current conditions near Changi Airport • {temperature.toFixed(1)}°C
            </p>
            
            <div className="space-y-2">
              {regionalSurge.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-2 sm:p-3 rounded-lg ${
                    index === 0 && item.surge >= 20
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
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {windSpeed.toFixed(1)} km/h
              </div>
              <div className="text-xs text-muted-foreground mt-1">{windDesc}</div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-card/80 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-info" />
                <span className="text-xs text-muted-foreground">Humidity</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">{estimatedHumidity}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                {estimatedHumidity > 80 ? 'High' : 'Moderate'}
              </div>
            </div>
          </div>

          {weatherInfo?.severity === 'heavy' && (
            <div className="p-3 sm:p-4 rounded-xl bg-warning/10 border border-warning/30">
              <div className="text-xs sm:text-sm font-medium text-warning mb-2">⚠️ Weather Alert</div>
              <p className="text-xs text-muted-foreground">
                Heavy weather conditions detected. Position near Changi Airport - high demand expected!
              </p>
            </div>
          )}

          {(!weatherInfo || weatherInfo.severity !== 'heavy') && (
            <div className="p-3 sm:p-4 rounded-xl bg-success/10 border border-success/30">
              <div className="text-xs sm:text-sm font-medium text-success mb-2">💡 Pro Tip</div>
              <p className="text-xs text-muted-foreground">
                Monitor weather changes. Airport demand spikes 15-30 min before rain starts.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
});

WeatherAlert.displayName = "WeatherAlert";

export default WeatherAlert;
