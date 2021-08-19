<template>
  <div id="app">
    <v-app>
      <router-view />
      <success-message />
      <error-message />
      <loading-screen />
    </v-app>
  </div>
</template>
<script>
import SuccessMessage from "@/components/common/successMessage";
import ErrorMessage from "@/components/common/errorMessage";
import LoadingScreen from "@/components/common/loadingScreen";
export default {
  components: {
    SuccessMessage,
    ErrorMessage,
    LoadingScreen,
  },
};
</script>
<style lang="scss">
</style>
