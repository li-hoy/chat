import Vue from 'vue'
import { store, shared_data } from '../store';

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

                const store = this.$store;

                const input = $event.target
                    .parentElement
                    .querySelector('input');

                const recipient_id = store.getters.current_recipient_id;

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
                    .then(data => {
                        store.commit('recipient_messages', recipient_id, data.messages)
                    })
                    .catch(error => console.error(error));

            },
        },
        computed: {
            is_send_button_disabled: function () {
                const store = this.$store;

                return (this.message === '' || store.getters.current_recipient_id < 1);
            },
            result_message_feed: function () {
                return  this.$store.getters.current_recipient_messages;
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
                        v-for="message in result_message_feed"
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