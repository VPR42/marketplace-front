const local: boolean = false;
const safeMode: boolean = true;
export const API_URL = local
  ? `${safeMode ? 'https' : 'http'}://localhost:33301/api`
  : `${safeMode ? 'https' : 'http'}://hack.kinoko.su/api`;
