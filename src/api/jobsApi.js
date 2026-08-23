import axiosClient from './axiosClient'
export const getOpenJobs       = (params) => axiosClient.get('/api/jobs', { params })
export const getOpenJobById    = (id)     => axiosClient.get(`/api/jobs/${id}`)
export const createJob         = (data)   => axiosClient.post('/api/jobs', data)
export const updateJob         = (id, d)  => axiosClient.put(`/api/jobs/${id}`, d)
export const deleteJob         = (id)     => axiosClient.delete(`/api/jobs/${id}`)
export const changeJobStatus   = (id, s)  => axiosClient.patch(`/api/jobs/${id}/status`, { status: s })
export const getRecruiterJobs  = (params) => axiosClient.get('/api/jobs/manage/all', { params })
