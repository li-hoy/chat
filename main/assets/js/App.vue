<script>
import Contacts from './components/Contacts.vue';
import Chat from './components/Chat.vue';

export default {
    el: '#app',
    components: {
        Chat,
        Contacts
    }
}
</script>

<template>
    <div id="app">
        <Chat />
        <Contacts />
    </div>
</template>

<style lang="scss">
h1 {
    color: red;
}
</style>