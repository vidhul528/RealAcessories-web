import { api } from './ApiConfig';
import { userAPI } from './user/user';

export { api, api as ApiConfig };
export { userAPI, userAPI as authAPI };
export * from './ApiConfig';
export * from './user/user';

export default api;
