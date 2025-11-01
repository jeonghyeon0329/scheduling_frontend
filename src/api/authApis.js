import API_URLS from './apiURLS';
import request from './api';

export const login = async (email, password) => {
  return await request(API_URLS.LOGIN, 'POST', { email, password });
};

export const logout = () =>
  request(API_URLS.LOGOUT, 'POST');

export const signup = async (email, password, name) => {
  return await request(API_URLS.SIGNUP, 'POST', { email, password, name });
};