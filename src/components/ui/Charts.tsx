"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SAGE = "#E5E5E5";
const SAGE_LIGHT = "#FFFFFF";

const tooltipStyle = {
  background: "rgba(18,18,22,0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#f5f5f3",
  fontSize: 13,
  padding: "8px 12px",
};

// Recharts renders the tooltip label and item rows with their own dark inline
// colours, which are invisible on the dark card. Force them light.
const tooltipLabelStyle = { color: "#f5f5f3", fontWeight: 600, marginBottom: 2 };
const tooltipItemStyle = { color: "#f5f5f3" };

export function ExamTrendChart({
  data,
}: {
  data: { label: string; score: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="sageFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SAGE} stopOpacity={0.45} />
            <stop offset="100%" stopColor={SAGE} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#7C7C85", fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: "#7C7C85", fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ stroke: "rgba(255,255,255,0.25)" }} />
        <Area
          type="monotone"
          dataKey="score"
          stroke={SAGE_LIGHT}
          strokeWidth={2.5}
          fill="url(#sageFill)"
          dot={{ fill: SAGE, r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: SAGE_LIGHT }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SubjectBarChart({
  data,
}: {
  data: { subject: string; current: number; baseline: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 70)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: "#7C7C85", fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="subject" width={120} tick={{ fill: "#B7B7BE", fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="baseline" name="Starting" radius={[0, 4, 4, 0]} fill="rgba(255,255,255,0.12)" barSize={10} isAnimationActive={false} />
        <Bar dataKey="current" name="Current" radius={[0, 4, 4, 0]} barSize={10} isAnimationActive={false}>
          {data.map((_, i) => (
            <Cell key={i} fill={SAGE} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
