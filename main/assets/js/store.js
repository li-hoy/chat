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
        contacts(state, contacts) {
            state.contacts = contacts;
        },
        current_recipient_id(state, id) {
            state.current_recipient_id = id;
        },
        update_chat(state, payload) {
            const recipient_id = payload.recipient_id;
            const messages = payload.messages;

            state.chats[recipient_id] = messages;
        },
    },
});
