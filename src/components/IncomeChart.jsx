import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const categoryColors = {
  Trading: '#333333',     // Dark Gray
  Freelancing: '#555555', // Medium Dark Gray
  Gigs: '#777777',        // Medium Gray
  Salary: '#999999',      // Light Gray
  Other: '#bbbbbb'        // Very Light Gray
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-xl border border-border/50 shadow-xl">
        <p className="font-semibold text-sm mb-1">{label}</p>
        <p className="text-primary font-bold">
          ₹{Number(payload[0].value).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export function IncomeChart({ entries }) {
  const categoryData = entries.reduce((acc, entry) => {
    if (!acc[entry.category]) acc[entry.category] = 0;
    acc[entry.category] += Number(entry.amount) || 0;
    return acc;
  }, {});

  const chartData = Object.entries(categoryData)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total); // Sort by value desc

  return (
    <Card className="glass-card border-border/50 shadow-md">
      <CardHeader>
        <CardTitle>Income by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
              <XAxis
                dataKey="name"
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
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.2)' }} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || categoryColors.Other} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}