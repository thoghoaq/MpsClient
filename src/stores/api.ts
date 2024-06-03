import axios from 'axios'
import { useAuthStore } from './auth'
import { appConfig } from './index'

export const useApi = () => {
  const { auth } = useAuthStore()
  const defaultHeaders = {
    Authorization: `Bearer ${auth.accessToken}`,
    'Accept-Language': appConfig.language,
  }

  const get = async (url: string) => {
    const response = await axios.get(url, {
      headers: defaultHeaders,
    })

    return response
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
