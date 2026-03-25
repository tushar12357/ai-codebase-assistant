import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { Chat } from '@/types'

export const CHATS_KEY = ['chats']

export function useChats() {
  return useQuery<Chat[]>({
    queryKey: CHATS_KEY,
    queryFn: async () => {
      const { data } = await api.get('/chat')
      return data
    },
    staleTime: 30_000,
  })
}

export function useCreateChat() {
  const queryClient = useQueryClient()
  return useMutation<Chat, Error>({
    mutationFn: async () => {
      const { data } = await api.post('/chat/create')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHATS_KEY })
    },
  })
}

export function useRenameChat() {
  const queryClient = useQueryClient()
  return useMutation<Chat, Error, { chatId: string; title: string }>({
    mutationFn: async ({ chatId, title }) => {
      const { data } = await api.put(`/chat/${chatId}/rename`, { title })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHATS_KEY })
    },
  })
}
