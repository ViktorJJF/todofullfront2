<template>
  <v-snackbar
    shaped
    v-model="showSuccessMessage"
    color="success"
    bottom
    :timeout="successMessageTimeout"
  >
    {{ successMessage }}
    <template v-slot:action>
      <v-btn text @click="showSuccessMessage = false">
        <v-icon large>mdi-close-circle</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "SuccessMessage",
  computed: {
    showSuccessMessage: {
      get() {
        return this.$store.state.successModule.showSuccessMessage;
      },
      set(value) {
        this.$store.commit("successModule/showSuccess", value);
      },
    },
    successMessage() {
      return this.$store.state.successModule.successMessage;
    },
    successMessageTimeout() {
      return this.$store.state.successModule.successMessageTimeout;
    },
  },
  watch: {
    successMessage() {
      setTimeout(() => {
        this.showSuccessMessage = this.successMessage !== "";
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>