import { AuthBindings } from "@refinedev/core";
import { AuthHelper } from "@refinedev/strapi-v4";

import { API_URL, TOKEN_KEY } from "./constants";

import axios from "axios";

export const axiosInstance = axios.create();
const strapiAuthHelper = AuthHelper(API_URL + "/api");

export const authProvider: AuthBindings = {
  // login: async ({ username, password }) => {
  //   const { data, status } = await strapiAuthHelper.login(username, password);
  //   if (status === 200) {
  //     localStorage.setItem(TOKEN_KEY, data.jwt);
  //     window.location.reload();
  //     // set header axios instance
  //     axiosInstance.defaults.headers.common[
  //       "Authorization"
  //     ] = `Bearer ${data.jwt}`;

  //     return {
  //       success: true,
  //       redirectTo: "/",
  //     };
  //   }
  //   return {
  //     success: false,
  //     error: {
  //       message: "Login failed",
  //       name: "Invalid username or password",
  //     },
  //   };
  // },
  login: async ({ username, password }) => {
    try {
      const { data, status } = await strapiAuthHelper.login(username, password);
      if (status === 200) {
        // Successful login
        localStorage.setItem(TOKEN_KEY, data.jwt);
        window.location.reload();
        // Set header axios instance
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.jwt}`;
        return {
          success: true,
          redirectTo: "/",
        };
      } else {
        // Unexpected response status
        return {
          success: false,
          error: {
            message: "Login failed",
            name: "Invalid username or password",
          },
        };
      }
    } catch (error) {
      // Network or other errors
      return {
        success: false,
        error: {
          message: "Login failed",
          name: "username ou password invalide",
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      error: {
        message: "Check failed",
        name: "Token not found",
      },
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }

    const { data, status } = await strapiAuthHelper.me(token, {
      meta: {
        populate: "*",
      },
    });
    if (status === 200) {
      return {
        ...data,
      };
    }

    return null;
  },
};
