import axios from 'axios';

const USER_API = process.env.NEXT_PUBLIC_USER_API;

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${USER_API}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
};
