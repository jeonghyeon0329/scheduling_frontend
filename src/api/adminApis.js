import API_URLS from './apiURLS';
import request from './api';

export const fetchAdminUsers = async () => {
  return await request(API_URLS.ADMINUSERINFO, 'GET');
};
