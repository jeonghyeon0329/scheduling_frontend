const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_URLS = {
  LOGIN: `${API_BASE_URL}/accounts/login/`,
  LOGOUT: `${API_BASE_URL}/accounts/logout/`,
};

export default API_URLS;
