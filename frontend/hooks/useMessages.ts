import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { Message } from '@/types'

export const messagesKey = (chatId: string) => ['messages', chatId]

export function useMessages(chatId: string | null) {
  return useQuery<Message[]>({
    queryKey: messagesKey(chatId ?? ''),
    queryFn: async () => {
      const { data } = await api.get(`/chat/${chatId}/messages`)
      return data
    },
    enabled: !!chatId,
    staleTime: 10_000,
  })
}
