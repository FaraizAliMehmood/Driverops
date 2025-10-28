import { Plane, RefreshCw, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  onRefresh?: () => void;
  lastUpdated?: Date;
}

const DashboardHeader = ({ onRefresh, lastUpdated }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-SG', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  }));
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-SG', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getLastUpdatedText = () => {
    if (!lastUpdated) return "Just now";
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <header className="glass-card rounded-2xl p-4 sm:p-6 border-2 border-primary/20 glow-primary">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 rounded-xl bg-gradient-primary">
            <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-background" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">DriverOps SG</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">Intelligent Driver Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          {/* <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/zones')}
            className="border-primary/40 hover:bg-primary/10"
          >
            <Map className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Zones</span>
          </Button> */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-success/40 hover:bg-success/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-foreground">{currentTime}</div>
            <div className="text-xs text-muted-foreground">Updated {getLastUpdatedText()}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse glow-primary"></div>
            <span className="text-sm font-medium text-success hidden sm:inline">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
