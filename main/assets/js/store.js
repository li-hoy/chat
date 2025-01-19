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
        user: state => state.user,
        contacts: state => state.contacts,
        current_recipient_id: state => state.current_recipient_id,
        current_recipient_messages: (state) => state.chats[state.current_recipient_id],
        recipient_messages: (state, recipient_id) => state.chats[recipient_id],
        message_feed: state => state.message_feed,
    },
    mutations: {
        contacts(state, contacts) {
            state.contacts = contacts;
        },
        current_recipient_id(state, id) {
            state.current_recipient_id = id;
        },
        message_feed(state) {
            state.message_feed = state.chats[state.current_recipient_id];
        },
        recipient_messages(state, recipient_id, messages) {
            state.chats[recipient_id] = messages;
        },
    },
});

export const shared_data = {
    user : {
        id: document.querySelector('#user_id')?.value,
    },
    current_recipient_id: null,
    message_feed: [],
    chats: {},
    contacts: [],
};