<template>
  <Page actionBarHidden="true">
    <GridLayout columns="*" rows="auto, auto, auto, auto">
      <GridLayout col="0" row="0" columns="auto, *" rows="*" class="title">
        <Image src="~/assets/images/icon.png" col="0" row="0"/>
        <Label textWrap="true" text="Gretel Trazabilidad de Alimentos" col="1" row="0" class="title-text"/>
      </GridLayout>
      <Button class="fas" :text="`${String.fromCharCode(0xf5a0)} Mis viajes`" @tap="toTrips" col="0" row="1"/>
      <Button class="fas" :text="`${String.fromCharCode(0xf043)} Mis Dispositivos`" @tap="toDevices" col="0" row="2"/>
      <Button class="fas" :text="`${String.fromCharCode(0xf48e)} Simular Dispositivo`" @tap="toSimulate" col="0" row="3"/>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import Trips from './trips/Trips.vue';
  import Devices from './devices/Devices.vue';
  import Simulate from './devices/Simulate.vue';

  @Component({})
  export default class App extends Vue {
    toTrips() {
      this.$navigateTo(Trips);
    }
    toDevices(){
      this.$navigateTo(Devices);
    }
    toSimulate() {
      this.$navigateTo(Simulate);
    }
  }
</script>

<style scoped lang="scss">
</style>
