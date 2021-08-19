<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12">
        <v-img
          v-if="this.isWhatsappRestarted"
          class="fadeIn first circular mt-3"
          aspect-ratio="4"
          contain
          :src="whatsappQr"
        ></v-img>
      </v-col>
      <v-col cols="12" sm="12" class="text-center">
        <v-btn
          @click="restartWhatsappSession"
          :loading="!this.isWhatsappRestarted"
          color="error"
          >Reiniciar sesión</v-btn
        >
        <v-btn class="ml-2" @click="refresh" color="secondary"
          >Refrescar QR</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { format } from "date-fns";
import Agentes from "@/classes/Agentes";
import whatsapp from "@/services/api/whatsapp";
export default {
  components: {},
  filters: {
    formatDate: function (value) {
      return format(new Date(value), "dd/MM/yyyy");
    },
  },
  data: () => ({
    page: 1,
    pageCount: 0,
    loadingButton: false,
    search: "",
    dialog: false,
    paises: ["Peru", "Chile", "Colombia"],
    headers: [
      {
        text: "Nombres",
        align: "left",
        sortable: false,
        value: "nombre",
      },
      {
        text: "Apellidos",
        align: "left",
        sortable: false,
        value: "apellido",
      },
      {
        text: "Email",
        align: "left",
        sortable: true,
        value: "email",
      },
      {
        text: "Locación",
        align: "left",
        sortable: true,
        value: "locacionId.nombre",
      },
      {
        text: "Agregado",
        align: "left",
        sortable: true,
        value: "createdAt",
      },
      { text: "Acciones", value: "action", sortable: false },
    ],
    agentes: [],
    editedIndex: -1,
    editedItem: Agentes(),
    defaultItem: Agentes(),
    locaciones: [],
    isWhatsappRestarted: true,
    whatsappQr: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo agente" : "Editar agente";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  async mounted() {
    this.initialize();
    // consultando qr whatsapp x seg
    // let whatsapp = true;
    // while (whatsapp) {
    //   this.isWhatsappRestarted = false;
    //   await this.timeout(500);
    //   this.isWhatsappRestarted = true;
    // }
  },

  methods: {
    timeout(millis) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, millis);
      });
    },
    async refresh() {
      this.isWhatsappRestarted = false;
      await this.timeout(50);
      this.isWhatsappRestarted = true;
    },
    async restartWhatsappSession() {
      this.isWhatsappRestarted = false;
      await whatsapp.restartWhatsapp();
      this.isWhatsappRestarted = true;
      await this.timeout(500);
      this.refresh();
    },
    initialize() {
      // inicializando qr whatsapp
      // this.whatsappQr = "http://localhost:3000/whatsappqr.png";
      this.whatsappQr = "http://todo-full.digital/whatsappqr.png";
    },
    editItem(item) {
      this.editedIndex = this.agentes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      const index = this.agentes.indexOf(item);
      let itemId = this.agentes[index]._id;
      if (await this.$confirm("¿Realmente deseas eliminar este registro?")) {
        await this.$store.dispatch("agentesModule/delete", itemId);
        this.agentes.splice(index, 1);
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    async save() {
      this.loadingButton = true;
      if (this.editedIndex > -1) {
        let itemId = this.agentes[this.editedIndex]._id;
        try {
          await this.$store.dispatch("agentesModule/update", {
            id: itemId,
            data: this.editedItem,
          });
          Object.assign(this.agentes[this.editedIndex], this.editedItem);
          this.close();
        } finally {
          this.loadingButton = false;
        }
      } else {
        //create item
        try {
          let newItem = await this.$store.dispatch(
            "agentesModule/create",
            this.editedItem
          );
          this.agentes.push(newItem);
          this.close();
        } finally {
          this.loadingButton = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
