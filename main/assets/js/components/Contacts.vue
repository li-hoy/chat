<script>
import {mapGetters} from 'vuex';
import {store} from '../store';
import ContactItem from './ContactItem.vue';

export default {
    store,
    components: {
        ContactItem
    },
    data: function () {
        return {
            search_text: null,
        };
    },
    created: function () {
        this.$store.dispatch('loadContacts');
    },
    methods: {
        select: function (selected_recipient_id) {
            const store = this.$store;

            fetch('/messages/' + selected_recipient_id + '/')
                .then(response => response.json())
                .then(data => {
                    store.commit('setCurrentRecipientId', selected_recipient_id);
                    store.commit('updateChat', {
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
        ...mapGetters(['current_recipient_id']),
    },
}
</script>

<template>
    <div id="contacts" class="panel">
        <div id="search-contact-panel" class="input-panel">
            <div class="input-wrapper">
                <input type="text" v-model="search_text" placeholder="поиск по контактам" />
            </div>
        </div>
        <div id="contact-list">
            <ContactItem
                v-for="contact in result_contact_list"
                :key="contact.id"
                :contact="contact"
                v-on:contact-selected="select"
            />
        </div>
    </div>
</template>

<style scoped>

</style>