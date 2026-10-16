/** Estado público de navegación, sin datos personales ni persistencia. */
export function isCrisisContext(location: { pathname: string; search: string }): boolean {
  return (
    location.pathname.startsWith('/crisis') ||
    new URLSearchParams(location.search).get('from') === 'crisis'
  );
}
