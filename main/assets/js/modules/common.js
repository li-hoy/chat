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
                        console.debug('socket: Соединение создано')
                    };

                    socket.onclose = function(event) {
                        if (event.wasClean) {
                            console.debug('socket: Соединение закрыто чисто');
                        } else {
                            // например, "убит" процесс сервера
                            console.error('socket: Обрыв соединения. Код: ' + event.code + ' причина: ' + event.reason);
                        }
                    };
        
                    socket.onmessage = function(event) {
                        const message = JSON.parse(event.data);

                        if (message.error) {
                            console.error(error);
                            
                            return;
                        }

                        const current_recipient_id = context.getters.current_recipient_id;

                        if (user_id === message.sender_id) {
                            const messages = context.getters.chats[message.recipient_id] ?? [];

                            for (const message of messages) {
                                if (message.sender_id == message.sender_id && message.sended_at == message.sended_at) {
                                    message.status = 'delivered';
                                    message.date = message.date;

                                    break;
                                }
                            }
                        } else {
                            message.status = 'delivered';

                            context.commit('addMessage', {
                                recipient_id: message.sender_id,
                                message: message,
                            });
                        }

                        if (current_recipient_id == message.recipient_id || current_recipient_id == message.sender_id) {
                            context.commit('setCurrentRecipientId', 0);
                            context.commit('setCurrentRecipientId', current_recipient_id);
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
