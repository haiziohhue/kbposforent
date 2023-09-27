import axios from "axios";
import { TOKEN_KEY } from "../constants";
export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
  },
});
