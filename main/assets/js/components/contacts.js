import Vue from 'vue';
import shared_data from '../shared_data';

const element_id = 'contacts';

if (document.getElementById(element_id)) {
    const contacts = new Vue({
        el: '#' + element_id,
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
}
