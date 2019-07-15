<template>
  <GridLayout col="0" row="1" columns="*" rows="auto, *, auto" v-if="cargo">
    <GridLayout col="0" row="0" columns="auto, *" rows="*" class="title">
      <Label class="fas cell" :text="`${String.fromCharCode(0xf4df)}`" col="0" row="0"/>
      <Label class="cell" textWrap="true" text="Cargas en este viaje" col="1" row="0"/>
    </GridLayout>
    <ListView col="0" row="1" for="carga in cargoData">
      <v-template>
        <GridLayout columns="auto, *, *, *, *" rows="*">
          <Label class="fas cell" :text="`${String.fromCharCode(0xf1b2)}`" col="0"/>
          <Label class="cell" :text="carga.amount" col="1"/>
          <Label class="cell" :text="carga.producer" col="2"/>
          <Label class="cell" :text="carga.position.lat" col="3"/>
          <Label class="cell" :text="carga.position.lng" col="4"/>
        </GridLayout>
      </v-template>
    </ListView>
    <Button class="fas" :text="`${String.fromCharCode(0xf4de)} Nueva carga`" col="0" row="2"
            @tap="newCargo"/>
  </GridLayout>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import NewCargo from './NewCargo.vue';

  @Component({})
  export default class Cargo extends Vue {
    @Prop() cargo: Object;
    @Prop() trip: String;

    get cargoData() {
      return Object.keys(this.cargo).map(key => this.cargo[key]);
    }

    newCargo() {
      this.$showModal(NewCargo, {
        props: {
          cargo: this.cargoData,
          trip: this.trip,
        }
      });
    }
  }
</script>

<style scoped>

</style>
