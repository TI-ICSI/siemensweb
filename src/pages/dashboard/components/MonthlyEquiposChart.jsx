// src/pages/dashboard/components/MonthlyEquiposChart.jsx
import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-icsi border border-icsi-border bg-white px-3 py-2 shadow-icsi-lg">
      <p className="text-xs font-semibold text-icsi-titleform">{p.full}</p>
      <p className="mt-0.5 text-sm text-icsi-primary">
        <span className="font-bold">{p.total.toLocaleString()}</span> equipos
      </p>
      <p className="text-xs text-icsi-textLight">
        {p.inventarios} {p.inventarios === 1 ? 'inventario' : 'inventarios'}
      </p>
    </div>
  );
};

// Equipos registrados por mes (suma de todos los inventarios del mes)
const MonthlyEquiposChart = ({ data12, dataAll }) => {
  const [range, setRange] = useState('12');
  const data = range === '12' ? data12 : dataAll;
  const hasData = data.some((d) => d.total > 0);

  const tab = (value, label) => (
    <button
      onClick={() => setRange(value)}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        range === value
          ? 'bg-icsi-primary text-white'
          : 'text-icsi-text hover:bg-icsi-background'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="card flex h-full flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-icsi-titleform">Equipos por mes</h3>
          <p className="text-xs text-icsi-textLight">Suma de todos los inventarios de cada mes</p>
        </div>
        <div className="flex shrink-0 gap-1 rounded-full border border-icsi-border p-0.5">
          {tab('12', '12 meses')}
          {tab('all', 'Todo')}
        </div>
      </div>

      {hasData ? (
        <div className="min-h-[300px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="equiposMes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC142B" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#DC142B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                minTickGap={14}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#DC142B', strokeOpacity: 0.2 }} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#DC142B"
                strokeWidth={2.5}
                fill="url(#equiposMes)"
                dot={{ r: 3, fill: '#DC142B', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-1 items-center justify-center text-sm text-icsi-text">
          Aún no hay equipos registrados
        </div>
      )}
    </div>
  );
};

export default MonthlyEquiposChart;