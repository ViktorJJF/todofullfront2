  
<template>
  <v-container>
    <v-row justify="center">
      <material-card
        width="1500px"
        icon="mdi-cellphone-dock"
        color="primary"
        :title="$t(entity + '.TITLE')"
        :text="$t(entity + '.SUBTITLE')"
      >
        <v-data-table
          no-results-text="No se encontraron resultados"
          :search="search"
          hide-default-footer
          :headers="headers"
          :items="items"
          sort-by="calories"
          @page-count="pageCount = $event"
          :page.sync="page"
          :items-per-page="$store.state.itemsPerPage"
          :options.sync="pagination"
          :server-items-length="totalItems"
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
                    placeholder="Escribe el nombre de la marca"
                    single-line
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-dialog v-model="dialog" max-width="700px">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark class="mb-2" v-on="on">{{
                        $t(entity + ".NEW_ITEM")
                      }}</v-btn>
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
                              <p class="body-1 font-weight-bold">Nombres</p>
                              <VTextFieldWithValidation
                                rules="required"
                                v-model="editedItem.name"
                                label="Nombre del marca"
                              />
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">Nombres</p>
                              <v-textarea
                                placeholder="descripcion"
                                outlined
                                v-model="editedItem.description"
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
              <v-row>
                <v-col cols="12" sm="12">
                  <span>
                    <strong>Mostrando:</strong>
                    {{
                      $store.state.itemsPerPage > items.length
                        ? items.length
                        : $store.state.itemsPerPage
                    }}
                    de {{ totalItems }} registros
                  </span>
                </v-col>
              </v-row>
              <div class="text-center pt-2">
                <v-pagination
                  @input="initialize(page)"
                  v-model="page"
                  :length="pageCount"
                  :total-visible="$store.state.maxPaginationButtons"
                ></v-pagination>
              </div>
            </v-container>
          </template>
          <!-- <template v-slot:[`item.action`]="{ item }">
            <v-btn
              class="mr-1 mb-1"
              color="primary"
              fab
              small
              dark
              @click="editItem(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="error" fab small dark @click="deleteItem(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template> -->
          <template v-slot:no-data>
            <v-alert type="error" :value="true"
              >Aún no cuentas con brands</v-alert
            >
          </template>
          <template v-slot:[`item.merge_fields`]="{ item }">
            <ul>
              <li v-for="(value, key, idx) in item.merge_fields" :key="idx">
                {{ key }}: {{ value }}
              </li>
            </ul>
          </template>
          <template v-slot:[`item.last_changed`]="{ item }">{{
            item.last_changed | formatDate
          }}</template>
        </v-data-table>
        <v-col cols="12" sm="12">
          <span>
            <strong>Mostrando:</strong>
            {{
              $store.state.itemsPerPage > items.length
                ? items.length
                : $store.state.itemsPerPage
            }}
            de {{ totalItems }} registros
          </span>
        </v-col>
        <div class="text-center pt-2">
          <v-pagination
            @input="initialize(page)"
            v-model="page"
            :length="pageCount"
            :total-visible="$store.state.maxPaginationButtons"
          ></v-pagination>
        </div>
      </material-card>
    </v-row>
  </v-container>
</template>

<script>
const ENTITY = "mailchimpContacts";
const CLASS_ITEMS = () =>
  import(`@/classes/${ENTITY.charAt(0).toUpperCase() + ENTITY.slice(1)}`);
// const ITEMS_SPANISH = 'marcas';
import { format } from "date-fns";
import VTextFieldWithValidation from "@/components/inputs/VTextFieldWithValidation";
import MaterialCard from "@/components/material/Card";
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
    //datos del componente
    fieldsToSearch: ["full_name", "email_address"],
    headers: [
      {
        text: "Última Actualización",
        align: "left",
        sortable: true,
        value: "last_changed",
      },
      {
        text: "Nombres",
        align: "left",
        sortable: true,
        value: "full_name",
      },
      {
        text: "Correo Marketing",
        align: "left",
        sortable: false,
        value: "email_address",
      },
      {
        text: "Correo Cliente",
        align: "left",
        sortable: false,
        value: "email_client",
      },
      {
        text: "Merge Fields",
        align: "left",
        sortable: true,
        value: "merge_fields",
      },
      {
        text: "Rating",
        align: "left",
        sortable: true,
        value: "member_rating",
      },
      {
        text: "Estado",
        align: "left",
        sortable: true,
        value: "status",
      },
      {
        text: "Singup Source",
        align: "left",
        sortable: true,
        value: "source",
      },
      // { text: "Acciones", value: "action", sortable: false },
    ],
    delayTimer: null,
    [ENTITY]: [],
    editedIndex: -1,
    editedItem: CLASS_ITEMS(),
    defaultItem: CLASS_ITEMS(),
    //configuracion de la tabla
    pagination: {},
    dataTableLoading: true,
    page: 1,
    pageCount: 0,
    loadingButton: false,
    search: "",
    dialog: false,
  }),
  computed: {
    totalItems() {
      return this.$store.state[ENTITY + "Module"].total;
    },
    totalPages() {
      return this.$store.state[ENTITY + "Module"].totalPages;
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t(this.entity + ".NEW_ITEM")
        : this.$t(this.entity + ".EDIT_ITEM");
    },
    items() {
      return this[ENTITY];
    },
    entity() {
      return ENTITY;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    async search() {
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() => {
        this.initialize(this.page);
      }, 600);
    },
    telefonoId() {
      //buscar con algun campo en particular?
      this.initialize(1);
    },
  },
  mounted() {
    this.initialize();
  },
  methods: {
    async initialize(page = 1) {
      //llamada asincrona de items
      await Promise.all([
        this.$store.dispatch(ENTITY + "Module/list", {
          page,
          search: this.search,
          fieldsToSearch: this.fieldsToSearch,
          sort: "last_changed",
          order: "desc",
        }),
      ]);
      //asignar al data del componente
      this[ENTITY] = this.$deepCopy(
        this.$store.state[ENTITY + "Module"][ENTITY]
      );
    },
    editItem(item) {
      this.editedIndex = this[ENTITY].indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async deleteItem(item) {
      const index = this[ENTITY].indexOf(item);
      let itemId = this[ENTITY][index]._id;
      if (await this.$confirm("¿Realmente deseas eliminar este registro?")) {
        await this.$store.dispatch("brandsModule/delete", itemId);
        this[ENTITY].splice(index, 1);
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
        let itemId = this[ENTITY][this.editedIndex]._id;
        try {
          await this.$store.dispatch(ENTITY + "Module/update", {
            id: itemId,
            data: this.editedItem,
          });
          Object.assign(this[ENTITY][this.editedIndex], this.editedItem);
          this.close();
        } finally {
          this.loadingButton = false;
        }
      } else {
        //create item
        try {
          let newItem = await this.$store.dispatch(
            ENTITY + "Module/create",
            this.editedItem
          );
          this[ENTITY].push(newItem);
          this.close();
          this.initialize();
        } finally {
          this.loadingButton = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>