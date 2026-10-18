import type { Snapshot } from '../security/vault';

export function planAccess(status: Snapshot['status']) {
  switch (status) {
    case 'absent':
      return {
        label: 'Crear mi plan',
        description: 'Puedes seguir esta guía sin crear un plan.',
      };
    case 'locked':
      return {
        label: 'Desbloquear mi plan',
        description: 'Tu plan está bloqueado. Puedes desbloquearlo o seguir esta guía sin abrirlo.',
      };
    case 'unlocked':
      return { label: 'Ver mi plan', description: 'Tu plan está abierto en este navegador.' };
    case 'loading':
      return {
        label: 'Comprobar mi plan',
        description: 'Estamos comprobando si hay un plan guardado. Las guías siguen disponibles.',
      };
    case 'unavailable':
      return {
        label: 'Revisar acceso a mi plan',
        description:
          'No podemos acceder al almacenamiento de este navegador. Las guías siguen disponibles; esto no significa que tu plan se haya borrado.',
      };
  }
}
