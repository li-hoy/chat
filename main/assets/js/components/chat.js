import Vue from 'vue'
import shared_data from '../shared_data';

const element_id = 'chat';

if (document.getElementById(element_id)) {
    const chat = new Vue({
        el: '#' + element_id,
        data: {
            message: '',
            shared: shared_data,
        },
        methods: {
            load: async function () {
                let response = await fetch('/contacts');

                if (response.ok) {
                    shared_data.contacts = (await response.json()).contacts;
                } else {
                    console.error("Ошибка HTTP: " + response.status);
                }
            },
            send: function ($event) {
                this.message = '';

                const shared = this.shared;

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
                        recipient_id: this.shared.current_recipient_id,
                        text: input.value,
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        shared.chats[shared.current_recipient_id] = data.messages

                        // тригерим обновление сообщений
                        const recipient_id = shared.current_recipient_id
                        shared.current_recipient_id = 0
                        shared.current_recipient_id = recipient_id
                    })
                    .catch(error => console.error(error));

            },
        },
        computed: {
            isSendButtonDisabled: function() {
                return (this.message === '' || this.shared.current_recipient_id < 1);
            },
            resultMessageFeed: function () {
                return this.shared.chats[this.shared.current_recipient_id];
            },
        },
        template: `
            <div id="chat">
                <div id="message-feed">
                    <div
                        v-bind:class="[
                            'message',
                            {
                                'message-self': (message.sender_id == shared.user.id),
                            }
                        ]"
                        v-for="message in resultMessageFeed"
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
                        :disabled="isSendButtonDisabled"
                    >send</button>
                </div>
            </div>
        `
    });
}