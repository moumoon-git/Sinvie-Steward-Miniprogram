import {
    createApp
} from 'vue';
import App from './App.vue';
import store from './store'
import http from '@/utils/request/request.js';
import config from '@/static/config/index.js'

const app = createApp(App);
app.config.globalProperties.$http = http;
app.config.globalProperties.$imgStaticUrl = config.imgStaticUrl;
app.use(store).mount();
