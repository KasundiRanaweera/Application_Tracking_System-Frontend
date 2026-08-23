import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, (error) => Promise.reject(error))

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status
    const isAuth = error.config?.url?.includes('/api/auth/')
    if (status === 401 && !isAuth) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login?reason=session_expired'
    }
    if (status === 403 && !isAuth) {
      window.location.href = '/unauthorized'
    }
    return Promise.reject(error)
  }
)

export default axiosClient
