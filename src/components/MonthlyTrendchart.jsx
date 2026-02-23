import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-xl border border-border/50 shadow-xl">
        <p className="font-semibold text-sm mb-1">{label}</p>
        <p className="text-primary font-bold">
          Net P&L: ₹{Number(payload[0].value).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export function MonthlyTrendChart({ entries }) {
  const monthlyData = entries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    const amount = Number(entry.amount) || 0;
    const tax = Number(entry.tax) || 0;

    if (!acc[month]) acc[month] = 0;
    acc[month] += (amount - tax);
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([month, total]) => ({ month, total }));

  return (
    <Card className="glass-card border-border/50 shadow-md">
      <CardHeader>
        <CardTitle>Monthly Net P&L Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}