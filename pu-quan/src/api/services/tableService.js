import api from '../config'

export const tableService = {
  getTables: () => api.get('/tables'),
  updateTableStatus: (tableId, status) => api.patch(`/tables/${tableId}`, { status }),
  getTableOrders: (tableId) => api.get(`/tables/${tableId}/orders`)
} 
