import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import FlightFeed from "@/components/FlightFeed";
import ZoneRecommendation from "@/components/ZoneRecommendation";
import EarningsTracker from "@/components/EarningsTracker";
import WeatherAlert from "@/components/WeatherAlert";
import StatsOverview from "@/components/StatsOverview";
import axios from "axios"

const Index = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Auto-refresh every 5 minutes (300000 ms)
  useEffect(() => {
    historicalData();
    const autoRefreshInterval = setInterval(() => {
      handleRefresh();
    }, 300000); // 5 minutes

    return () => clearInterval(autoRefreshInterval);
  }, []);

  const historicalData = () => {
    // Replace with your OpenSky Network credentials
const username = "ibrahimsoft004";
const password = "Ibrahim786";

// // Airport and time range
// const airport = "SIN"; // ICAO code
// const endTime = Math.floor(Date.now() / 1000); // Current UTC timestamp in seconds
// const beginTime = endTime - 24 * 60 * 60; // 24 hours ago

// // Encode credentials for Basic Auth
// const authHeader = "Basic " + btoa(`${username}:${password}`);

// // API endpoint
// const url = `https://opensky-network.org/api/flights/arrival?airport=${airport}&begin=${beginTime}&end=${endTime}`;

// // Fetch historical flights
// fetch(url, {
// method: "GET",
// headers: {
// "Authorization": authHeader
// }
// })
// .then(response => {
// if (!response.ok) {
// throw new Error(`Error ${response.status}: ${response.statusText}`);
// }
// return response.json();
// })
// .then(data => {
// console.log(`Total flights fetched: ${data.length}`);
// console.log(data); // Array of flight objects
// })
// .catch(error => {
// console.error("Failed to fetch historical flights:", error);
// });


// API endpoint for live flights
const url = "https://opensky-network.org/api/states/all";

// Fetch live flights
fetch(url, {
method: "GET",
headers: username && password ? {
"Authorization": "Basic " + btoa(`${username}:${password}`)
} : {}
})
.then(response => {
if (!response.ok) {
throw new Error(`Error ${response.status}: ${response.statusText}`);
}
return response.json();
})
.then(data => {
console.log("Live flights:", data.states.length);
console.log(data.states); // Each flight is an array of live info
})
.catch(error => {
console.error("Failed to fetch live flights:", error);
});
  }

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
