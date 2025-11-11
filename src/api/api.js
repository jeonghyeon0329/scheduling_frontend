function getToken() {
  return localStorage.getItem("access_token");
}

const request = async (url, method = "POST", body = null, headers = {}) => {
  const token = getToken();

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(`Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error("요청 중 오류 발생:", error);
    throw error;
  }
};

export default request;
