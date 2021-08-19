<template>
  <v-container>
    <v-row justify="center">
      <material-card
        width="90%"
        icon="mdi-cellphone-dock"
        color="primary"
        title="Agentes y Teléfonos"
        text="Tabla resumen de telefonos y agentes (Con credenciales)"
      >
        <v-data-table
          no-results-text="No se encontraron resultados"
          :search="search"
          hide-default-footer
          :headers="headers"
          :items="telefonos"
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
                    placeholder="Escribe el teléfono"
                    single-line
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark class="mb-2" v-on="on"
                        >Agregar teléfono</v-btn
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
                              <p class="body-1 font-weight-bold">Número</p>
                              <VTextFieldWithValidation
                                rules="required"
                                v-model="editedItem.numero"
                                label="Número de teléfono 56...."
                              />
                            </v-col>

                            <v-col cols="12" sm="6" md="12">
                              <p class="body-1 font-weight-bold">
                                Google Contact Email
                              </p>
                              <VTextFieldWithValidation
                                rules="required"
                                v-model="editedItem.googleContactEmail"
                                label="Correo de Google Contact"
                              />
                            </v-col>

                            <v-col cols="12" sm="12">
                              <span class="font-weight-bold">Agentes</span>
                              <v-select
                                dense
                                hide-details
                                placeholder="Selecciona un agente"
                                outlined
                                :items="agentes"
                                item-value="_id"
                                v-model="editedItem.agenteId"
                              >
                                <template v-slot:selection="{ item }">
                                  <span
                                    >{{ item.nombre }} {{ item.apellido }}</span
                                  >
                                </template>
                                <template v-slot:item="{ item }">
                                  <span
                                    >{{ item.nombre }} {{ item.apellido }}</span
                                  >
                                </template>
                              </v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">
                                Client ID
                              </p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.credenciales.clientId"
                                label="ID del cliente de Google Cloud"
                              />
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">
                                Client Secret
                              </p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.credenciales.clientSecret"
                                label="ID secreto del cliente"
                              />
                            </v-col>
                            <v-col>
                              <v-btn
                                color="error"
                                dark
                                @click="
                                  $router.push({
                                    name: 'Telefonos-googleContact',
                                    params: {
                                      id: editedItem._id,
                                      clientId:
                                        editedItem.credenciales.clientId,
                                      clientSecret:
                                        editedItem.credenciales.clientSecret,
                                    },
                                  })
                                "
                                >Generar credenciales</v-btn
                              >
                            </v-col>
                            <v-col>
                              <v-btn
                                color="#251B4A"
                                dark
                                @click="
                                  $router.push({
                                    name: 'Telefonos-contactos',
                                    params: { id: editedItem._id },
                                  });
                                  $store.commit(
                                    'setSelectedTelefono',
                                    editedItem
                                  );
                                "
                                >Exportar contactos</v-btn
                              >
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
            <v-btn
              class="mr-3 mb-2"
              small
              color="secondary"
              @click="editItem(item)"
              >Editar</v-btn
            >
            <v-btn small color="error" @click="deleteItem(item)"
              >Eliminar</v-btn
            >
          </template>
          <template v-slot:no-data>
            <v-alert type="error" :value="true"
              >Aún no cuentas con telefonos</v-alert
            >
          </template>
          <template v-slot:[`item.agenteId`]="{ item }"
            >{{ item.agenteId.nombre }} {{ item.agenteId.apellido }}</template
          >
          <template v-slot:[`item.createdAt`]="{ item }">{{
            item.createdAt | formatDate
          }}</template>
          <template v-slot:[`item.active`]="{ item }"
            ><v-switch
              v-model="item.active"
              @change="updateActive(item)"
              style="width:20px;"
            ></v-switch
          ></template>
          <template v-slot:[`item.status`]="{ item }">
            <v-chip v-if="item.status" color="success">Activo</v-chip>
            <v-chip v-else color="error">Inactivo</v-chip>
          </template>
        </v-data-table>
        <v-col cols="12" sm="12">
          <span>
            <strong>Mostrando:</strong>
            {{
              $store.state.itemsPerPage > telefonos.length
                ? telefonos.length
                : $store.state.itemsPerPage
            }}
            de {{ telefonos.length }} registros
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
import Telefonos from "@/classes/Telefonos";
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
    dialog2: false,
    paises: ["Peru", "Chile", "Colombia"],
    headers: [
      {
        text: "Número",
        align: "left",
        sortable: false,
        value: "numero",
      },
      {
        text: "Google Contact",
        align: "left",
        sortable: false,
        value: "googleContactEmail",
      },
      {
        text: "Agente",
        align: "left",
        sortable: true,
        value: "agenteId",
      },
      {
        text: "¿Activo?",
        align: "left",
        sortable: true,
        value: "active",
      },
      {
        text: "Agregado",
        align: "left",
        sortable: true,
        value: "createdAt",
      },
      { text: "Acciones", value: "action", sortable: false },
    ],
    telefonos: [],
    editedIndex: -1,
    editedItem: Telefonos(),
    defaultItem: Telefonos(),
    agentes: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva teléfonos" : "Editar teléfonos";
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
      this.telefonos = this.$deepCopy(
        this.$store.state.telefonosModule.telefonos
      );
      this.agentes = this.$store.state.agentesModule.agentes;
    },
    editItem(item) {
      this.editedIndex = this.telefonos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      const index = this.telefonos.indexOf(item);
      let itemId = this.telefonos[index]._id;
      if (await this.$confirm("¿Realmente deseas eliminar este registro?")) {
        await this.$store.dispatch("telefonosModule/delete", itemId);
        this.telefonos.splice(index, 1);
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
        let itemId = this.telefonos[this.editedIndex]._id;
        try {
          await this.$store.dispatch("telefonosModule/update", {
            id: itemId,
            data: this.editedItem,
          });
          Object.assign(this.telefonos[this.editedIndex], this.editedItem);
          this.close();
        } finally {
          this.loadingButton = false;
        }
      } else {
        //create item
        try {
          let newItem = await this.$store.dispatch(
            "telefonosModule/create",
            this.editedItem
          );
          this.telefonos.push(newItem);
          this.close();
        } finally {
          this.loadingButton = false;
        }
      }
    },
    async updateActive(item) {
      //cambiando estado a contactado
      await this.$store.dispatch("telefonosModule/update", {
        id: item._id,
        data: item,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
