export default {
    state: {
        current_recipient_id: null,
        chats: {},
    },
    getters: {
        chats: (state) => {
            return state.chats;
        },
        current_recipient_id: (state) => {
            return state.current_recipient_id;
        },
        chats: (state) => {
            return state.chats;
        }
    },
    mutations: {
        setCurrentRecipientId(state, id) {
            state.current_recipient_id = id;
        },
        updateChat(state, payload) {
            const recipient_id = payload.recipient_id;
            const messages = payload.messages;

            state.chats[recipient_id] = messages;
        },
        addMessage(state, data) {
            const recipient_id = data.recipient_id;
            const message = data.message;
            const messages = state.chats[recipient_id] ?? [];

            messages.push(message)

            state.chats[recipient_id] = messages;
        },
    },
    actions: {
        sendMessage(context, text) {
            const recipient_id = context.getters.current_recipient_id;
            const socket = context.getters.socket;

            socket.send(JSON.stringify({
                recipient_id: recipient_id,
                text: text,
                sended_at: Date.now(),
            }));

            context.commit('setCurrentRecipientId', 0);

            context.commit('addMessage', {
                recipient_id: recipient_id,
                message: {
                    recipient_id: recipient_id,
                    sender_id: context.getters.user.id,
                    text: text,
                    date: null,
                    state: 'sended',
                },
            });

            context.commit('setCurrentRecipientId', recipient_id);
        },
    }
};
