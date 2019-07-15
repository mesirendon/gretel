import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/trips',
      name: 'trips',
      component: () => import(/* webpackChunkName: "trips" */ '../views/Trips.vue'),
    },
    {
      path: '/trips/:transporter/:trip',
      name: 'trip-detail',
      props: true,
      component: () => import(/* webpackChunkName: "trips" */ '../views/Trips.vue'),
    },
    {
      path: '/devices',
      name: 'devices',
      component: () => import(/* webpackChunkName: "devices" */ '../views/Devices.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    },
  ],
});
