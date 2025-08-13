import { create } from 'zustand';

const useMessageStore = create((set, get) => ({
    messageId: null,
    messageContent: '',

    setMessageId: (messageId) => set({ messageId }),

    getMessageId: () => get().messageId,

    setMessageContent: (content) => set({ messageContent: content }),

    getMessageContent: () => get().messageContent,

    appendToMessage: (newContent) =>
        set((state) => ({
            messageContent: state.messageContent + '\n' + newContent
        })),

    clearMessage: () => set({ messageId: null, messageContent: '' })
}));

export default useMessageStore;
