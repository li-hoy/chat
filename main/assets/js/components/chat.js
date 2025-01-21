import Vue from 'vue'
import { store } from '../store';

const element_id = 'chat';

if (document.getElementById(element_id)) {
    const chat = new Vue({
        el: '#' + element_id,
        store,
        data: {
            message: '',
        },
        methods: {
            send: function ($event) {
                this.message = '';

                const recipient_id = this.recipient_id;
                
                const store = this.$store;

                store.commit('current_recipient_id', 0);

                const input = $event.target
                    .parentElement
                    .querySelector('input');

                fetch('/messages/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    },
                    body: JSON.stringify({
                        recipient_id: recipient_id,
                        text: input.value,
                    })
                })
                    .then(response => response.json())
                    .then(response_data => {
                        store.commit('update_chat', {
                            recipient_id: recipient_id,
                            messages: response_data.messages,
                        });
                        
                        store.commit('current_recipient_id', recipient_id);
                    })
                    .catch(error => console.error(error));

            },
        },
        computed: {
            recipient_id: function () {
                return this.$store.getters.current_recipient_id;
            },
            is_send_button_disabled: function () {
                return (this.message === '' || this.recipient_id < 1);
            },
            message_feed: function () {
                return this.$store.getters.chats[this.recipient_id];
            },
            user_id: function () {
                return this.$store.getters.user.id;
            }
        },
        template: `
            <div id="chat">
                <div id="message-feed">
                    <div
                        v-bind:class="[
                            'message',
                            {
                                'message-self': (message.sender_id == user_id),
                            }
                        ]"
                        v-for="message in message_feed"
                    >
                        {{message.text}}
                    </div>
                </div>
                <div id="message-panel" class="panel input-panel">
                    <div class="input-wrapper">
                        <input
                            type="text"
                            v-model="message"
                            @keyup.enter="send($event)"
                            value=""
                            placeholder="введите сообщение"
                        />
                    </div>
                    <button
                        @click="send($event)"
                        :disabled="is_send_button_disabled"
                    >send</button>
                </div>
            </div>
        `
    });
}