<template>
  <v-app-bar dark app color="primary">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <span class="title ml-3 mr-5">TO DO MUJERON</span>
    <v-spacer></v-spacer>
    <v-menu v-if="$store.state.authModule.user" offset-y>
      <v-list v-for="(alertMessage, i) in $store.state.stockAlert" :key="i">
        <v-list-item>
          Tu producto {{ alertMessage.productName }} está por agortarse. (
          <strong>Stock:</strong>
          {{ alertMessage.stock }})
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn
      v-if="!$store.state.authModule.user"
      dark
      outlined
      :to="{ name: 'login' }"
      >Iniciar Sesión</v-btn
    >
    <v-menu v-if="$store.state.authModule.user" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text color="white" dark v-on="on">
          {{ user }}
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="logout">
          <v-list-item-title>Cerrar sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.toolbar.drawerIcon;
      },
      set(newValue) {
        this.$store.state.toolbar.drawerIcon = newValue;
      },
    },
    user() {
      return this.$store.state.authModule.user.email;
    },
  },
  methods: {
    logout() {
      this.$store
        .dispatch("authModule/logout")
        .then(() => {})
        .catch((err) => {
          console.log("algo salio mal en logout:", err);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
