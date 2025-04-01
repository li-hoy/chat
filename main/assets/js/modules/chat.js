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
        addMessage(state, payload) {
            const messages = state.chats[recipient_id] ?? [];

            messages.push(payload.message)

            state.chats[payload.recipient_id] = messages;
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
                sender_id: this.user.id,
                text: text,
                state: 'sended',
            });

            context.commit('setCurrentRecipientId', recipient_id);

            // fetch('/messages/add/', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json; charset=utf-8',
            //         'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            //     },
            //     body: JSON.stringify({
            //         recipient_id: recipient_id,
            //         text: message,
            //     })
            // })
            //     .then(response => response.json())
            //     .then(response_data => {
            //         context.commit('updateChat', {
            //             recipient_id: recipient_id,
            //             messages: response_data.messages,
            //         });

            //         context.commit('setCurrentRecipientId', recipient_id);
            //     })
            //     .catch(error => console.error(error));
        },
    }
};
