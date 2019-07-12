<template>
  <div class="trips">
    <h1><i class="fas fa-map-marked-alt"></i> Mis viajes</h1>
    <div v-if="trip">
      <button class="btn" type="button" @click="trip = null"><i class="fas fa-arrow-circle-left"></i> Regresar</button>
      <gmap-map :center="{ lat: 4.598112, lng: -74.076041 }" :zoom="10" style="width: 100%; height: 400px">
        <gmap-marker :position="m.position" :draggable="false" v-for="m in trip" :key="m.id" :label="`H: ${m.humidity} | T: ${m.temperature}`">
        </gmap-marker>
      </gmap-map>
      <h2><i class="fas fa-truck-moving"></i> Información de la carga</h2>
      <table class="table table-hover">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">ID del Productor</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Ubicación</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(c, idx) in cargo" :key="idx">
          <th scope="row">{{idx + 1}}</th>
          <td>{{c.producer}}</td>
          <td>{{c.amount}}</td>
          <td>Lat: {{c.position.lat}} | Lng: {{c.position.lng}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <ul>
        <li v-for="(trip, idx) in trips" :key="idx" @click="setTrip(trip, idx)">
          {{idx | humanize}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import moment from 'moment';

  export default {
    name: 'Trips',
    data() {
      return {
        trip: null,
        cargo: null,
        trips: []
      }
    },
    methods: {
      getTrips() {
        let self = this;
        this.$firebase.firestore().collection('trips').doc(this.id).get().then(doc => {
          self.trips = doc.data();
        })
      },
      setTrip(trip, idx) {
        this.trip = trip;
        this.getCargo(idx);
      },
      getCargo(idx) {
        let self = this;
        this.$firebase.firestore().collection('cargo').doc(this.id).get().then(doc => {
          self.cargo = doc.data()[idx];
        })
      },
    },
    computed: {
      ...mapState({
        id: state => state.Session.id,
      })
    },
    filters: {
      humanize(date) {
        return moment.unix(date).format('YYYY-MM-DD hh:mm:ss');
      },
    },
    mounted() {
      this.getTrips();
    }
  }
</script>
