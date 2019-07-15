<template>
  <Page actionBarHidden="true">
    <GridLayout columns="*" rows="auto, *">
      <GridLayout col="0" row="0" columns="auto, *" rows="*" class="title">
        <Label class="fas cell" :text="String.fromCharCode(0xf043)" col="0"/>
        <Label class="cell" textWrap="true" text="Mis Dispositivos" col="1" row="0"/>
      </GridLayout>
      <ListView col="0" row="1" v-if="devices" for="device in devices">
        <v-template>
          <GridLayout columns="auto, auto" rows="auto, auto, auto, auto">
            <Label col="0" row="0" class="fas cell" :text="String.fromCharCode(0xf043)"/>
            <Label col="1" row="0" class="cell" :text="device.id"/>
            <Label col="0" row="1" class="fas cell" :text="String.fromCharCode(0xf3c5)"/>
            <Label col="1" row="1" class="cell" :text="`Lat: ${device.device.position.lat} | Lng: ${device.device.position.lng}`"/>
            <Label col="0" row="2" class="fas cell" :text="String.fromCharCode(0xf241)"/>
            <Label col="1" row="2" class="cell" :text="`${device.device.battery}%`"/>
            <Label col="0" row="3" class="fas cell" :text="String.fromCharCode(0xf018)"/>
            <Label col="1" row="3" class="cell" :text="`${device.device.trips.length} ${device.device.trips.length === 1 ? 'viaje' : 'viajes'}`"/>
          </GridLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({})
  export default class Devices extends Vue {
    transporter = 'ygf9ag5oheZqME2PxIsP';
    devices = null;

    created() {
      let self = this;
      this.$firebase.firestore
        .collection('devices').doc(this.transporter)
        .get()
        .then(devices => {
          self.devices = [];
          console.log(Object.keys(devices.data()));
          for (const id of Object.keys(devices.data())) {
            self.devices.push({id, device: devices.data()[id]});
          }
        });
    }
  }
</script>

<style scoped lang="scss">
  .title {
    font-size: 30;
  }
</style>
