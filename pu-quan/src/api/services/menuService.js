import api from '../config'

export const menuService = {
  getMenu: () => api.get('/menu'),
  createMenuItem: (data) => api.post('/menu', data),
  updateMenuItem: (itemId, data) => api.patch(`/menu/${itemId}`, data),
  deleteMenuItem: (itemId) => api.delete(`/menu/${itemId}`)
} 
