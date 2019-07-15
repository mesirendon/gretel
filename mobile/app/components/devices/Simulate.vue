<template>
  <Page actionBarHidden="true">
    <GridLayout columns="auto, *" rows="auto, auto, auto, auto, auto, auto, auto, auto">
      <GridLayout col="0" row="0" columns="auto, *" rows="*" class="title" colSpan="2">
        <Label class="fas cell" :text="String.fromCharCode(0xf48e)" col="0" row="0"/>
        <Label class="cell" textWrap="true" text="Simular Dispositivo" col="1" row="0"/>
      </GridLayout>
      <Label col="0" row="1" class="fas cell" :text="String.fromCharCode(0xf2c9)"/>
      <Label col="1" row="1" class="cell" text="Temperatura"/>
      <TextField col="0" row="2" colSpan="2" v-model="temperature" hint="Ej, 26"
                 keyboardType="number"/>
      <Label col="0" row="3" class="fas cell" :text="String.fromCharCode(0xf043)"/>
      <Label col="1" row="3" class="cell" text="Humedad"/>
      <TextField col="0" row="4" colSpan="2" v-model="humidity" hint="Ej, 34"
                 keyboardType="number"/>
      <Label col="0" row="5" class="fas cell" :text="String.fromCharCode(0xf3c5)"/>
      <Label col="1" row="5" class="cell" text="Ubicación"/>
      <Label col="0" row="6" colSpan="2" class="cell center"
             :text="`Latitud: ${lat} | Longitud: ${lng}`"/>
      <Button col="0" row="7" colSpan="2" class="fas"
              :text="`${String.fromCharCode(0xf382)} Guardar lectura`"
              @tap="save"/>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import App from '../App.vue';
  import {Component, Vue} from 'vue-property-decorator';
  import {
    isEnabled,
    enableLocationRequest,
    getCurrentLocation,
    watchLocation,
    distance,
    clearWatch
  } from "nativescript-geolocation";

  @Component({})
  export default class Simulate extends Vue {
    transporter = 'ygf9ag5oheZqME2PxIsP';
    trip = '1562893440';
    lat = 4;
    lng = -74;
    temperature = null;
    humidity = null;

    save() {
      let self = this;
      this.$firebase.firestore
        .collection('trips').doc(this.transporter)
        .collection('trips').doc(self.trip)
        .get()
        .then(trip => {
          let t = trip.data();
          t[Object.keys(t).length] = {
            humidity: self.humidity,
            temperature: self.temperature,
            position: {
              lat: parseFloat(self.lat.toString()),
              lng: parseFloat(self.lng.toString()),
            },
          };
          return t;
        })
        .then(newReading => self.$firebase.firestore
          .collection('trips').doc(self.transporter)
          .collection('trips').doc(self.trip)
          .set(newReading)
        )
        .catch(console.error);
      this.$navigateTo(App)
    }

    created() {
      let self = this;
      isEnabled()
        .then(isEnabled => {
          if (!isEnabled)
            return enableLocationRequest()
        })
        .then(() => getCurrentLocation({
          desiredAccuracy: 3,
          updateDistance: 10,
          maximumAge: 20000,
          timeout: 20000
        }))
        .then(location => {
          self.lat = location.latitude;
          self.lng = location.longitude;
        })
        .catch(console.error);
    }
  }
</script>

<style scoped lang="scss">
  .title {
    font-size: 30;
  }

  .center {
    horizontal-align: center;
  }
</style>
