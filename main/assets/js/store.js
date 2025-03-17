import Vue from 'vue';
import Vuex from 'vuex';
import chat from './modules/chat';
import contacts from './modules/contacts';
import common from './modules/common';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        common,
        chat,
        contacts,
    }
});
