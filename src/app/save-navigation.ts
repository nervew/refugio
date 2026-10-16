import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from './context';
/** Espera a que clean() quite el bloqueo antes de abandonar el editor guardado. */
export function useReturnHomeAfterSave() {
  const { dirty } = useApp();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!saved || dirty) return;
    // El router actualiza su bloqueador en un efecto del proveedor. Navegar en
    // la siguiente tarea permite que termine ese mismo ciclo de efectos.
    const task = setTimeout(() => navigate('/', { state: { saved: true } }), 0);
    return () => clearTimeout(task);
  }, [saved, dirty, navigate]);
  return () => setSaved(true);
}
