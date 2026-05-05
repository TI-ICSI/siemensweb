// src/pages/dashboard/hooks/useDashboardData.js
import { useState, useEffect } from 'react';
import { db, auth } from '../../../../firebase/firebaseConfig';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';

const useDashboardData = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [inventories, setInventories] = useState([]);
  const [stats, setStats] = useState({
    totalInventories: 0,
    totalEquipos: 0,
    activeInventories: 0,
    promedioEquipos: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener datos del usuario
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          setUserName(userData?.displayName || user.email?.split('@')[0]);
          setUserEmail(user.email);
        }

        // Obtener inventarios
        const q = query(collection(db, 'inventarios'), orderBy('createdAt', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        const inventariosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInventories(inventariosData);

        // Calcular estadísticas
        const totalInventories = inventariosData.length;
        const totalEquipos = inventariosData.reduce((sum, inv) => sum + (inv.totalEquipos || 0), 0);
        const activeInventories = inventariosData.filter(inv => inv.isActive === true).length;
        const promedioEquipos = totalInventories > 0 ? Math.round(totalEquipos / totalInventories) : 0;

        setStats({
          totalInventories,
          totalEquipos,
          activeInventories,
          promedioEquipos,
        });

        // Datos para gráfica de barras (últimos 6 meses)
        const last6Months = inventariosData.slice(0, 6).reverse();
        const barData = last6Months.map(inv => ({
          mes: `${inv.mes?.substring(0, 3) || ''} ${inv.anio || ''}`,
          total: inv.totalEquipos || 0,
        }));
        setChartData(barData);

        // Datos para gráfica circular (distribución por tipo de equipo)
        // Nota: Esto requeriría consultar equipos, por ahora datos de ejemplo
        setPieData([
          { name: 'Computadoras', value: 45 },
          { name: 'Laptops', value: 30 },
          { name: 'Servidores', value: 15 },
          { name: 'Redes', value: 10 },
        ]);

      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    userName,
    userEmail,
    inventories,
    stats,
    chartData,
    pieData,
    loading,
  };
};

export default useDashboardData;