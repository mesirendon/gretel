<template>
  <div class="trips">
    <h1><i class="fas fa-map-marked-alt"></i> Mis viajes</h1>
    <div v-if="route === 'trips'">
      <ul>
        <li class="trip-list" v-for="(trip, idx) in trips" :key="idx">
          <router-link :to="{name: 'trip-detail', params: {transporter: id, trip}}">
            <i class="fas fa-road"></i> {{trip | humanize}}
          </router-link>
        </li>
      </ul>
    </div>
    <trip-detail :transporter="transporter" :trip="trip" v-else>
    </trip-detail>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import moment from 'moment';
  import TripDetail from '@/components/trips/Detail';

  export default {
    name: 'Trips',
    props: {
      transporter: {
        type: String,
        default: null,
        required: false,
      },
      trip: {
        type: String,
        default: null,
        required: false,
      },
    },
    data() {
      return {
        trips: [],
      }
    },
    methods: {
      getTrips() {
        let self = this;
        this.$firebase.firestore()
          .collection('trips').doc(this.id)
          .collection('trips')
          .get()
          .then(doc => {
            self.trips = [];
            doc.forEach(t => {self.trips.push(t.id)})
          })
      },
    },
    computed: {
      ...mapState({
        id: state => state.Session.id,
        route: state => state.route.name,
      }),
    },
    filters: {
      humanize(date) {
        return moment.unix(date).format('YYYY-MM-DD hh:mm:ss');
      },
    },
    components: {
      TripDetail,
    },
    mounted() {
      this.getTrips();
    }
  }
</script>

<style scoped lang="scss">
  .trip-list {
    list-style: none;
    font-size: 25px;
  }
</style>
