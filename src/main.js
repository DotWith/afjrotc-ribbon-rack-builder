import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

import HomeView from './HomeView.vue';
import AJROTCView from './AJROTCView.vue';
import AFJROTCView from './AFJROTCView.vue';

const routes = [
  { path: '/rrb-builder/', component: HomeView },
  { path: '/rrb-builder/ajrotc', component: AJROTCView },
  { path: '/rrb-builder/afjrotc', component: AFJROTCView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
