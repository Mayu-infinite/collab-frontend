import api from './axios';

export const signup = (email: string, password: string) => {
  return api.post('/auth/signup', { email, password });
};

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });

  // 👇 DEBUG HERE (IMPORTANT)
  console.log('LOGIN RESPONSE:', res.data);

  localStorage.setItem('token', res.data.accessToken);
  return res;
};

export const getMe = () => {
  return api.get('/users/me');
};
