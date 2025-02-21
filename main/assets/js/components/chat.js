import Vue from 'vue'
import {mapGetters} from 'vuex';
import {store} from '../store';
import './message';

Vue.component('chat', {
    store,
    data: function () {
        return {
            message: '',
        };
    },
    methods: {
        send: function ($event) {
            const message = $event.target
                .parentElement
                .querySelector('input')
                .value;
            
            this.message = '';

            this.$store.dispatch('sendMessage', message);
        },
    },
    computed: {
        ...mapGetters(['current_recipient_id']),
        is_send_button_disabled: function () {
            return (this.message === '' || this.current_recipient_id < 1);
        },
        message_feed: function () {
            return this.$store.getters.chats[this.current_recipient_id];
        },
        user_id: function () {
            return this.$store.getters.user.id;
        }
    },
    template: `
        <div id="chat">
            <div id="message-feed">
                <message
                    v-for="message in message_feed"
                    :key="message.date"
                    :message="message"
                />
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
