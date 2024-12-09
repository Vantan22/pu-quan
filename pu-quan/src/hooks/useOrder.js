import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '../api/services/orderService'
import { message } from 'antd'

export function useOrders(params) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderService.getOrders(params)
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
      message.success('Đã tạo đơn hàng')
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi tạo đơn hàng')
    }
  })
}

export function useUpdateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, data }) => orderService.updateOrder(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
      message.success('Đã cập nhật đơn hàng')
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi cập nhật')
    }
  })
}

export function useTableOrders(tableId) {
  return useQuery({
    queryKey: ['orders', 'table', tableId],
    queryFn: () => orderService.getTableOrders(tableId),
    enabled: !!tableId
  })
} 
