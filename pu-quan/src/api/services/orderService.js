import api from '../config'

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  updateOrder: (orderId, data) => api.patch(`/orders/${orderId}`, data),
  getOrders: (params) => api.get('/orders', { params }),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`)
} 
