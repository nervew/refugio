export type ErrorCode =
  | 'LOCKED'
  | 'SESSION_EXPIRED'
  | 'UNLOCK_FAILED'
  | 'INVALID_INPUT'
  | 'INVALID_FILE'
  | 'FILE_TOO_LARGE'
  | 'LIMIT_REACHED'
  | 'UNSUPPORTED_VERSION'
  | 'CONFLICT'
  | 'STORAGE_UNAVAILABLE'
  | 'QUOTA_EXCEEDED'
  | 'CRYPTO_UNAVAILABLE'
  | 'ALREADY_EXISTS'
  | 'CANCELLED';
export class LocalError extends Error {
  constructor(public code: ErrorCode) {
    super(code);
    this.name = 'LocalError';
  }
}
export const messages: Record<ErrorCode, string> = {
  LOCKED: 'Desbloquea tu plan para continuar. Las guías siguen disponibles.',
  SESSION_EXPIRED: 'Tu sesión se bloqueó para proteger tus datos. Puedes volver a abrirla.',
  UNLOCK_FAILED: 'No pudimos abrir esta copia. Revisa la frase o utiliza otra copia.',
  INVALID_INPUT: 'Revisa los campos y sus límites. No se guardaron cambios.',
  INVALID_FILE: 'No pudimos leer esta copia. El archivo debe ser una copia de Refugio válida.',
  FILE_TOO_LARGE: 'La copia supera el límite de 8 MiB. No se modificaron tus datos.',
  LIMIT_REACHED:
    'Llegaste al límite de almacenamiento del plan. Descarga una copia y revisa qué conservar.',
  UNSUPPORTED_VERSION:
    'Esta copia necesita otra versión de Refugio. Tus datos actuales se conservan.',
  CONFLICT:
    'Hay cambios guardados en otra pestaña. Conserva tu borrador, bloquea y vuelve a abrir el plan para revisarlos.',
  STORAGE_UNAVAILABLE:
    'No pudimos acceder al almacenamiento. Las guías siguen disponibles. Usa un navegador compatible.',
  QUOTA_EXCEEDED:
    'No se guardó: falta espacio en este dispositivo. Descarga una copia de lo guardado y vuelve a intentarlo.',
  CRYPTO_UNAVAILABLE:
    'Este navegador no permite guardar datos cifrados. Usa HTTPS y un navegador actualizado.',
  ALREADY_EXISTS:
    'Ya existe un plan guardado. Desbloquéalo o restaura una copia de forma explícita.',
  CANCELLED: 'Operación cancelada. Tus datos no cambiaron.',
};
export function explain(error: unknown): string {
  return error instanceof LocalError
    ? messages[error.code]
    : 'No pudimos completar la operación. Tus datos guardados se conservan. Inténtalo otra vez.';
}
export type Result<T> =
  { ok: true; value: T } | { ok: false; error: { code: ErrorCode; retryable: boolean } };
export async function result<T>(operation: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, value: await operation() };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: error instanceof LocalError ? error.code : 'STORAGE_UNAVAILABLE',
        retryable: true,
      },
    };
  }
}
