<script>
import {store} from '../store';

export default {
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
}
</script>

<template>
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
</template>

<style scoped>

</style>