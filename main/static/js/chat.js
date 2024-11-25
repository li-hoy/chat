const shared_data = {
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
        send: async function ($event) {
            this.message = '';

            const input = $event.target
                .parentElement
                .querySelector('input');

            let response = await fetch('/messages/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    recipient_id: this.shared.current_recipient_id,
                    text: input.value,
                    csrfmiddlewaretoken: document.querySelector('[name=csrfmiddlewaretoken]').value,
                })
            });

            if (response.ok) {
                shared_data.chats[shared_data.current_recipient_id] = (await response.json()).messages;
            } else {
                console.error("Ошибка HTTP: " + response.status);
            }
        },
    },
    computed: {
        isSendButtonDisabled: function() {
            return (this.message === '' || this.shared.current_recipient_id < 1);
        },
        resultMessageFeed() {
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
                            'message-self': (message.sender_id === shared.me.id),
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
                    if (response.ok) {
                        response
                            .json()
                            .then(result => {
                                self.shared.contacts = result.contacts;
                            })
                    } else {
                        console.error("Ошибка HTTP: " + response.status);
                    }

                    // axios.get('/contacts')
                    //     .then((response) => console.log(response))
                    //    .catch((error) => console.log(error));
                });
        },
        select: function ($event) {
            current_recipient_id = parseInt($event.target.getAttribute('data-contact-id'));

            shared = this.shared;

            fetch('/messages/' + current_recipient_id + '/')
                .then(response => {
                    if (response.ok) {
                        response.json().then(data => {
                            shared.current_recipient_id = current_recipient_id;
                            shared.chats[shared.current_recipient_id] = data.messages;
                        })
                    } else {
                        console.error("Ошибка HTTP: " + response.status);
                    }
                });
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
