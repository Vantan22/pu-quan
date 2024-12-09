import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { menuService } from '../api/services/menuService'
import { message } from 'antd'

export function useMenu() {
  return useQuery({
    queryKey: ['menu'],
    queryFn: menuService.getMenu
  })
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: menuService.createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['menu'])
      message.success('Đã thêm món mới')
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi thêm món')
    }
  })
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => menuService.updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['menu'])
      message.success('Đã cập nhật món')
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi cập nhật')
    }
  })
} 
