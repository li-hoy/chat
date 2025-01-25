import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        user: {
            id: document.querySelector('#user_id')?.value,
        },
        current_recipient_id: null,
        message_feed: [],
        chats: {},
        contacts: [],
    },
    getters: {
        user: (state) => {
            return state.user;
        },
        contacts: (state) => {
            return state.contacts;
        },
        chats: (state) => {
            return state.chats;
        },
        current_recipient_id: (state) => {
            return state.current_recipient_id;
        },
    },
    mutations: {
        setContacts(state, contacts) {
            state.contacts = contacts;
        },
        setCurrentecipientId(state, id) {
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

            context.commit('setCurrentecipientId', 0);

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
                    
                    context.commit('setCurrentecipientId', recipient_id);
                })
                .catch(error => console.error(error));
        },
        loadContacts(context) {
            fetch('/contacts')
                .then(response => response.json())
                .then((response_data) => {
                    context.commit('setContacts', response_data.contacts);
                })
                .catch(error => console.error(error));
        }
    }
});
