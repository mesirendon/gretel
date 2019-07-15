<template>
  <div v-if="td">
    <router-link :to="{name: 'trips'}">
      <i class="fas fa-arrow-circle-left"></i> Regresar
    </router-link>
    <gmap-map :center="{ lat: 4.598112, lng: -74.076041 }" :zoom="10"
              style="width: 100%; height: 400px">
      <gmap-marker :position="m.position" :draggable="false" v-for="m in td" :key="m.id"
                   :label="`H: ${m.humidity} | T: ${m.temperature}`">
      </gmap-marker>
    </gmap-map>
    <h2><i class="fas fa-chart-area"></i> Comportamiento</h2>
    <h3><i class="fas fa-tint"></i> Humedad</h3>
    <GChart type="AreaChart" :data="humidity" :options="humidityOptions"/>
    <h3><i class="fas fa-temperature-high"></i> Temperatura</h3>
    <GChart type="AreaChart" :data="temperature" :options="temperatureOptions"/>
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
        <th scope="row">{{idx}}</th>
        <td>{{c.producer}}</td>
        <td>{{c.amount}}</td>
        <td>Lat: {{c.position.lat}} | Lng: {{c.position.lng}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import {GChart} from 'vue-google-charts';

  export default {
    name: "Detail",
    props: {
      transporter: {
        type: String,
        required: true,
      },
      trip: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        td: null,
        cargo: null,
        humidityOptions: {
          title: 'Humedad',
          colors: ['green'],
          vAxis: {
            title: '%',
            minValue: 0,
          },
          hAxis: {
            title: 'Muestra',
          },
        },
        temperatureOptions: {
          title: 'Temperatura',
          colors: ['red'],
          vAxis: {
            title: 'ºC',
          },
          hAxis: {
            title: 'Muestra',
          },
        },
      }
    },
    methods: {
      tripData() {
        let self = this;
        this.$firebase.firestore()
          .collection('trips').doc(this.transporter)
          .collection('trips').doc(this.trip)
          .onSnapshot(t => {
            self.td = [];
            for (const k in Object.keys(t.data())) {
              self.td.push(t.data()[k]);
            }
          });
      },
      getCargo() {
        let self = this;
        this.$firebase.firestore()
          .collection('cargo').doc(this.transporter)
          .collection('cargo').doc(this.trip)
          .onSnapshot(doc => {
            self.cargo = doc.data();
          });
      },
    },
    computed: {
      humidity() {
        let d = this.td.map((data, idx) => {
          const {humidity} = data;
          return [idx, humidity];
        });
        d.splice(0, 0, ['Numero', 'Humedad']);
        return d;
      },
      temperature() {
        let d = this.td.map((data, idx) => {
          const {temperature} = data;
          return [idx, temperature];
        });
        d.splice(0, 0, ['Numero', 'Temperatura']);
        return d;
      },
    },
    components: {
      GChart,
    },
    created() {
      this.tripData();
      this.getCargo()
    }
  }
</script>

<style scoped>

</style>
