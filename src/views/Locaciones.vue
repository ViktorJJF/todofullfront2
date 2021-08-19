<template>
  <v-container>
    <v-row justify="center">
      <material-card
        width="1000px"
        icon="mdi-cellphone-dock"
        color="primary"
        title="Locaciones"
        text="Tabla resumen de locaciones"
      >
        <v-data-table
          no-results-text="No se encontraron resultados"
          :search="search"
          hide-default-footer
          :headers="headers"
          :items="locaciones"
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
                    placeholder="Escribe el nombre de la locación"
                    single-line
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark class="mb-2" v-on="on"
                        >Agregar locación</v-btn
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
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">Nombre</p>
                              <VTextFieldWithValidation
                                rules="required"
                                v-model="editedItem.nombre"
                                label="Nombre de la locación"
                              />
                            </v-col>
                            <v-col cols="12" sm="6">
                              <span class="font-weight-bold">País</span>
                              <v-select
                                dense
                                hide-details
                                placeholder="Ingresa una descripción"
                                outlined
                                :items="paises"
                                v-model="editedItem.pais"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <span class="font-weight-bold">Ciudades</span>
                              <v-select
                                dense
                                hide-details
                                placeholder="Ingresa una descripción"
                                outlined
                                :items="ciudadesFiltered"
                                v-model="editedItem.ciudad"
                              ></v-select>
                            </v-col>

                            <v-col cols="12" sm="12">
                              <span class="font-weight-bold"
                                >Equipo De Ventas</span
                              >
                              <v-select
                                dense
                                hide-details
                                placeholder="Selecciona un equipo de ventas"
                                outlined
                                :items="equipoDeVentas"
                                item-text="nombre"
                                item-value="_id"
                                v-model="editedItem.equipoDeVentaId"
                              ></v-select>
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
              >Aún no cuentas con locaciones</v-alert
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
              $store.state.itemsPerPage > locaciones.length
                ? locaciones.length
                : $store.state.itemsPerPage
            }}
            de {{ locaciones.length }} registros
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
import Locaciones from "@/classes/Locaciones";
export default {
  components: {
    MaterialCard,
    VTextFieldWithValidation,
  },
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
    headers: [
      {
        text: "Nombre",
        align: "left",
        sortable: false,
        value: "nombre",
      },
      {
        text: "Equipo de Ventas",
        align: "left",
        sortable: false,
        value: "equipoDeVentaId.nombre",
      },
      {
        text: "Agregado",
        align: "left",
        sortable: true,
        value: "createdAt",
      },
      { text: "Acciones", value: "action", sortable: false },
    ],
    locaciones: [],
    editedIndex: -1,
    editedItem: Locaciones(),
    defaultItem: Locaciones(),
    paises: ["Peru", "Chile", "Colombia", "Estados Unidos", "Argentina"],
    ciudades: [
      {
        pais: "Peru",
        ciudades: ["Tacna", "Arequipa", "Lima", "Moquegua", "Callao"],
      },
      {
        pais: "Chile",
        ciudades: ["Santiago", "Viña", "Antofagasta", "Temuco"],
      },
      {
        pais: "Colombia",
        ciudades: ["Bogotá", "Medellin", "Cali", "Cartagena"],
      },
    ],
    equipoDeVentas: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva locación" : "Editar locación";
    },
    ciudadesFiltered() {
      return this.ciudades.find(
        (ciudad) => ciudad.pais === this.editedItem.pais
      )
        ? this.ciudades.find((ciudad) => ciudad.pais === this.editedItem.pais)
            .ciudades
        : [];
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
      this.locaciones = this.$deepCopy(
        this.$store.state.locacionesModule.locaciones
      );
      this.equipoDeVentas =
        this.$store.state.equipoDeVentasModule.equipoDeVentas;
      console.log("las locaciones: ", this.locaciones);
    },
    editItem(item) {
      this.editedIndex = this.locaciones.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      const index = this.locaciones.indexOf(item);
      let itemId = this.locaciones[index]._id;
      if (await this.$confirm("¿Realmente deseas eliminar este registro?")) {
        await this.$store.dispatch("locacionesModule/delete", itemId);
        this.locaciones.splice(index, 1);
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
        let itemId = this.locaciones[this.editedIndex]._id;
        try {
          await this.$store.dispatch("locacionesModule/update", {
            id: itemId,
            data: this.editedItem,
          });
          Object.assign(this.locaciones[this.editedIndex], this.editedItem);
          this.close();
        } finally {
          this.loadingButton = false;
        }
      } else {
        //create item
        try {
          console.log("el nuevo item: ", this.editedItem);

          let newItem = await this.$store.dispatch(
            "locacionesModule/create",
            this.editedItem
          );
          this.locaciones.push(newItem);
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
