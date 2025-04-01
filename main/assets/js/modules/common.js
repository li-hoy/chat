export default {
    state: {
        user: null,
        socket: null,
    },
    getters: {
        user: (state) => {
            return state.user;
        },
        socket: (state) => {
            return state.socket;
        },
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setSocket(state, socket) {
            state.socket = socket;
        },
    },
    actions: {
        loadCommon(context) {
            return fetch('/common')
                .then(response => response.json())
                .then((response_data) => {
                    context.commit('setUser', response_data.user);
                })
                .then(() => {
                    const socket = new WebSocket('ws://127.0.0.1:8000/ws/' + this.user_id);

                    socket.onopen = function(e) {
                        socket.send(JSON.stringify({
                            message: 'Hello from Js client'
                        }));
                    };
        
                    socket.onmessage = function(event) {
                        try {
                            console.log(event);
                        } catch (e) {
                            console.log('Error:', e.message);
                        }
                    };

                    context.commit('setSocket', socket);
                })
                .catch(error => console.error(error));
        }
    }
};
