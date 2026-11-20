// src/pages/dashboard/components/StatsCard.jsx
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const TONES = {
  red: {
    card: 'from-red-50 to-white border-red-100',
    icon: 'bg-red-100 text-icsi-primary',
    spark: '#DC142B',
  },
  blue: {
    card: 'from-sky-50 to-white border-sky-100',
    icon: 'bg-sky-100 text-sky-600',
    spark: '#0284C7',
  },
};

const TRENDS = {
  up: { Icon: FaArrowUp, color: 'text-green-600' },
  down: { Icon: FaArrowDown, color: 'text-red-600' },
  flat: { Icon: FaMinus, color: 'text-icsi-textLight' },
};

// Tarjeta de métrica con icono, tendencia y minigráfica de fondo.
// "spark" es un arreglo de números (por ejemplo, los últimos meses).
const StatsCard = ({ id, title, value, icon, tone = 'red', trend = 'flat', trendText, subtitle, spark = [] }) => {
  const t = TONES[tone];
  const { Icon: TrendIcon, color } = TRENDS[trend] || TRENDS.flat;
  const data = spark.map((v) => ({ v }));

  return (
    <div className={`overflow-hidden rounded-icsi-lg border bg-gradient-to-br p-5 shadow-icsi ${t.card}`}>
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${t.icon}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-icsi-text">{title}</p>
          <p className="text-3xl font-bold text-icsi-titleform">{value}</p>
          {trendText && (
            <p className={`mt-0.5 flex items-center gap-1 text-xs font-medium ${color}`}>
              <TrendIcon size={10} />
              {trendText}
            </p>
          )}
          {subtitle && <p className="text-xs text-icsi-textLight">{subtitle}</p>}
        </div>
        {data.length > 1 && (
          <div className="pointer-events-none ml-auto hidden h-14 w-28 shrink-0 opacity-80 sm:block xl:w-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={t.spark} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={t.spark} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={t.spark}
                  strokeWidth={2}
                  fill={`url(#spark-${id})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;