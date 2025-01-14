import Vue from 'vue'

const shared_data = {
    user : {
        id: document.querySelector('#user_id')?.value,
    },
    current_recipient_id: null,
    message_feed: [],
    chats: {},
    contacts: [],
};

const chat = new Vue({
    el: '#chat',
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

const contacts = new Vue({
    el: '#contacts',
    data: {
        shared: shared_data,
        search_text: null,
    },
    created: function () {
        this.load();
    },
    methods: {
        load: function () {
            const self = this;

            fetch('/contacts')
                .then(response => {
                    response.json()
                        .then(result => self.shared.contacts = result.contacts)
                })
                .catch(error => console.error(error));
        },
        select: function ($event) {
            const current_recipient_id = parseInt($event.target.getAttribute('data-contact-id'));

            const shared = this.shared;

            fetch('/messages/' + current_recipient_id + '/')
                .then(response => response.json())
                .then(data => {
                    shared.current_recipient_id = current_recipient_id;
                    shared.chats[shared.current_recipient_id] = data.messages;
                })
                .catch(error => console.error(error));
        },
    },
    computed: {
        resultContactList() {
            if (this.search_text) {
                return this.shared.contacts.filter(
                    (contact) => contact.name
                        .toLowerCase()
                        .includes(this.search_text.toLowerCase())
                );
            } else {
                return this.shared.contacts;
            }
        }
    },
    template: `
        <div id="contacts" class="panel">
            <div id="search-contact-panel" class="input-panel">
                <div class="input-wrapper">
                    <input type="text" v-model="search_text" placeholder="поиск по контактам" />
                </div>
            </div>
            <div id="contact-list">
                <div
                    v-bind:class="[
                        'contact',
                        {
                            'contact-selected': (contact.id === shared.current_recipient_id),
                        }
                    ]"
                    v-for="contact in resultContactList"
                    @click="select($event)"
                    :data-contact-id="contact.id"
                    :data-current-recipient-id="shared.current_recipient_id"
                >
                    {{contact.name}}
                </div>
            </div>
        </div>
    `
});
