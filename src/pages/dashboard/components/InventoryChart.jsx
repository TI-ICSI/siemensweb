// src/pages/dashboard/components/InventoryChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const InventoryChart = ({ data }) => {

  return (
    <div className="bg-white border border-icsi-border rounded-icsi-lg p-6">
      <h3 className="text-lg font-semibold text-icsi-titleform mb-4">
        📈 Inventarios por Mes
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#D91A2A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const EquipmentPieChart = ({ data }) => {
  const COLORS = ['#D91A2A', '#D95F5F', '#73635D', '#494646'];

  return (
    <div className="bg-white border border-icsi-border rounded-icsi-lg p-6">
      <h3 className="text-lg font-semibold text-icsi-titleform mb-4">
        🥧 Distribución de Equipos
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryChart;