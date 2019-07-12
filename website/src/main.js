import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import {sync} from 'vuex-router-sync';
import * as firebase from 'firebase/app';
import * as VueGoogleMaps from 'vue2-google-maps';
import './registerServiceWorker';

import {firebaseConfig} from './config';
require('firebase/firestore');

Vue.use(VueGoogleMaps, {
  installComponents: true,
  load: {
    key: 'AIzaSyBado9Pu3BiTxjPxl2touV6CytAlc8hB00',
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
