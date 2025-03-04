<script>
import {mapGetters} from 'vuex';
import {store} from '../store';

export default {
    store,
    'props': {
        contact: {
            type: Object,
        }
    },
    computed: {
        ...mapGetters(['current_recipient_id']),
    }
}
</script>

<template>
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
</template>

<style scoped>

</style>