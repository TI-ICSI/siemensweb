// src/pages/dashboard/hooks/useDashboardData.js
import { useState, useEffect, useMemo } from 'react';
import { db, auth } from '../../../../firebase/firebaseConfig';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// Número de mes (0-11) a partir del nombre guardado en el inventario ("Marzo")
const monthIndex = (mes) =>
  MESES.findIndex((m) => m.toLowerCase() === String(mes || '').trim().toLowerCase());

// Clave ordenable año*12 + mes. Devuelve null si el inventario no tiene período válido.
const periodKey = (inv) => {
  const m = monthIndex(inv.mes);
  const y = Number(inv.anio);
  if (m < 0 || !y) return null;
  return y * 12 + m;
};

const labelFor = (key, withYear) => {
  const y = Math.floor(key / 12);
  const m = key % 12;
  return withYear ? `${MESES_CORTOS[m]} ${String(y).slice(2)}` : MESES_CORTOS[m];
};

const useDashboardData = () => {
  const [userName, setUserName] = useState('');
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        // Nombre del usuario
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!cancelled) {
            setUserName(userDoc.data()?.displayName || user.email?.split('@')[0] || '');
          }
        }

        // Todos los inventarios (son pocos y solo traen datos del encabezado,
        // no los equipos): de aquí salen las métricas, la gráfica y los recientes.
        const snapshot = await getDocs(query(collection(db, 'inventarios'), orderBy('createdAt', 'desc')));
        if (!cancelled) {
          setInventories(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Todo lo calculado a partir de los inventarios
  const computed = useMemo(() => {
    // Equipos e inventarios agrupados por mes del período (año + mes del inventario)
    const byPeriod = new Map();
    inventories.forEach((inv) => {
      const key = periodKey(inv);
      if (key === null) return;
      const prev = byPeriod.get(key) || { equipos: 0, inventarios: 0 };
      byPeriod.set(key, {
        equipos: prev.equipos + (Number(inv.totalEquipos) || 0),
        inventarios: prev.inventarios + 1,
      });
    });

    const now = new Date();
    const currentKey = now.getFullYear() * 12 + now.getMonth();
    const firstKey = byPeriod.size ? Math.min(...byPeriod.keys()) : currentKey;
    const lastKey = Math.max(currentKey, byPeriod.size ? Math.max(...byPeriod.keys()) : currentKey);

    // Serie mensual completa (los meses sin inventarios cuentan como 0)
    const buildSeries = (from, to) => {
      const spansYears = Math.floor(from / 12) !== Math.floor(to / 12);
      const series = [];
      for (let k = from; k <= to; k++) {
        const p = byPeriod.get(k);
        series.push({
          key: k,
          label: labelFor(k, spansYears),
          full: `${MESES[k % 12]} ${Math.floor(k / 12)}`,
          total: p?.equipos || 0,
          inventarios: p?.inventarios || 0,
        });
      }
      return series;
    };

    const monthlyAll = buildSeries(firstKey, lastKey);
    const monthly12 = buildSeries(Math.max(firstKey, lastKey - 11), lastKey);

    // Totales
    const totalInventories = inventories.length;
    const totalEquipos = inventories.reduce((sum, inv) => sum + (Number(inv.totalEquipos) || 0), 0);
    const promedioEquipos = totalInventories ? Math.round(totalEquipos / totalInventories) : 0;

    // Comparación del mes actual contra el anterior
    const cur = byPeriod.get(currentKey) || { equipos: 0, inventarios: 0 };
    const prev = byPeriod.get(currentKey - 1) || { equipos: 0, inventarios: 0 };
    const compare = (a, b) => {
      if (b > 0) {
        const pct = Math.round(((a - b) / b) * 100);
        return {
          trend: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat',
          text: `${pct > 0 ? '+' : ''}${pct}% vs mes anterior`,
        };
      }
      return { trend: a > 0 ? 'up' : 'flat', text: `${a} este mes` };
    };

    return {
      stats: {
        totalInventories,
        totalEquipos,
        promedioEquipos,
        inventariosTrend: compare(cur.inventarios, prev.inventarios),
        equiposTrend: compare(cur.equipos, prev.equipos),
      },
      monthlyAll,
      monthly12,
      recent: inventories.slice(0, 6),
    };
  }, [inventories]);

  return {
    userName,
    loading,
    ...computed,
  };
};

export default useDashboardData;