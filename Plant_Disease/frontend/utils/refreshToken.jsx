import axios from 'axios';

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await axios.post(
    'http://localhost:8000/auth/refresh',
    { refresh_token: refreshToken }, // <-- pass refresh token in JSON body
    { headers: { 'Content-Type': 'application/json' } }
  );

  const newAccessToken = response.data.access_token;
  localStorage.setItem('accessToken', newAccessToken); // update stored access token

  return newAccessToken;
}
