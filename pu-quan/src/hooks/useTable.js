import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tableService } from '../api/services/tableService'
import { message } from 'antd'

export function useTables() {
  return useQuery({
    queryKey: ['tables'],
    queryFn: tableService.getTables
  })
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tableId, status }) => tableService.updateTableStatus(tableId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['tables'])
      message.success('Đã cập nhật trạng thái bàn')
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi cập nhật trạng thái')
    }
  })
} 
