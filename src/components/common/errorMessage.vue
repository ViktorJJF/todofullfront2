<template>
  <v-container v-show="showErrorMessage">
    <v-layout>
      <v-flex>
        <v-snackbar shaped v-model="showErrorMessage" color="error" multi-line bottom :timeout="0">
          <ul>
            <li v-for="(item, index) in error" :key="index">{{ item }}</li>
          </ul>
          <template v-slot:action>
            <v-btn text @click="showErrorMessage = false">
              <v-icon large>mdi-close-circle</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { formatErrorMessages } from "@/utils/utils.js";

export default {
  name: "ErrorMessage",
  computed: {
    showErrorMessage: {
      get() {
        return this.$store.state.errorModule.showErrorMessage;
      },
      set(value) {
        this.$store.commit("errorModule/showError", value, { root: true });
      },
    },
    error() {
      return formatErrorMessages(
        "errors",
        this.$store.state.errorModule.errorMessage
      );
    },
  },
  watch: {
    error() {
      setTimeout(() => {
        this.showErrorMessage = this.error !== null;
      }, 100);
    },
  },
};
</script>
