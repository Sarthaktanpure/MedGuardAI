import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

interface ChartDataPoint {
  [key: string]: string | number;
}

interface ChartWrapperProps {
  data: ChartDataPoint[];
  categories: string[];
  index: string;
  colors?: string[];
  height?: number;
}

export function TrendAreaChart({
  data,
  categories,
  index,
  colors = ["#3b82f6", "#10b981"],
  height = 300,
}: ChartWrapperProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {colors.map((color, idx) => (
              <linearGradient key={idx} id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis
            dataKey={index}
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <RechartsTooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
              color: "#f8fafc",
            }}
            itemStyle={{ color: "#f8fafc" }}
          />
          <Legend iconType="circle" />
          {categories.map((category, idx) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[idx % colors.length]}
              fill={`url(#gradient-${idx})`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompareBarChart({
  data,
  categories,
  index,
  colors = ["#3b82f6", "#ef4444"],
  height = 300,
}: ChartWrapperProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis
            dataKey={index}
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <RechartsTooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "12px",
              color: "#f8fafc",
            }}
            itemStyle={{ color: "#f8fafc" }}
          />
          <Legend iconType="circle" />
          {categories.map((category, idx) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[idx % colors.length]}
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendLineChart({
  data,
  categories,
  index,
  colors = ["#0ea5e9", "#f59e0b"],
  height = 300,
}: ChartWrapperProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis
            dataKey={index}
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <RechartsTooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "12px",
              color: "#f8fafc",
            }}
            itemStyle={{ color: "#f8fafc" }}
          />
          <Legend iconType="circle" />
          {categories.map((category, idx) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[idx % colors.length]}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 1 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
