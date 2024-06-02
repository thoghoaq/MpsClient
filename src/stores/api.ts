import { useAuthStore } from './auth'

export const useApi = () => {
  const { auth } = useAuthStore()
  const defaultHeaders = {
    Authorization: `Bearer ${auth.accessToken}`,
  }

  const get = async (url: string) => {
    const response = await fetch(url, {
      headers: defaultHeaders,
    })

    return response
  }

  const post = async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response
  }

  const put = async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response
  }

  const delele = async (url: string) => {
    const response = await fetch(url, {
      method: 'DELETE',
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
