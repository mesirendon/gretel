<template>
  <div class="devices">
    <h1><i class="fas fa-boxes"></i> Mis dispositivos</h1>
    <ul v-if="devices" class="list">
      <li v-for="(d, idx) in devices" :key="idx">
        <h3><i class="fas fa-tint"></i> {{idx}}</h3>
        <div class="info">
          <p>{{d.battery * 100}}% <i class="fas fa-battery-three-quarters"></i></p>
          <p>Lat: {{d.position.lat}} - Lng: {{d.position.lng}} <i class="fas fa-globe-americas"></i>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: "Devices",
    data() {
      return {
        devices: null,
      }
    },
    computed: {
      ...mapState({
        id: state => state.Session.id,
      }),
    },
    methods: {
      getDevices() {
        let self = this;
        this.$firebase.firestore().collection('devices').doc(this.id).get().then(doc => {
          self.devices = doc.data();
        });
      },
    },
    mounted() {
      this.getDevices();
    },
  }
</script>

<style scoped lang="scss">
  .list {
    list-style: none;
  }

  .info {
    text-align: right;
    background: #ececec;
    padding: 15px;
  }
</style>
