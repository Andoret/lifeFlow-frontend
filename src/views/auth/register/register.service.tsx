import axios from 'axios'

export const register = async (data: any) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/auto-register`, data)
  return response.data
}