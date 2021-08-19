<template>
  <v-container>
    <v-row justify="center">
      <material-card
        width="90%"
        icon="mdi-cellphone-dock"
        color="primary"
        title="Woocommerces"
        text="Tabla resumen de woocommerces"
      >
        <v-data-table
          no-results-text="No se encontraron resultados"
          :search="search"
          hide-default-footer
          :headers="headers"
          :items="woocommerces"
          sort-by="calories"
          @page-count="pageCount = $event"
          :page.sync="page"
          :items-per-page="$store.state.itemsPerPage"
        >
          <template v-slot:top>
            <v-container>
              <span class="font-weight-bold"
                >Filtrar por nombre: {{ search }}</span
              >
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    dense
                    hide-details
                    v-model="search"
                    append-icon="search"
                    placeholder="Escribe el dominio"
                    single-line
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark class="mb-2" v-on="on"
                        >Agregar dominio</v-btn
                      >
                    </template>
                    <v-card>
                      <v-card-title>
                        <v-icon color="primary" class="mr-1">mdi-update</v-icon>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>
                      <v-divider></v-divider>
                      <ValidationObserver ref="obs" v-slot="{ passes }">
                        <v-container class="pa-5">
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12" class="mb-3">
                              <p class="body-1 font-weight-bold ma-0">
                                Dominio
                              </p>
                              <VTextFieldWithValidation
                                rules="required"
                                v-model="editedItem.domain"
                                label="Ingresa el dominio"
                              />
                            </v-col>
                            <v-col cols="12" sm="12" md="12" class="mb-3">
                              <p class="body-1 font-weight-bold ma-0">
                                ConsumerKey
                              </p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.consumerKey"
                                label="Ingresa la llave de cliente"
                              />
                            </v-col>
                            <v-col cols="12" sm="12" md="12" class="mb-3">
                              <p class="body-1 font-weight-bold ma-0">
                                ConsumerSecret
                              </p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.consumerSecret"
                                label="Ingresa la llave secreta"
                              />
                            </v-col>
                            <!-- <v-col cols="12" sm="12" md="12">
                            <span class="font-weight-bold">Estado</span>
                            <v-select
                              hide-details
                              v-model="editedItem.status"
                              :items="[{name:'Activo',value:true},{name:'Inactivo',value:false}]"
                              item-text="name"
                              item-value="value"
                              outlined
                            ></v-select>
                            </v-col>-->
                          </v-row>
                        </v-container>
                        <v-card-actions rd-actions>
                          <div class="flex-grow-1"></div>
                          <v-btn outlined color="error" text @click="close"
                            >Cancelar</v-btn
                          >
                          <v-btn
                            :loading="loadingButton"
                            color="success"
                            @click="passes(save)"
                            >Guardar</v-btn
                          >
                        </v-card-actions>
                      </ValidationObserver>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-container>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-btn class="mr-3" small color="secondary" @click="editItem(item)"
              >Editar</v-btn
            >
            <v-btn small color="error" @click="deleteItem(item)"
              >Eliminar</v-btn
            >
          </template>
          <template v-slot:no-data>
            <v-alert type="error" :value="true"
              >Aún no cuentas con woocommerces</v-alert
            >
          </template>
          <template v-slot:[`item.createdAt`]="{ item }">{{
            item.createdAt | formatDate
          }}</template>
          <template v-slot:[`item.status`]="{ item }">
            <v-chip v-if="item.status" color="success">Activo</v-chip>
            <v-chip v-else color="error">Inactivo</v-chip>
          </template>
        </v-data-table>
        <v-col cols="12" sm="12">
          <span>
            <strong>Mostrando:</strong>
            {{
              $store.state.itemsPerPage > woocommerces.length
                ? woocommerces.length
                : $store.state.itemsPerPage
            }}
            de {{ woocommerces.length }} registros
          </span>
        </v-col>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
      </material-card>
    </v-row>
  </v-container>
</template>

<script>
import { format } from "date-fns";
import VTextFieldWithValidation from "@/components/inputs/VTextFieldWithValidation";
import MaterialCard from "@/components/material/Card";
import Woocommerces from "@/classes/Woocommerces";
import { es } from "date-fns/locale";
export default {
  components: {
    MaterialCard,
    VTextFieldWithValidation,
  },
  filters: {
    formatDate: function(value) {
      return format(new Date(value), "d 'de' MMMM 'del' yyyy", {
        locale: es,
      });
    },
  },
  data: () => ({
    page: 1,
    pageCount: 0,
    loadingButton: false,
    search: "",
    dialog: false,
    headers: [
      {
        text: "Agregado",
        align: "left",
        sortable: true,
        value: "createdAt",
      },
      {
        text: "Dominio",
        align: "left",
        sortable: false,
        value: "domain",
      },
      { text: "Acciones", value: "action", sortable: false },
    ],
    woocommerces: [],
    editedIndex: -1,
    editedItem: Woocommerces(),
    defaultItem: Woocommerces(),
    locaciones: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo dominio" : "Editar dominio";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  mounted() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.woocommerces = this.$deepCopy(
        this.$store.state.woocommercesModule.woocommerces
      );
      this.locaciones = this.$store.state.locacionesModule.locaciones;
    },
    editItem(item) {
      this.editedIndex = this.woocommerces.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      const index = this.woocommerces.indexOf(item);
      let itemId = this.woocommerces[index]._id;
      if (await this.$confirm("¿Realmente deseas eliminar este registro?")) {
        await this.$store.dispatch("woocommercesModule/delete", itemId);
        this.woocommerces.splice(index, 1);
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
        let itemId = this.woocommerces[this.editedIndex]._id;
        try {
          await this.$store.dispatch("woocommercesModule/update", {
            id: itemId,
            data: this.editedItem,
          });
          Object.assign(this.woocommerces[this.editedIndex], this.editedItem);
          this.close();
        } finally {
          this.loadingButton = false;
        }
      } else {
        //create item
        try {
          let newItem = await this.$store.dispatch(
            "woocommercesModule/create",
            this.editedItem
          );
          this.woocommerces.push(newItem);
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
