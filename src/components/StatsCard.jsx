import { TrendingUp, TrendingDown } from "lucide-react";

export function StatsCard({ title, value, trend, icon: Icon, loading }) {
  const isPositive = trend >= 0;

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
      {/* Background decoration in grayscale */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-500 to-gray-700 opacity-10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-20" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tight">
              {loading ? (
                <div className="h-9 w-32 bg-secondary/50 rounded-lg animate-pulse" />
              ) : (
                typeof value === 'number' ? `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : value
              )}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-primary text-primary-foreground shadow-lg">
            {Icon ? <Icon className="h-6 w-6" /> : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            )}
          </div>
        </div>

        {trend !== undefined && (
          <div className="flex items-center gap-2 mt-4">
            <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${isPositive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {Math.abs(trend)}%
            </span>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}