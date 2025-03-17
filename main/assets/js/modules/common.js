export default {
    state: {
        user: null,
    },
    getters: {
        user: (state) => {
            return state.user;
        },
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
    },
    actions: {
        loadCommon(context) {
            fetch('/common')
                .then(response => response.json())
                .then((response_data) => {
                    context.commit('setUser', response_data.user);
                })
                .catch(error => console.error(error));
        }
    }
};
