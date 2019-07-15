<template>
  <ModalStack class="modal-container">
    <GridLayout class="modal cargo" columns="*" rows="auto, auto, auto, auto, auto, auto, auto">
      <GridLayout col="0" row="0" columns="auto, *" rows="*" class="title">
        <Label class="fas cell" :text="String.fromCharCode(0xf4de)" col="0" row="0"/>
        <Label class="cell" textWrap="true" text="Nueva carga" col="1" row="0"/>
      </GridLayout>
      <Label class="fas" :text="`${String.fromCharCode(0xf183)} Código del productor`" col="0"
             row="1"/>
      <TextField v-model="producer" hint="Ej, BAR342" col="0" row="2"/>
      <Label class="fas" :text="`${String.fromCharCode(0xf1b3)} Bultos`" col="0" row="3"/>
      <TextField v-model="amount" hint="Ej, 25" col="0" row="4" keyboardType="number"/>
      <Label class="fas"
             :text="`${String.fromCharCode(0xf3c5)} Ubicación: Latitud: ${lat} | Longitud: ${lng}`"
             col="0" row="5" textWrap="true"/>
      <Button class="fas" :text="`${String.fromCharCode(0xf382)} Guardar carga`" col="0" row="6"
              @tap="save" v-if="showSaveButton"/>
    </GridLayout>
  </ModalStack>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  import {
    isEnabled,
    enableLocationRequest,
    getCurrentLocation,
    watchLocation,
    distance,
    clearWatch
  } from "nativescript-geolocation";

  @Component({})
  export default class NewCargo extends Vue {
    @Prop() cargo: Object;
    @Prop() trip: String;
    showSaveButton = true;
    transporter = 'ygf9ag5oheZqME2PxIsP';
    producer = null;
    amount = null;
    lat = 4;
    lng = -72;

    save() {
      let self = this;
      this.$firebase.firestore
        .collection('cargo').doc(this.transporter)
        .collection('cargo').doc(this.trip)
        .get()
        .then(cargo => {
          let c = cargo.data();
          c[Object.keys(c).length] = {
            producer: self.producer,
            amount: parseInt(self.amount),
            position: {
              lat: self.lat,
              lng: self.lng,
            },
          };
          return c;
        })
        .then(newCargo => self.$firebase.firestore
          .collection('cargo').doc(self.transporter)
          .collection('cargo').doc(self.trip)
          .set(newCargo)
        )
        .then(() => {
          self.showSaveButton = false;
        })
        .catch(console.error);
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

<style scoped>

</style>
