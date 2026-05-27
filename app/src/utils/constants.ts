export const APP_NAME = 'APAE Gestão Escolar';
export const APP_BASE_PATH = '/gestao-escolar';

export function assetPath(path: string) {
  return `${APP_BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}
