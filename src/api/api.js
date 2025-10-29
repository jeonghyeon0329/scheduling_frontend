const request = async (url, method = 'POST', body = null, headers = {}) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({})); // JSON 파싱 실패 대비

  if (!response.ok) {
    throw {
      status: response.status,
      data,
    };
  }

  return data;
};

export default request;
