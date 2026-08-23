import axiosClient from './axiosClient'
export const registerCandidate = (data) => axiosClient.post('/api/auth/register', data)
export const login             = (data) => axiosClient.post('/api/auth/login', data)