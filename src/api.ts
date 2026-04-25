import axios from 'axios';

const API_URL = 'http://localhost:3000/api/otp';

export const requestOtp = async (phone: string) => {
  const response = await axios.post(`${API_URL}/request`, { phone });
  return response.data;
};

export const verifyOtp = async (phone: string, code: string) => {
  const response = await axios.post(`${API_URL}/verify`, { phone, code });
  return response.data;
};
