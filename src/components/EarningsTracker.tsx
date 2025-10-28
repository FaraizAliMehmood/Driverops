import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, Fuel, CreditCard } from "lucide-react";

const earnings = [
  { label: "Gross Earnings", value: "$187.50", icon: DollarSign, color: "text-success" },
  { label: "Fuel Cost", value: "-$32.00", icon: Fuel, color: "text-accent" },
  { label: "Platform Fee", value: "-$28.13", icon: CreditCard, color: "text-warning" },
  { label: "Net Profit", value: "$127.37", icon: TrendingUp, color: "text-success font-bold" },
];

const EarningsTracker = () => {
  return (
    <Card className="glass-card p-4 sm:p-6 border-2 border-success/20">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 rounded-lg bg-success/20">
          <DollarSign className="w-5 h-5 text-success" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Today's Earnings</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Live tracker</p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {earnings.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
              index === earnings.length - 1
                ? "bg-success/10 border-2 border-success/30"
                : "bg-card/50"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
              <span className="text-xs sm:text-sm text-muted-foreground">{item.label}</span>
            </div>
            <span className={`text-base sm:text-lg font-bold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/30">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">Hourly Average</span>
          <span className="text-foreground font-bold">$34.09/hr</span>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm mt-2">
          <span className="text-muted-foreground">Target Progress</span>
          <span className="text-success font-bold">73%</span>
        </div>
      </div>
    </Card>
  );
};

export default EarningsTracker;
