<template>
  <div id="app">
    <navbar></navbar>
    <router-view class="container"/>
  </div>
</template>

<script>
  import Navbar from './components/menu/Navbar';

  export default {
    name: 'App',
    components: {
      Navbar,
    },
  }
</script>

<style lang="scss">
  @import '../node_modules/bootstrap/scss/bootstrap.scss';
  @import url('https://fonts.googleapis.com/css?family=Montserrat|Rajdhani');

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Rajdhani', sans-serif;
    margin: 20px 0;
    color: #101010;
  }

  body {
    font-family: 'Montserrat', sans-serif;
    overflow-y: scroll;
  }
</style>
