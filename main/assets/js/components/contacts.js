import Vue from 'vue';
import { store } from '../store';

const element_id = 'contacts';

if (document.getElementById(element_id)) {
    const contacts = new Vue({
        el: '#' + element_id,
        store,
        data: {
            search_text: null,
        },
        created: function () {
            this.load();
        },
        methods: {
            load: function () {
                const store = this.$store;

                fetch('/contacts')
                    .then(response => {
                        response.json()
                            .then(result => store.commit('contacts', result.contacts));
                    })
                    .catch(error => console.error(error));
            },
            select: function ($event) {
                const selected_recipient_id = parseInt($event.target.getAttribute('data-contact-id'));

                const store = this.$store;

                fetch('/messages/' + selected_recipient_id + '/')
                    .then(response => response.json())
                    .then(data => {
                        store.commit('current_recipient_id', selected_recipient_id);
                        store.commit('update_chat', {
                            recipient_id: selected_recipient_id,
                            messages: data.messages,
                        });
                    })
                    .catch(error => console.error(error));
            },
        },
        computed: {
            result_contact_list() {
                const store = this.$store;
                
                let contacts = store.getters.contacts;
                
                if (this.search_text) {
                    return contacts.filter(
                        (contact) => contact.name
                            .toLowerCase()
                            .includes(this.search_text.toLowerCase())
                    );
                }
                
                return contacts;
            },
            current_recipient_id() {
                return this.$store.getters.current_recipient_id
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
                                'contact-selected': (contact.id === current_recipient_id),
                            }
                        ]"
                        v-for="contact in result_contact_list"
                        @click="select($event)"
                        :data-contact-id="contact.id"
                        :data-current-recipient-id="current_recipient_id"
                    >
                        {{contact.name}}
                    </div>
                </div>
            </div>
        `
    });
}
