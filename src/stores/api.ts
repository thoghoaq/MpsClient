import axios, { AxiosError } from 'axios'
import { appConfig } from './index'
import { Auth } from './auth/types';
import { APIResponse } from './types';

export const useApi = () => {
  const savedAuth = localStorage.getItem('auth');
  const auth : Auth = savedAuth ? JSON.parse(savedAuth) : null;
  const defaultHeaders = {
    Authorization: `Bearer ${auth?.accessToken}`,
    'Accept-Language': appConfig.language,
  }

  const get = async (url: string) : Promise<APIResponse<any>> => {
    return axios.get(url, {
      headers: defaultHeaders,
    }).then((response) => {
      return {
        success: true,
        content: response.data,
        status: response.status,
      }
    }).catch((error : AxiosError<any, any>) => {
      if (error.response) {
        return {
          success: false,
          content: error.response.data["reason"] || error.response.data,
          status: error.response.status,
        }
      }
      return {
        success: false,
        content: error.message,
        status: error.status,
      }
    })
  }

  const post = async (url: string, data: any) => {
    const response = await axios.post(url, {
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response
  }

  const put = async (url: string, data: any) => {
    const response = await axios.put(url, {
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response
  }

  const delele = async (url: string) => {
    const response = await axios.delete(url, {
      headers: defaultHeaders,
    })
    return response
  }

  return {
    get,
    post,
    put,
    delele
  }
}
