import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export function MonthlyNetBalanceChart({ data }) {
  const formatMonth = (monthString) => {
    const [year, monthNum] = monthString.split('-').map(Number);
    const date = new Date(year, monthNum - 1);
    return date.toLocaleString('default', { month: 'short', year: '2-digit' });
  };

  return (
    <Card className="glass-card border-border/50 shadow-md">
      <CardHeader>
        <CardTitle>Monthly Net Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
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
              <Legend />
              <Line
                type="monotone"
                dataKey="netBalance"
                stroke="#6366f1"
                name="Net Balance"
                strokeWidth={3}
                dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#6366f1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}