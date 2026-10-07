import axiosClient from './axiosClient'
export const applyToJob              = (data) => axiosClient.post('/api/applications', data)
export const uploadResume            = (file) => {
	const formData = new FormData()
	formData.append('file', file)
	return axiosClient.post('/api/applications/resume', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})
}
// Uploaded CVs are served by the API's authenticated resume endpoint. Stored
// links may carry an outdated host or http:// scheme, so always request the
// file through the configured API base URL. Returns null for external links.
export const getResumePath = (url) => {
	const match = String(url ?? '').match(/\/api\/applications\/resume\/([^/?#]+)/)
	return match ? `/api/applications/resume/${match[1]}` : null
}
export const downloadResume          = (url) =>
	axiosClient.get(getResumePath(url) ?? url, { responseType: 'blob' })
export const getMyApplications       = (p)    => axiosClient.get('/api/applications/me', { params: p })
export const getMyApplicationById    = (id)   => axiosClient.get(`/api/applications/me/${id}`)
export const withdrawApplication     = (id)   => axiosClient.delete(`/api/applications/${id}`)
export const getJobApplications      = (jid, p) => axiosClient.get(`/api/applications/job/${jid}`, { params: p })
export const getApplicationDetail    = (id)   => axiosClient.get(`/api/applications/${id}`)
export const rateApplication         = (id, r) => axiosClient.patch(`/api/applications/${id}/rating`, { rating: r })
export const addNote                 = (id, c) => axiosClient.post(`/api/applications/${id}/notes`, { content: c })
export const changeApplicationStatus = (id, s) => axiosClient.patch(`/api/applications/${id}/status`, { status: s })
