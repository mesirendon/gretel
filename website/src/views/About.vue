<template>
  <div class="about">
    <h1><i class="fas fa-users"></i> Acerca de nosotros</h1>
    <template v-for="member in members">
      <member :member="member"></member>
    </template>
  </div>
</template>

<script>
  import _ from 'lodash';
  import Member from '@/components/about/Member';

  export default {
    name: "About",
    data() {
      return {
        membersData: [
          {
            name: 'Angel Rendón',
            roles: ['Desarrollador Web', 'Desarrollador Blockchain', 'Desarrollador Móvil', 'Dirección de equpo'],
            description: 'Estudiante de Ingeniería de Sistemas y Computación de la Universidad Nacional de Colombia, ha trabajado como desarrollador de software desde hace 15 años. Sus intereses están relacionados con la criptografía y la arquitectura de software seguro. Empieza sus estudios de maestría en la Universidad Nacional de Colombia en Ingeniería de Sistemas y Computación para desarrollar el tema de tésis en la elaboración de un modelo computacional de identidad digital usando detección de patrones de comportamiento encriptado.',
            url: 'https://firebasestorage.googleapis.com/v0/b/greteltracer.appspot.com/o/members%2Fmesi.jpg?alt=media&token=eb378a6d-3168-4641-b410-b634af23a8f0',
            alt: 'Angel Rendon',
            logo: 'fas fa-signature',
          },
          {
            name: 'Sergio Sotelo',
            roles: ['Diseñador industrial', 'Interacción con usuarios', 'Experto en usabilidad', 'Experto en experiencia de usuario'],
            description: 'Estudiante de Diseño Industrial de la Universidad Nacional de Colombia, especialista en diseño de empaques de alimentos, con diseño centrado en el usuario.',
            url: 'https://firebasestorage.googleapis.com/v0/b/greteltracer.appspot.com/o/members%2Fsergio.jpg?alt=media&token=222cdcca-7032-429f-9d4c-35fa836b86e2',
            alt: 'Sergio Sotelo',
            logo: 'fas fa-palette',
          },
          {
            name: 'Carolina Ochoa',
            roles: ['Especialista de alimentos', 'Relatoría', 'Investigación'],
            description: 'Estudiante de Ingeniería Química de la Universidad Nacional de Colombia, ha trabajado en el último año en elaboración extruidos con pulpa de fruta en polvo. Su tésis es la elaboración de una bebida de yacón endulzada con uchúa. También ha elaborado cervezas, mermeladas, una bebida fermentada similar al yogurt con pulpa de fruta y extracto de soya, pulpas y bebidas, en el último año en la planta de vegetales en el Instituto Colombiano de Tecnología de Alimentos asociado a la Facultad de Ciencias Agrarias de la Universidad Nacional de Colombia',
            url: 'https://firebasestorage.googleapis.com/v0/b/greteltracer.appspot.com/o/members%2Fcarolina.jpg?alt=media&token=ff74fc04-451a-46f2-9785-caeea449f339',
            alt: 'Carolina Ochoa',
            logo: 'fas fa-atom',
          },
          {
            name: 'Anni Piragauta',
            roles: ['Desarrolladora Web', 'Desarrolladora Blockchain', 'Bases de Datos', 'Logística'],
            description: 'Estudiante de Ingeniería de Sistemas y Computación de la Universidad Nacional de Colombia, ha trabajado en proyectos que involucran la tecnología blockchain y sus intereses están relacionados con las bases de datos y el aprendizaje maquinal.',
            url: 'https://firebasestorage.googleapis.com/v0/b/greteltracer.appspot.com/o/members%2Fanni.jpg?alt=media&token=f67b3951-06a3-4d57-870b-b5a6549a98c7',
            alt: 'Anni Piragauta',
            logo: 'fas fa-database',
          },
        ],
      }
    },
    computed: {
      members() {
        return _.shuffle(this.membersData);
      }
    },
    components: {
      Member
    },
  }
</script>

<style scoped>

</style>
