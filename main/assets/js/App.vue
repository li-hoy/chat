<script>
import {mapGetters} from 'vuex';
import {store} from './store.js';

export default {
    store,
    created: function () {
        this.$store.dispatch('loadCommon');
    },
    computed: {
        ...mapGetters(['user']),
        user_id: function () {
            return this.user ? this.user.id : 0;
        },
        user_name: function () {
            return this.user ? this.user.name : '';
        },
        csrf: function() {
            return document.querySelector('[name=csrfmiddlewaretoken]').value;
        },
    },
}
</script>

<template>
    <div id="app">
        <header>
            <router-link id="logo-link" :to="{name: 'main'}">
                <div id="logo" class="panel">C h a T</div>
            </router-link >
            <div id="user">
                <router-link
                    id="user_name"
                    :to="{
                        name: 'user_page',
                        params: {
                            user_id: user_id,
                        }
                    }"
                >
                    {{ user_name }}
                </router-link >
                <form name="user" action="/users/logout/" method="post" class="login-form">
                    <input type="hidden" name="csrfmiddlewaretoken" :value="csrf"/>
                    <input type="hidden" id="user_id" name="user_id" :value="user_id"/>
                    <button type="submit">Выйти</button>
                </form>
            </div>
        </header>
        <main>
            <router-view/>
        </main>
        <footer></footer>
    </div>
</template>

<style lang="scss">
</style>