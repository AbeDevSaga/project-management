import axios from 'axios';

const SERVICE_API = process.env.NEXT_PUBLIC_SERVICE_API;

export const fetchServices = async () => {
  try {
    const response = await axios.get(`${SERVICE_API}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return [];
  }
};
