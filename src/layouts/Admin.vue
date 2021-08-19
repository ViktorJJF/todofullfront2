<template>
  <v-app id="keep">
    <toolbar />
    <drawer />
    <v-main v-if="isDataReady">
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-main>
    <v-overlay :value="overlay">
      <v-progress-circular
        :size="70"
        :width="3"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <p class="ml-n3">{{ overlayText }}</p>
    </v-overlay>
  </v-app>
</template>

<script>
import toolbar from "@/components/core/Toolbar";
import drawer from "@/components/core/Drawer";
export default {
  components: {
    toolbar,
    drawer,
  },
  props: {
    source: String,
  },
  data: () => ({
    isDataReady: false,
  }),
  computed: {
    overlay() {
      return this.$store.state.overlay.active;
    },
    overlayText() {
      return this.$store.state.overlay.text;
    },
  },
  mounted() {
    this.initialData();
  },
  methods: {
    async initialData() {
      this.$store.dispatch("showOverlay");
      await Promise.all([
        this.$store.dispatch("equipoDeVentasModule/list"),
        this.$store.dispatch("locacionesModule/list"),
        this.$store.dispatch("agentesModule/list"),
        this.$store.dispatch("telefonosModule/list"),
        this.$store.dispatch("botsModule/list"),
        this.$store.dispatch("woocommercesModule/list"),
        this.$store.dispatch("brandsModule/list"),
        this.$store.dispatch("categoriesModule/list"),
        this.$store.dispatch("ecommercesCategoriesModule/list"),
        this.$store.dispatch("ecommercesAttributesModule/list"),
        this.$store.dispatch("ecommercesTagsModule/list"),
        this.$store.dispatch("todofullLabelsModule/list"),
      ]);
      //   //count orders
      //   await this.$store.dispatch("countOrders");
      //   //count purchases
      //   await this.$store.dispatch("countPurchases");
      this.isDataReady = true;
      this.$store.dispatch("showOverlay", false);
      //   this.$store.dispatch("showSnackbar", {
      //     text: "Bienvenido",
      //     color: "success",
      //   });
    },
  },
};
</script>

<style></style>
