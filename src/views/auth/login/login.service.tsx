import axios from "axios"
export const login = async (data: any) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/authentication/login`,
      {
        email: data.email,
        password: data.password,
      },
      {withCredentials: true})
    return response.data
  }