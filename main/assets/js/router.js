import Vue from "vue"
import VueRouter from "vue-router"
import MainPage from "./components/MainPage.vue"
import UserPage from "./components/UserPage.vue"

Vue.use(VueRouter);

const routes = [
    { path: '/', name: 'main', component: MainPage },
    { path: '/user/:user_id', name: 'user_page', component: UserPage},
];

export default new VueRouter({ routes });
