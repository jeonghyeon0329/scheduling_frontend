function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const request = async (url, method = 'POST', body = null, headers = {}) => {
  const csrftoken = getCookie('csrftoken');
  const config = {
    method,
    credentials: 'include', // sessionid 쿠키 포함
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (response.status === 401 || response.status === 403) {
      console.warn('세션이 만료되었거나 존재하지 않습니다. 페이지를 새로고침합니다.');
      window.location.reload(); // 강제 새로고침
      return; 
    }

    if (!response.ok) {
      const error = new Error(`Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      console.warn('세션이 유효하지 않거나 서버 인증이 만료되었습니다.');
      window.location.reload();
    } else {
      console.error('요청 중 오류 발생:', error);
      throw error;
    }
  }
};

export default request;
