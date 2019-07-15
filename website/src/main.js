import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import {sync} from 'vuex-router-sync';
import * as firebase from 'firebase/app';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueGoogleCharts from 'vue-google-charts';
import './registerServiceWorker';

import {firebaseConfig, key} from './config';
require('firebase/firestore');

Vue.use(VueGoogleCharts);
Vue.use(VueGoogleMaps, {
  installComponents: true,
  load: {
    key,
  },
});

firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;

Vue.prototype.$firebase = firebase;

sync(store, router);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
