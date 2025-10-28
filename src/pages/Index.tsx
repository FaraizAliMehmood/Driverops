import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import FlightFeed from "@/components/FlightFeed";
import ZoneRecommendation from "@/components/ZoneRecommendation";
import EarningsTracker from "@/components/EarningsTracker";
import WeatherAlert from "@/components/WeatherAlert";
import StatsOverview from "@/components/StatsOverview";

const Index = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Auto-refresh every 5 minutes (300000 ms)
  useEffect(() => {
    const autoRefreshInterval = setInterval(() => {
      handleRefresh();
    }, 300000); // 5 minutes

    return () => clearInterval(autoRefreshInterval);
  }, []);

  const handleRefresh = () => {
    setLastUpdated(new Date());
    setRefreshKey(prev => prev + 1);
    // In a real implementation, this would trigger API calls to fetch fresh data
    console.log('Dashboard refreshed at:', new Date().toLocaleTimeString());
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <DashboardHeader onRefresh={handleRefresh} lastUpdated={lastUpdated} />
        
        <StatsOverview key={`stats-${refreshKey}`} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ZoneRecommendation key={`zones-${refreshKey}`} />
          <WeatherAlert key={`weather-${refreshKey}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <FlightFeed key={`flights-${refreshKey}`} />
          </div>
          <div>
            <EarningsTracker key={`earnings-${refreshKey}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
