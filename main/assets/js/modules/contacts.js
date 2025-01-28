export default {
    state: {
        contacts: [],
    },
    getters: {
        contacts: (state) => {
            return state.contacts;
        },
    },
    mutations: {
        setContacts(state, contacts) {
            state.contacts = contacts;
        },
    },
    actions: {
        loadContacts(context) {
            fetch('/contacts')
                .then(response => response.json())
                .then((response_data) => {
                    context.commit('setContacts', response_data.contacts);
                })
                .catch(error => console.error(error));
        }
    }
};
