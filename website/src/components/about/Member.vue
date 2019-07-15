<template>
  <div class="member row align-items-center">
    <img :src="member.url" :alt="member.alt" class="col-sm img-fluid rounded-circle">
    <div class="col-10">
      <div>
        <i :class="member.logo"></i> {{member.name}}
      </div>
      <div>
        <i class="fas fa-bars"></i> {{member.description}}
      </div>
      <div>
        <i class="fas fa-user-ninja"></i>
        <template v-for="skill in member.roles">
          <span class="badge badge-pill badge-info">{{skill}}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Member",
    props: {
      member: {
        type: Object,
        required: true,
      }
    }
  }
</script>

<style scoped lang="scss">
  .member {
    padding: 10px;
    img {
      width: 200px;
    }
  }
  .badge {
    padding: 5px;
    margin: 5px;
  }
</style>
