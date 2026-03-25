import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { messagesKey } from './useMessages'
import { CHATS_KEY } from './useChats'
import type { Message, AskResponse, OptimisticMessage } from '@/types'

export function useAskQuestion(chatId: string | null) {
  const queryClient = useQueryClient()

  return useMutation<AskResponse, Error, string>({
    mutationFn: async (query: string) => {
      const { data } = await api.post(`/chat/${chatId}/ask`, { query })
      return data
    },
    onMutate: async (query) => {
      if (!chatId) return

      await queryClient.cancelQueries({ queryKey: messagesKey(chatId) })

      const previous = queryClient.getQueryData<Message[]>(messagesKey(chatId))

      const userMsg: OptimisticMessage = {
        id: `optimistic-user-${Date.now()}`,
        role: 'user',
        content: query,
        created_at: new Date().toISOString(),
        isOptimistic: true,
      }

      const loadingMsg: OptimisticMessage = {
        id: `optimistic-assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
        isOptimistic: true,
        isLoading: true,
      }

      queryClient.setQueryData<OptimisticMessage[]>(messagesKey(chatId), (old) => [
        ...(old ?? []),
        userMsg,
        loadingMsg,
      ])

      return { previous }
    },
    onSuccess: (data) => {
      if (!chatId) return

      queryClient.setQueryData<OptimisticMessage[]>(messagesKey(chatId), (old) => {
        if (!old) return old
        // Remove optimistic messages and add real assistant response
        const withoutLoading = old.filter((m) => !m.isLoading)
        // Mark user optimistic as confirmed
        const confirmed = withoutLoading.map((m) =>
          m.isOptimistic ? { ...m, isOptimistic: false } : m
        )
        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: JSON.stringify(data.answer),     
          created_at: new Date().toISOString(),
        }
        return [...confirmed, assistantMsg]
      })

      // Refresh chats to pick up auto-title update
      queryClient.invalidateQueries({ queryKey: CHATS_KEY })
    },
    onError: (_err, _vars, context: any) => {
      if (chatId && context?.previous) {
        queryClient.setQueryData(messagesKey(chatId), context.previous)
      }
    },
  })
}
