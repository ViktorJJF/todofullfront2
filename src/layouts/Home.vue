<template>
  <div>
    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageBg: "/images/loginbg.jpg",
    };
  },
};
</script>

<style lang="scss" scoped>
</style>