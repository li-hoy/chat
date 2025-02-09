import Vue from "vue";
import {mapGetters} from 'vuex';
import {store} from '../store';

Vue.component('contact-item', {
    store,
    'props': {
        contact: {
            type: Object,
        }
    },
    computed: {
        ...mapGetters(['current_recipient_id']),
    },
    template: `
        <div
            :class="[
                'contact',
                {
                    'contact-selected': (contact.id === current_recipient_id),
                }
            ]"
            @click="$emit('contact-selected', contact.id)"
            :data-contact-id="contact.id"
        >
            {{contact.name}}
        </div>
    `
})