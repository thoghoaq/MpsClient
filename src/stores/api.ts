import axios, { AxiosError, RawAxiosRequestHeaders } from 'axios'
import { appConfig } from './index'
import { Auth } from './auth/types'
import { APIResponse } from './types'

export const useApi = () => {
  const getDefaultHeaders = () => {
    const savedAuth = localStorage.getItem('auth')
    const auth: Auth = savedAuth ? JSON.parse(savedAuth) : null
    const defaultHeaders = {
      Authorization: `Bearer ${auth?.accessToken}`,
      'Accept-Language': appConfig.language,
    }
    return defaultHeaders
  }

  const get = async (url: string, headers?: RawAxiosRequestHeaders): Promise<APIResponse<any>> => {
    return axios
      .get(url, {
        headers: headers ?? getDefaultHeaders(),
      })
      .then((response) => {
        return {
          success: true,
          content: response.data,
          status: response.status,
        }
      })
      .catch((error: AxiosError<any, any>) => {
        if (error.response) {
          return {
            success: false,
            content:
              error.response.data['reason'] ||
              error.response.data['message'] ||
              error.response.data ||
              error.response.status,
            status: error.response.status,
          }
        }
        return {
          success: false,
          content: error.message || error.status,
          status: error.status,
        }
      })
  }

  const post = async (url: string, data: any, headers?: any, auth?: any): Promise<APIResponse<any>> => {
    let contentType = 'application/json'
    let body: any = JSON.stringify(data)
    if (data instanceof FormData) {
      contentType = 'multipart/form-data'
      body = data
    }
    return axios
      .post(url, body, {
        headers: headers ?? {
          ...getDefaultHeaders(),
          'Content-Type': contentType,
        },
        auth: auth,
        data: data,
      })
      .then((response) => {
        return {
          success: true,
          content: response.data,
          status: response.status,
        }
      })
      .catch((error: AxiosError<any, any>) => {
        console.log(error)
        if (error.response) {
          return {
            success: false,
            content:
              error.response.data['reason'] ||
              error.response.data['message'] ||
              error.response.data ||
              error.response.status,
            status: error.response.status,
          }
        }
        return {
          success: false,
          content: error.message || error.status,
          status: error.status,
        }
      })
  }

  const put = async (url: string, data: any): Promise<APIResponse<any>> => {
    let contentType = 'application/json'
    let body: any = JSON.stringify(data)
    if (data instanceof FormData) {
      contentType = 'multipart/form-data'
      body = data
    }
    return axios
      .put(url, body, {
        headers: {
          ...getDefaultHeaders(),
          'Content-Type': contentType,
        },
      })
      .then((response) => {
        return {
          success: true,
          content: response.data,
          status: response.status,
        }
      })
      .catch((error: AxiosError<any, any>) => {
        if (error.response) {
          return {
            success: false,
            content:
              error.response.data['reason'] ||
              error.response.data['message'] ||
              error.response.data ||
              error.response.status,
            status: error.response.status,
          }
        }
        return {
          success: false,
          content: error.message || error.status,
          status: error.status,
        }
      })
  }

  const Delete = async (url: string) => {
    return axios
      .delete(url, {
        headers: getDefaultHeaders(),
      })
      .then((response) => {
        return {
          success: true,
          content: response.data,
          status: response.status,
        }
      })
      .catch((error: AxiosError<any, any>) => {
        if (error.response) {
          return {
            success: false,
            content:
              error.response.data['reason'] ||
              error.response.data['message'] ||
              error.response.data ||
              error.response.status,
            status: error.response.status,
          }
        }
        return {
          success: false,
          content: error.message || error.status,
          status: error.status,
        }
      })
  }

  const getFile = async (url: string): Promise<APIResponse<any>> => {
    return axios
      .get(url, {
        headers: {
          ...getDefaultHeaders(),
          'Content-Type': 'application/octet-stream',
        },
        responseType: 'blob',
      })
      .then((response) => {
        return {
          success: true,
          content: response.data,
          status: response.status,
        }
      })
      .catch((error: AxiosError<any, any>) => {
        if (error.response) {
          return {
            success: false,
            content:
              error.response.data['reason'] ||
              error.response.data['message'] ||
              error.response.data ||
              error.response.status,
            status: error.response.status,
          }
        }
        return {
          success: false,
          content: error.message || error.status,
          status: error.status,
        }
      })
  }

  return {
    get,
    post,
    put,
    delete: Delete,
    getFile,
  }
}
