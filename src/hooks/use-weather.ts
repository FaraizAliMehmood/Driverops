import { useState, useEffect, useCallback } from "react";

interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=1.3644&longitude=103.9915&current_weather=true"
      );
      
      if (!res.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await res.json();
      setWeather(data.current_weather);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load weather');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 1800000); // every 30 min
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return { weather, loading, error, refresh: fetchWeather };
};

