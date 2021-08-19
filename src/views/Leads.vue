<template>
  <div class="leads">
    <material-card
      width="100%"
      icon="mdi-cellphone-dock"
      color="primary"
      title="Leads"
      text="Tabla resumen de leads"
    >
      <v-data-table
        dense
        calculate-widths
        :loading="dataTableLoading"
        no-results-text="No se encontraron resultados"
        hide-default-footer
        :headers="headers"
        :items="leads"
        sort-by="calories"
        @page-count="pageCount = $event"
        :page.sync="page"
        :items-per-page="$store.state.itemsPerPage"
        :options.sync="pagination"
        :server-items-length="totalItems"
      >
        <template v-slot:top>
          <v-container>
            <span class="font-weight-bold">Selecciona al agente</span>
            <v-row>
              <v-col cols="12" sm="6">
                <v-combobox
                  v-model="telefonoId"
                  :items="telefonos"
                  :search-input.sync="search2"
                  hide-selected
                  item-value="_id"
                  placeholder="Selecciona el agente"
                  outlined
                  dense
                  class="mt-2"
                  clearable
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          No se encontraron resultados
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item }">
                    <span>{{ item.fullname }} ({{ item.cellphone }})</span>
                  </template>
                  <template v-slot:item="{ item }">
                    <span>{{ item.fullname }} ({{ item.cellphone }})</span>
                  </template>
                </v-combobox>
              </v-col>
              <v-col cols="12" sm="6">
                <v-sheet max-width="700">
                  <v-slide-group v-model="filterCountries" multiple show-arrows>
                    <v-slide-item
                      v-for="country in $store.state.countries"
                      :key="country"
                      v-slot="{ active, toggle }"
                    >
                      <v-btn
                        class="mx-2"
                        :input-value="active"
                        active-class="purple white--text"
                        depressed
                        rounded
                        @click="toggle"
                      >
                        {{ country }}
                      </v-btn>
                    </v-slide-item>
                  </v-slide-group>
                </v-sheet>
              </v-col>
            </v-row>
            <span class="font-weight-bold"
              >Filtrar por nombre/apellido/teléfono: {{ search }}</span
            >
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  dense
                  hide-details
                  v-model="search"
                  append-icon="search"
                  placeholder="Escribe los nombres/apellidos/telefonos del lead"
                  single-line
                  outlined
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-dialog v-model="dialog" max-width="900px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on"
                      >Agregar lead</v-btn
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
                          <v-col
                            v-for="detail in editedItem.details"
                            :key="detail._id"
                            cols="12"
                            sm="12"
                            md="12"
                          >
                            <div v-if="detail.labels">
                              <v-chip
                                dark
                                class="mb-1 mr-1"
                                color="pink"
                                v-for="label in detail.labels
                                  .filter((el) => el.labelId)
                                  .reduce((unique, o) => {
                                    if (
                                      !unique.some(
                                        (obj) =>
                                          obj.labelId.name === o.labelId.name
                                      )
                                    ) {
                                      unique.push(o);
                                    }
                                    return unique;
                                  }, [])"
                                :key="label._id"
                              >
                                {{ label.labelId.name }}
                              </v-chip>
                            </div>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <p class="body-1 font-weight-bold">Teléfono</p>
                            <VTextFieldWithValidation
                              rules="required"
                              v-model="editedItem.telefono"
                              label="Teléfono"
                            />
                          </v-col>
                        </v-row>
                        <v-row
                          v-for="(detail, detailIndex) in editedItem.details"
                          :key="detail._id"
                        >
                          <v-col
                            v-show="editedItem.details.length > 1"
                            cols="12"
                            sm="12"
                          >
                            <div class="striped-border">
                              <p class="body-1 font-weight-bold">
                                Origen N° {{ detailIndex + 1 }}
                              </p>
                            </div>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <p class="body-1 font-weight-bold">Fuente</p>
                            <v-select
                              v-model="detail.fuente"
                              :items="sourceSelectList"
                              hide-selected
                              item-value="_id"
                              item-text="name"
                              placeholder="Selecciona la fuente"
                              outlined
                              hide-details
                              dense
                              class="mt-2"
                              clearable
                            >
                            </v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <p class="body-1 font-weight-bold">
                              ID de Contacto
                            </p>
                            <VTextFieldWithValidation
                              rules=""
                              v-model="detail.contactId"
                              label="ID de Contacto"
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <p class="body-1 font-weight-bold">Nombres</p>
                            <VTextFieldWithValidation
                              rules=""
                              v-model="detail.nombre"
                              label="Nombres"
                            />
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <p class="body-1 font-weight-bold">Email</p>
                            <VTextFieldWithValidation
                              rules=""
                              v-model="detail.email"
                              label="Email"
                            />
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <p class="body-1 font-weight-bold">Ciudad</p>
                            <VTextFieldWithValidation
                              rules=""
                              v-model="detail.ciudad"
                              label="Ciudad"
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <p class="body-1 font-weight-bold">Asunto</p>
                            <VTextFieldWithValidation
                              rules=""
                              v-model="detail.msnActivaDefault"
                              label="Asunto"
                            />
                          </v-col>
                          <v-col
                            v-show="editedIndex > -1"
                            cols="12"
                            sm="12"
                            md="12"
                          >
                            <p class="body-1 font-weight-bold">Nota</p>
                            <v-textarea
                              label="Notas referentes a este lead..."
                              v-model="detail.nota"
                              outlined
                              hide-details="auto"
                            ></v-textarea>
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
            <v-col cols="12" sm="12">
              <span>
                <strong>Mostrando:</strong>
                {{
                  $store.state.itemsPerPage > leads.length
                    ? leads.length
                    : $store.state.itemsPerPage
                }}
                de {{ $store.state.cleanLeadsModule.total }} registros
              </span>
            </v-col>
            <div class="text-center pt-2">
              <v-pagination
                v-model="page"
                @input="initialize(buildPayloadPagination(page, buildSearch()))"
                :length="totalPages"
                total-visible="15"
              ></v-pagination>
            </div>
          </v-container>
        </template>
        <template v-slot:[`item.telefonoId`]="{ item }">
          <v-chip
            small
            v-show="!item.telefonoId"
            class="ma-2"
            color="red"
            text-color="white"
          >
            Sin Asignar
          </v-chip>
          <span v-show="item.telefonoId"
            >{{ item.telefonoId ? item.telefonoId.agenteId.nombre : " " }}
            {{ item.telefonoId ? item.telefonoId.agenteId.apellido : " " }}
            ({{ item.telefonoId ? item.telefonoId.numero : " " }})</span
          >
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-btn
            class="mr-3 mb-1"
            small
            color="secondary"
            @click="editItem(item)"
            >Editar</v-btn
          >
          <v-btn class="mb-1" small color="error" @click="deleteItem(item)"
            >Eliminar</v-btn
          >
        </template>
        <template v-slot:[`item.fuente`]="{ item }">
          <v-simple-table dense class="pa-6">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Tipo</th>
                  <th class="text-left">Fuente</th>
                  <th class="text-left">Nombre Facebook</th>
                  <th class="text-left">Nombre</th>
                  <th class="text-left">Correo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="detail in item.details" :key="detail._id">
                  <td>{{ detail.type }}</td>
                  <td>
                    {{
                      sourceSelectList.find((el) => el._id === detail.fuente)
                        ? sourceSelectList.find(
                            (el) => el._id === detail.fuente
                          ).name
                        : detail.fuente
                    }}
                  </td>
                  <td>{{ detail.appName }}</td>
                  <td>{{ detail.nombre }}</td>
                  <td>{{ detail.email }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </template>
        <template v-slot:no-data>
          <v-alert type="error" :value="true">Aún no cuentas con leads</v-alert>
        </template>
        <template v-slot:[`item.updatedAt`]="{ item }">{{
          item.updatedAt | formatDate
        }}</template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip v-if="item.status" color="success">Activo</v-chip>
          <v-chip v-else color="error">Inactivo</v-chip>
        </template>
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip
            class="ma-2"
            :color="
              item.estado == 'SIN ASIGNAR'
                ? 'red'
                : item.estado == 'INFORMADO AL AGENTE'
                ? 'deep-purple accent-4'
                : item.estado == 'RE-CONECTAR'
                ? 'pink'
                : item.estado == 'COMPRA FALLIDA'
                ? 'error'
                : item.estado == 'COMPRA REALIZADA'
                ? 'success'
                : 'green'
            "
            text-color="white"
          >
            {{ item.estado }}
          </v-chip>
        </template>
      </v-data-table>
      <v-col cols="12" sm="12">
        <span>
          <strong>Mostrando:</strong>
          {{
            $store.state.itemsPerPage > leads.length
              ? leads.length
              : $store.state.itemsPerPage
          }}
          de {{ $store.state.cleanLeadsModule.total }} registros
        </span>
      </v-col>
      <div class="text-center pt-2">
        <v-pagination
          v-model="page"
          @input="initialize(buildPayloadPagination(page, buildSearch()))"
          :length="totalPages"
          total-visible="15"
        ></v-pagination>
      </div>
    </material-card>
  </div>
</template>

<script>
import axios from "axios";
import { format } from "date-fns";
import VTextFieldWithValidation from "@/components/inputs/VTextFieldWithValidation";
import MaterialCard from "@/components/material/Card";
import Leads from "@/classes/CleanLeads";
import { getRandomInt, buildPayloadPagination } from "@/utils/utils.js";
import { es } from "date-fns/locale";
export default {
  components: {
    MaterialCard,
    VTextFieldWithValidation,
  },
  filters: {
    formatDate: function (value) {
      return format(new Date(value), "d 'de' MMMM 'del' yyyy", {
        locale: es,
      });
    },
  },
  data: () => ({
    filterCountries: [],
    dataTableLoading: true,
    page: 1,
    pageCount: 0,
    loadingButton: false,
    search: "",
    dialog: false,
    paises: ["Peru", "Chile", "Colombia"],
    itemsPerPage: 10,
    isDataReady: false,
    selectedOrder: 0,
    pagination: {},
    headers: [
      {
        text: "Última actualización",
        align: "left",
        sortable: false,
        value: "updatedAt",
      },
      {
        text: "Detalle del lead",
        align: "left",
        sortable: false,
        value: "fuente",
      },
      {
        text: "Teléfono",
        align: "left",
        sortable: false,
        value: "telefono",
      },
      {
        text: "Agente",
        align: "left",
        sortable: false,
        value: "telefonoId",
      },
      {
        text: "Estado",
        align: "left",
        sortable: false,
        value: "estado",
      },
      { text: "Acciones", value: "action", sortable: false },
    ],
    leads: [],
    leadsReady: false,
    editedIndex: -1,
    editedItem: Leads(),
    defaultItem: Leads(),
    telefonos: [],
    search2: "",
    telefonoId: null,
    delayTimer: null,
    fieldsToSearch: [
      "nombre",
      "apellido",
      "telefono",
      "displayName",
      "appName",
    ],
  }),

  computed: {
    totalItems() {
      return this.$store.state.cleanLeadsModule.total;
    },
    totalPages() {
      return this.$store.state.cleanLeadsModule.totalPages;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo lead" : "Editar lead";
    },
    sourceSelectList() {
      return [
        ...this.$store.state.botsModule.bots.map((bot) => ({
          _id: bot._id,
          name: bot.name,
          country: bot.country,
        })),
        ...this.$store.state.woocommercesModule.woocommerces.map(
          (woocommerce) => ({
            _id: woocommerce._id,
            name: woocommerce.domain,
            country: woocommerce.country,
          })
        ),
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    async search() {
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() => {
        this.doSearch();
      }, 400);
    },
    telefonoId() {
      this.initialize(this.buildPayloadPagination(null, this.buildSearch()));
    },
    filterCountries() {
      this.initialize(this.buildPayloadPagination(null, this.buildSearch()));
    },
  },

  mounted() {
    this.initialize(this.buildPayloadPagination(null, this.buildSearch()));
    console.log(this.sourceSelectList);
  },

  methods: {
    async initialize(paginationPayload) {
      this.$store.commit("loadingModule/showLoading", true);
      let body = {
        ...paginationPayload,
        sort: "updatedAt",
        order: "desc",
      };
      if (this.telefonoId) body["telefonoId"] = this.telefonoId._id;
      if (this.filterCountries.length > 0) body["pais"] = this.filterCountries;
      await Promise.all([this.$store.dispatch("cleanLeadsModule/list", body)]);
      this.$store.commit("loadingModule/showLoading", false);

      this.leads = this.$store.state.cleanLeadsModule.cleanLeads;
      this.leadsReady = true;
      this.telefonos = this.$store.state.telefonosModule.telefonos.map(
        (telefono) => ({
          _id: telefono._id,
          agent: `${telefono.agenteId.nombre} ${telefono.agenteId.apellido} (${telefono.numero})`,
          fullname: `${telefono.agenteId.nombre} ${telefono.agenteId.apellido}`,
          cellphone: `${telefono.numero}`,
          active: telefono.active,
        })
      );
      this.dataTableLoading = false;
    },
    buildPayloadPagination(page, searchPayload) {
      return buildPayloadPagination(
        {
          page: page || 1,
          itemsPerPage: this.$store.state.itemsPerPage,
        },
        searchPayload
      );
    },
    editItem(item) {
      this.editedIndex = this.leads.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async doSearch() {
      try {
        this.dataTableLoading = true;
        await this.initialize(
          buildPayloadPagination(
            {
              page: 1,
              itemsPerPage: this.$store.state.itemsPerPage,
            },
            this.buildSearch()
          )
        );
        this.dataTableLoading = false;
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false;
      }
    },
    buildSearch() {
      return this.search
        ? { query: this.search, fields: this.fieldsToSearch.join(",") }
        : {};
    },

    async deleteItem(item) {
      const index = this.leads.indexOf(item);
      let itemId = this.leads[index]._id;
      if (await this.$confirm("¿Realmente deseas eliminar este registro?")) {
        await this.$store.dispatch("cleanLeadsModule/delete", itemId);
        this.leads.splice(index, 1);
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
        let itemId = this.leads[this.editedIndex]._id;
        try {
          await this.$store.dispatch("cleanLeadsModule/update", {
            id: itemId,
            data: this.editedItem,
          });
          Object.assign(this.leads[this.editedIndex], this.editedItem);
          this.close();
        } finally {
          this.loadingButton = false;
        }
      } else {
        //create item
        try {
          //buscando telefono en contactos de Agentes
          let contactos = (
            await axios.get(
              "/api/contactos?filter=" +
                this.editedItem.telefono +
                "&fields=celular"
            )
          ).data.payload;
          if (contactos.length > 0) {
            //asignando agente random
            let randomContact =
              contactos[getRandomInt(0, contactos.length - 1)];
            this.editedItem.telefonoId = randomContact.telefonoId._id;
            this.editedItem.details[0].msnActivaDefault = this.editedItem
              .details[0].msnActivaDefault
              ? this.editedItem.details[0].msnActivaDefault
              : "SIN CONSULTA";
            //generando nota cuando se asignó un agente random
            this.editedItem.details[0].nota = `Hola ${randomContact.telefonoId.agenteId.nombre} tu cliente: ${this.editedItem.details[0].nombre} con teléfono : ${this.editedItem.telefono} consulta: '${this.editedItem.details[0].msnActivaDefault}'. En cuanto la contactes me informas para borrarla de los pendientes`;
            this.editedItem.estado = "RE-CONECTAR";
          } else {
            //Generando nota
            this.editedItem.estado = "SIN ASIGNAR";
          }
          //ASIGNANDO PAIS POR DEFECTO
          this.editedItem.details[0].pais = this.sourceSelectList.find(
            (el) => el._id === this.editedItem.details[0].fuente
          )
            ? this.sourceSelectList.find(
                (el) => el._id === this.editedItem.details[0].fuente
              ).country
            : "Peru";
          this.editedItem.details[0].type = "CHATBOT"; //pagina por defecto
          await this.$store.dispatch(
            "cleanLeadsModule/create",
            this.editedItem
          );
          //refrescar tabla
          this.initialize(
            this.buildPayloadPagination(null, this.buildSearch())
          );
          this.close();
        } finally {
          this.loadingButton = false;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.leads .text-left {
  font-size: 1em !important;
}
</style>
