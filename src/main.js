import Vue from 'vue'
import App from './App.vue'
import store from "@/store";//先引用store
import router from "@/router"; // 后引用router

import ElementUI from 'element-ui'; 
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false

Vue.use(ElementUI,{size:'small'});

import {postRequest} from './utils/api';
import {putRequest} from "./utils/api";
import {getRequest} from './utils/api';
import {deleteRequest} from "./utils/api";
import {initMenu} from "@/utils/menus";
import {downloadRequest} from '@/utils/download';


//插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest = downloadRequest;


router.beforeEach((to, from, next) => {

    if (window.sessionStorage.getItem('tokenStr')) {
        initMenu(router, store);
        if (!window.sessionStorage.getItem('user')) {
            return getRequest('/admin/info').then(resp => {
                if (resp) {
                    //存入用户消息
                    window.sessionStorage.setItem('user', JSON.stringify(resp))
                    store.commit('INIT_ADMIN',resp)
                    next(to, from, next);
                }
            })
        }
        next();
    } else {
        if (to.path == '/') {
            next();
        } else {
            next('/?redirect=' + to.path);
        }

    }
})


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
