import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

export function ProfitLossChart({ transactions }) {
    const { isDarkMode } = useTheme();

    const textColor = isDarkMode ? "#E0E0E0" : "#333333";
    const gridColor = isDarkMode ? "#444444" : "#CCCCCC";

    const pnlTimeData = useMemo(() => {
        const monthMap = {};
        transactions.forEach((t) => {
            const date = new Date(t.date);
            if (isNaN(date.getTime())) return;

            const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
            // Handle amount parsing safely
            const amount = Number(t.amount) || 0;
            const tax = Number(t.tax) || 0;
            const netAmount = amount - tax;

            if (!monthMap[monthYear]) {
                monthMap[monthYear] = { income: 0, expense: 0 };
            }

            if (t.type === "income") {
                monthMap[monthYear].income += netAmount;
            } else if (t.type === "expense") {
                monthMap[monthYear].expense += Math.abs(netAmount);
            }
        });

        return Object.keys(monthMap)
            .map((monthYear) => ({
                monthYear,
                income: monthMap[monthYear].income,
                expense: monthMap[monthYear].expense,
            }))
            .sort((a, b) => {
                const [monthA, yearA] = a.monthYear.split(' ');
                const [monthB, yearB] = b.monthYear.split(' ');
                const dateA = new Date(`${monthA} 1, ${yearA}`);
                const dateB = new Date(`${monthB} 1, ${yearB}`);
                return dateA - dateB;
            });
    }, [transactions]);

    return (
        <Card className="glass-card border-border/50 shadow-md">
            <CardHeader>
                <CardTitle>Profit & Loss Over Time</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pnlTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.3} />
                            <XAxis
                                dataKey="monthYear"
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
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                                    borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                                    color: textColor,
                                    borderRadius: "0.5rem"
                                }}
                                formatter={(value, name) => [`₹${value.toFixed(2)}`, name === "Income" ? "Income" : "Expense"]}
                                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Bar dataKey="income" name="Income" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="expense" name="Expense" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
