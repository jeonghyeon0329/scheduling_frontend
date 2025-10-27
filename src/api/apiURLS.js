const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_URLS = {
  LOGIN: `${API_BASE_URL}/login/`,
  USER: `${API_BASE_URL}/user/`,
  NOTICE : `${API_BASE_URL}/notice/`,
  CHAT: `${API_BASE_URL}/chat/`,
};

export default API_URLS;
