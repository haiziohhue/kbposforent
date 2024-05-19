import {API_URL, TOKEN_KEY} from "../../constants";
import axios, {AxiosResponse} from "axios";
import {IUser} from "../../interfaces";

export const getUserList: () => Promise<AxiosResponse<IUser[]>> = () => {
    return axios
        .get(`${API_URL}/api/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        })
}