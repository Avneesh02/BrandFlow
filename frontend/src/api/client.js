import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function register(email, password, companyName) {
  const { data } = await api.post('/auth/register', {
    email,
    password,
    company_name: companyName || null,
  })
  return data
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem('access_token', data.access_token)
  localStorage.setItem('refresh_token', data.refresh_token)
  return data
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}

export async function uploadPdf(file) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/documents/upload', form)
  return data
}

export async function submitQuickBrand(formData) {
  const { data } = await api.post('/documents/quick-brand', formData)
  return data
}

export async function generateCampaign(payload) {
  const { data } = await api.post('/campaigns/generate', payload)
  return data
}

export async function getCampaign(id) {
  const { data } = await api.get(`/campaigns/${id}`)
  return data
}

export async function listCampaigns() {
  const { data } = await api.get('/campaigns/')
  return data
}

export async function updateCampaignStatus(id, status) {
  const { data } = await api.patch(`/campaigns/${id}/status`, { status })
  return data
}

export async function updateCampaignContent(id, content) {
  const { data } = await api.put(`/campaigns/${id}/content`, { content })
  return data
}

export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export function formatApiError(err) {
  const detail = err.response?.data?.detail
  if (!detail) return err.message || 'Something went wrong'
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
  }
  return JSON.stringify(detail)
}

export default api
