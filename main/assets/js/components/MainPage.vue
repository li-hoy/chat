<script>
    import Chat from "./Chat.vue";
    import Contacts from "./Contacts.vue";

    export default {
        components: {
            Chat,
            Contacts
        }
    }
</script>

<template>
    <div class="page">
        <Chat />
        <Contacts />
    </div>
</template>
