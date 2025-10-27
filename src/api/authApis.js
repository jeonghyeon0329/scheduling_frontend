import API_URLS from './apiURLS';
import request from './api';

export const login = async (usrname, password) => {
  return await request(API_URLS.LOGIN, 'POST', { usrname, password });
};

// axios 적용 이후 변경
// export const login = async (username, password) => {
//   const response = await api.post('/auth/login', { username, password });
//   return response.data;
// };