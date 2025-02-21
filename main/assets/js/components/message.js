import Vue from "vue";
import {store} from '../store';

Vue.component('message', {
    store,
    'props': {
        message: {
            type: Object,
        }
    },
    computed: {
        user_id: function () {
            return this.$store.getters.user.id;
        }
    },
    template: `
        <div
            v-bind:class="[
                'message',
                {
                    'message-self': (message.sender_id == user_id),
                }
            ]"
        >
            {{message.text}}
        </div>
    `
});
