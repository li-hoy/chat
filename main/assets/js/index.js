
import Vue from 'vue'
import './components/chat';
import './components/contacts';

const app = new Vue({
    el: '#app',
    template: `
        <div id="app">
            <chat />
            <contacts />
        </div>
    `
});