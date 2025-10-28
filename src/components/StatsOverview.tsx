import { TrendingUp, DollarSign, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    label: "Today's Earnings",
    value: "$187.50",
    change: "+12.5%",
    icon: DollarSign,
    gradient: "from-success to-success/70",
  },
  {
    label: "Active Hours",
    value: "5.5h",
    change: "2h remaining",
    icon: Clock,
    gradient: "from-info to-info/70",
  },
  {
    label: "Trips Completed",
    value: "18",
    change: "+3 this hour",
    icon: MapPin,
    gradient: "from-secondary to-secondary/70",
  },
  {
    label: "Avg. Fare",
    value: "$10.42",
    change: "+8.2%",
    icon: TrendingUp,
    gradient: "from-accent to-accent/70",
  },
];

const StatsOverview = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card p-4 sm:p-6 border-2 border-border/50 hover:border-primary/30 transition-all">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-background" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-success">{stat.change}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
