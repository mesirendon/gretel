<template>
  <Page actionBarHidden="true">
    <GridLayout columns="*" rows="auto, *">
      <GridLayout col="0" row="0" columns="auto, *" rows="*" class="title">
        <Label class="fas cell" :text="`${String.fromCharCode(0xf5a0)}`" col="0" row="0"/>
        <Label class="cell" textWrap="true" text="Mis Viajes" col="1" row="0"/>
      </GridLayout>
      <Cargo col="0" row="1" v-if="cargo" :cargo="cargo" :trip="selectedTrip"></Cargo>
      <GridLayout col="0" row="1" columns="*" rows="auto, *" v-else>
        <Button class="fas" :text="`${String.fromCharCode(0xf005)} Nuevo viaje`" @tap="newTrip"
                col="0" row="0"/>
        <ListView col="0" row="1" for="trip in trips" v-if="trips">
          <v-template>
            <GridLayout columns="auto, *" rows="*" @tap="loadTrip(trip)">
              <Label class="fas cell" :text="`${String.fromCharCode(0xf018)}`" col="0"/>
              <Label class="cell" :text="humanize(trip)" col="1"/>
            </GridLayout>
          </v-template>
        </ListView>
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import moment from 'moment';
  import Cargo from './Cargo.vue';

  @Component({
    components: {
      Cargo,
    }
  })
  export default class Trips extends Vue {
    transporter = 'ygf9ag5oheZqME2PxIsP';
    selectedTrip = null;
    trips = null;
    cargo = null;

    newTrip() {
      console.log('New trip');
    }

    loadTrip(selectedTrip) {
      let self = this;
      this.selectedTrip = selectedTrip;
      this.$firebase.firestore
        .collection('cargo').doc(this.transporter)
        .collection('cargo').doc(selectedTrip)
        .onSnapshot(cargo => {
          self.cargo = cargo.data();
        })
    }

    humanize(date) {
      return moment.unix(date).format('YYYY-MM-DD hh:mm:ss');
    }

    created() {
      let self = this;
      this.$firebase.firestore
        .collection('trips').doc(this.transporter)
        .collection('trips')
        .get().then(result => {
          let tripIds = [];
          result.forEach(trip => tripIds.push(trip.id));
          this.trips = tripIds;
        });
    }
  }
</script>

<style scoped lang="scss">
  .title {
    font-size: 30;
  }
</style>
