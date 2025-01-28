import Vue from 'vue';
import Vuex from 'vuex';
import chat from './modules/chat';
import contacts from './modules/contacts';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        user: {
            id: document.querySelector('#user_id')?.value,
        },
    },
    getters: {
        user: (state) => {
            return state.user;
        },
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        chat,
        contacts
    }
});
