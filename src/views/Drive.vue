<template>
  <v-container>
    <v-row justify="center">
      <material-card
        width="90%"
        icon="mdi-cellphone-dock"
        color="primary"
        title="Agentes"
        text="Tabla resumen de agentes"
      >
        <v-data-table
          no-results-text="No se encontraron resultados"
          :search="search"
          hide-default-footer
          :headers="headers"
          :items="agentes"
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
                    placeholder="Escribe el nomb"
                    single-line
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark class="mb-2" v-on="on"
                        >Agregar agente</v-btn
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
                            <v-col cols="12" sm="6" md="6">
                              <p class="body-1 font-weight-bold">Nombres</p>
                              <VTextFieldWithValidation
                                rules="required"
                                v-model="editedItem.nombre"
                                label="Ingresa el nombre"
                              />
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <p class="body-1 font-weight-bold">Apellidos</p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.apellido"
                                label="Ingresa el apellido"
                              />
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">Correo</p>
                              <VTextFieldWithValidation
                                rules="required"
                                v-model="editedItem.email"
                                label="Ingresa el correo"
                              />
                            </v-col>

                            <v-col cols="12" sm="12">
                              <span class="font-weight-bold">Locación</span>
                              <v-select
                                hide-details
                                placeholder="Selecciona una locación"
                                outlined
                                :items="locaciones"
                                item-text="nombre"
                                item-value="_id"
                                v-model="editedItem.locacionId"
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
              >Aún no cuentas con agentes</v-alert
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
              $store.state.itemsPerPage > agentes.length
                ? agentes.length
                : $store.state.itemsPerPage
            }}
            de {{ agentes.length }} registros
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
import Agentes from "@/classes/Agentes";
export default {
  components: {
    MaterialCard,
    VTextFieldWithValidation,
  },
  filters: {
    formatDate: function(value) {
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

  mounted() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.agentes = this.$deepCopy(this.$store.state.agentesModule.agentes);
      this.locaciones = this.$store.state.locacionesModule.locaciones;
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
