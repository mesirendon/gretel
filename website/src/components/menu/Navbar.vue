<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link :to="{name: 'home'}" class="navbar-brand">
      <img src="/favicon-96x96.png" width="30" height="30" alt="Gretel"> Gretel
    </router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse"
            data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
            aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link :to="{name: 'trips'}" class="nav-link"><i class="fas fa-map-marked-alt"></i> Mis viajes</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name: 'devices'}" class="nav-link"><i class="fas fa-boxes"></i> Mis dispositivos</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name: 'about'}" class="nav-link"><i class="fas fa-users"></i> Acerca de nosotros</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  export default {
    name: "Navbar"
  }
</script>

<style scoped>

</style>
