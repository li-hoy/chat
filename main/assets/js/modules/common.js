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
        async loadCommon(context) {
            return fetch('/common')
                .then(response => response.json())
                .then((response_data) => {
                    context.commit('setUser', response_data.user);
                })
                .then(() => {
                    const user_id = context.getters.user.id;
                    const socket = new WebSocket('ws://127.0.0.1:8000/ws/' + user_id);

                    socket.onopen = function(e) {
                        // socket.send(JSON.stringify({
                        //     text: 'Hello from JS client'
                        // }));
                    };

                    socket.onclose = function(event) {
                        console.log(event);

                        if (event.wasClean) {
                            console.debug('Соединение закрыто чисто');
                        } else {
                            // например, "убит" процесс сервера
                            console.error('Обрыв соединения. Код: ' + event.code + ' причина: ' + event.reason);
                        }
                    };
        
                    socket.onmessage = function(event) {
                        console.log(event);

                        const data = event.data;

                        if (data.error) {
                            console.error(error);

                            return;
                        }

                        const current_recipient_id = context.getters.current_recipient_id;

                        if (user_id === data.sender_id) {
                            const messages = context.getters.chats[data.recipient_id] ?? [];

                            for (const message of messages) {
                                if (message.sender_id == data.sender_id && message.sended_at == data.sended_at) {
                                    message.status = 'delivered';
                                    message.date = data.date;

                                    break;
                                }
                            }
                        } else {
                            context.commit('addMessage', {
                                recipient_id: user_id,
                                sender_id: data.sender_id,
                                text: data.text,
                                date: data.date,
                                status: 'delivered',
                            });
                        }

                        if (current_recipient_id == data.recipient_id || current_recipient_id == data.sender_id) {
                            context.commit('setCurrentRecipientId', 0);
                            context.commit('setCurrentRecipientId', recipient_id);
                        }
                    };

                    socket.onerror = function(error) {
                        console.error('Ошибка: ' + error.message);
                    };

                    context.commit('setSocket', socket);
                })
                .catch(error => console.error(error));
        }
    }
};
