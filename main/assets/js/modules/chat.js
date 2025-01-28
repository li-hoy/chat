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
    },
    actions: {
        sendMessage(context, message) {
            const recipient_id = context.getters.current_recipient_id;

            context.commit('setCurrentRecipientId', 0);

            fetch('/messages/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: JSON.stringify({
                    recipient_id: recipient_id,
                    text: message,
                })
            })
                .then(response => response.json())
                .then(response_data => {
                    context.commit('updateChat', {
                        recipient_id: recipient_id,
                        messages: response_data.messages,
                    });
                    
                    context.commit('setCurrentRecipientId', recipient_id);
                })
                .catch(error => console.error(error));
        },
    }
};
