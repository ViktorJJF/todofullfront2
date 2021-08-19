<template>
  <v-container>
    <v-row justify="center">
      <material-card
        width="90%"
        icon="mdi-cellphone-dock"
        color="primary"
        title="Facebook"
        text="Resumen de Bots"
      >
        <v-data-table
          no-results-text="No se encontraron resultados"
          :search="search"
          hide-default-footer
          :headers="headers"
          :items="bots"
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
                        >Agregar bot</v-btn
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
                              <h3 class="mt-1">Datos de Facebook</h3>
                            </v-col>
                          </v-row>

                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">Nombre</p>
                              <VTextFieldWithValidation
                                rules="required"
                                v-model="editedItem.name"
                                label="Ingresa el nombre del bot"
                              />
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12">
                              <span class="font-weight-bold">País</span>
                              <v-select
                                dense
                                hide-details
                                placeholder="Ingresa una descripción"
                                outlined
                                :items="paises"
                                v-model="editedItem.country"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">Url Webhook</p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.webhookUrl"
                                label="Ingresa el nombre del bot"
                              />
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">
                                Nombre Fanpage
                              </p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.fanpageName"
                                label="Ingresa el nombre de la Fanpage"
                              />
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">URL Fanpage</p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.fanpageUrl"
                                label="Ingresa la url de la fanpage"
                              />
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">Fanpage ID</p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.fanpageId"
                                label="Ingresa el ID de la Fanpage"
                              />
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">
                                Fanpage Token
                              </p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.fbPageToken"
                                label="Ingresa el token de la Fanpage"
                              />
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">
                                Token de Verificación
                              </p>
                              <VTextFieldWithValidation
                                disabled
                                rules=""
                                value="MUJERON"
                                label="Ingresa el token (ejmp: BOTSMUJERON)"
                              />
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">
                                Facebook App Secret
                              </p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.fbAppSecret"
                                label="Ingresa el FB App Secret"
                              />
                            </v-col>
                          </v-row>
                          <v-divider></v-divider>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <h3 class="mt-3">Credenciales de Dialogflow</h3>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">
                                Dialogflow Google Project ID
                              </p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.googleProjectId"
                                label="Ingresa el Google Project Id"
                              />
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">
                                Dialogflow Google Email
                              </p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.googleClientEmail"
                                label="Ingresa el Google Email"
                              />
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">
                                Dialogflow Google Private Key
                              </p>
                              <v-textarea
                                hide-details="auto"
                                outlined
                                placeholder="Ingresa el Google Private Key"
                                v-model="editedItem.googlePrivateKey"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">
                                Dialogflow Código Idioma
                              </p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.dialogflowLanguageCode"
                                label="Ingresa el código Idioma (ejmp: es)"
                              />
                            </v-col>
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
              >Aún no cuentas con bots</v-alert
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
              $store.state.itemsPerPage > bots.length
                ? bots.length
                : $store.state.itemsPerPage
            }}
            de {{ bots.length }} registros
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
import Bots from "@/classes/Bots";
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
    headers: [
      {
        text: "Nombre Bot",
        align: "left",
        sortable: false,
        value: "name",
      },
      {
        text: "Última Actualización",
        align: "left",
        sortable: false,
        value: "createdAt",
      },
      { text: "Acciones", value: "action", sortable: false },
    ],
    bots: [],
    editedIndex: -1,
    editedItem: Bots(),
    defaultItem: Bots(),
    paises: ["Peru", "Chile", "Colombia", "Estados Unidos", "Argentina"],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo bot" : "Editar bot";
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
    async initialize() {
      await Promise.all([this.$store.dispatch("botsModule/list")]);
      this.bots = this.$deepCopy(this.$store.state.botsModule.bots);
      this.locaciones = this.$store.state.locacionesModule.locaciones;
    },
    editItem(item) {
      this.editedIndex = this.bots.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      const index = this.bots.indexOf(item);
      let itemId = this.bots[index]._id;
      if (await this.$confirm("¿Realmente deseas eliminar este registro?")) {
        await this.$store.dispatch("botsModule/delete", itemId);
        this.bots.splice(index, 1);
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
        let itemId = this.bots[this.editedIndex]._id;
        try {
          await this.$store.dispatch("botsModule/update", {
            id: itemId,
            data: this.editedItem,
          });
          Object.assign(this.bots[this.editedIndex], this.editedItem);
          this.close();
        } finally {
          this.loadingButton = false;
        }
      } else {
        //create item
        try {
          let newItem = await this.$store.dispatch(
            "botsModule/create",
            this.editedItem
          );
          this.bots.push(newItem);
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
