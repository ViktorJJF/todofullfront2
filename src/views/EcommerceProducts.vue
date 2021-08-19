<template>
  <v-container>
    <v-row justify="center">
      <material-card
        width="98%"
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
                    placeholder="Escribe el nombre de producto"
                    single-line
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-btn
                    color="success"
                    class="mb-1"
                    small
                    @click="
                      filterWithoutRef = !filterWithoutRef;
                      filterWithoutRefMethods();
                    "
                    >{{
                      filterWithoutRef
                        ? "Ver todos los productos"
                        : "Filtrar productos sin referencia"
                    }}</v-btn
                  >
                  <v-btn
                    color="info"
                    style="display: block"
                    small
                    @click="
                      filterWithoutImage = !filterWithoutImage;
                      filterWithoutImageMethods();
                    "
                    >{{
                      filterWithoutImage
                        ? "Ver todos los productos"
                        : "Filtrar productos sin imagen"
                    }}</v-btn
                  >
                </v-col>
                <v-col cols="12" sm="6">
                  <v-dialog v-model="dialog" max-width="700px">
                    <!-- <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark class="mb-2" v-on="on">{{
                        $t(entity + ".NEW_ITEM")
                      }}</v-btn>
                    </template> -->
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
                    de {{ items.length }} registros
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <!-- <v-btn
              class="mr-1 mb-1"
              color="primary"
              fab
              small
              dark
              @click="editItem(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn> -->
            <v-btn color="error" fab small dark @click="deleteItem(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <template v-slot:no-data>
            <v-alert type="error" :value="true">{{
              $t(entity + ".NO_DATA")
            }}</v-alert>
          </template>
          <template v-slot:[`item.description`]="{ item }"
            ><span class="format-breaklines">
              {{ item.description }}
            </span></template
          >
          <template v-slot:[`item.date_modified`]="{ item }">{{
            item.date_modified | formatDate
          }}</template>
          <template v-slot:[`item.permalink`]="{ item }">
            <a :href="item.permalink" target="_blank"
              ><v-btn class="mt-3" color="primary" small>Visitar</v-btn>
            </a>
            <v-btn
              style="display: block"
              small
              class="mt-1"
              color="info"
              dark
              @click.stop="
                dialogTemplate = true;
                templateCountry = item.country;
                productId = item._id;
              "
            >
              Comment to MSN
            </v-btn>
            <v-btn
              style="display: block"
              class="mt-1"
              color="accent"
              dark
              @click.stop="
                dialogImage = true;
                currentProduct = item;
              "
              small
            >
              Insertar Imagen
            </v-btn>
          </template>
          <template v-slot:[`item.attributes`]="{ item }">
            <ul
              v-for="(attribute, attIndex) in item.attributes"
              :key="attIndex"
            >
              <li>
                <b>{{ attribute.name }}: </b>{{ attribute.options.join(",") }}
              </li>
            </ul>
          </template>
          <template v-slot:[`item.categories`]="{ item }">
            <ul
              v-for="(category, cattIndex) in item.categories"
              :key="cattIndex"
            >
              <li>{{ category.name }}</li>
            </ul>
          </template>
          <template v-slot:[`item.ref`]="{ item }">
            <v-text-field
              :hint="item.ref"
              v-model="item.ref"
              append-outer-icon="mdi mdi-checkbox-marked-circle"
              placeholder="Referencia"
              @click:append-outer="updateRef(item._id, item)"
              @keyup.enter="updateRef(item._id, item)"
            ></v-text-field>
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <v-chip v-if="item.status" color="success">Activo</v-chip>
            <v-chip v-else color="error">Inactivo</v-chip>
          </template>
        </v-data-table>
        <v-col cols="12" sm="12">
          <span>
            <strong>Mostrando:</strong>
            {{
              $store.state.itemsPerPage > items.length
                ? items.length
                : $store.state.itemsPerPage
            }}
            de {{ items.length }} registros
          </span>
        </v-col>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
      </material-card>
    </v-row>

    <v-dialog v-model="dialogTemplate" max-width="890">
      <v-card class="pa-5">
        <CommentToMSNUpdate
          :key="keyNumber"
          @click="keyNumber += 1"
          v-if="templateCountry && productId && dialogTemplate"
          :isTemplate="true"
          :country="templateCountry"
          :productId="productId"
          @saved="dialogTemplate = false"
        ></CommentToMSNUpdate>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogImage" max-width="890">
      <v-card v-if="currentProduct" class="pa-5">
        <v-card-title>
          <span class="text-h5">Insertar Imagen Personalizada</span>
        </v-card-title>
        <v-text-field
          dense
          hide-details
          v-model="currentProduct.customImage"
          placeholder="Escribe la url de la imagen"
          single-line
          outlined
        ></v-text-field>
        <v-row class="mt-3 mb-3">
          <v-img
            v-if="currentProduct.customImage"
            class="rounded-corners"
            :src="currentProduct.customImage"
            aspect-ratio="2"
            contain
          ></v-img>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="loadingButton"
            dark
            color="green darken-1"
            @click="
              dialogImage = false;
              saveCustomImage(currentProduct._id, currentProduct);
            "
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
//Nota: Modifica los campos de la tabla
const ENTITY = "ecommerces"; // nombre de la entidad en minusculas (se repite en services y modules del store)
const CLASS_ITEMS = () =>
  import(`@/classes/${ENTITY.charAt(0).toUpperCase() + ENTITY.slice(1)}`);
// const ITEMS_SPANISH = 'marcas';
// import { getProductRef } from "@/utils/utils";
import { format } from "date-fns";
import VTextFieldWithValidation from "@/components/inputs/VTextFieldWithValidation";
import MaterialCard from "@/components/material/Card";
import CommentToMSNUpdate from "@/views/CommentToMSNUpdate";
import { es } from "date-fns/locale";
import dialogflow from "@/services/api/dialogflow";
export default {
  components: {
    MaterialCard,
    VTextFieldWithValidation,
    CommentToMSNUpdate,
  },
  filters: {
    formatDate: function (value) {
      return format(new Date(value), "d 'de' MMMM 'del' yyyy", {
        locale: es,
      });
    },
  },
  data: () => ({
    dialogImage: false,
    currentProduct: null,
    keyNumber: 0,
    productId: null,
    templateCountry: null,
    dialogTemplate: false,
    page: 1,
    pageCount: 0,
    loadingButton: false,
    search: "",
    dialog: false,
    headers: [
      {
        text: "Última modificación",
        align: "left",
        sortable: false,
        value: "date_modified",
        width: "10",
      },
      {
        text: "Nombre",
        align: "left",
        sortable: false,
        value: "name",
      },
      {
        text: "Referencia",
        align: "left",
        sortable: false,
        value: "ref",
      },
      {
        text: "Atributos",
        align: "left",
        sortable: false,
        value: "attributes",
      },
      {
        text: "Categorías",
        align: "left",
        sortable: false,
        value: "categories",
      },
      {
        text: "País",
        align: "left",
        sortable: false,
        value: "country",
      },
      {
        text: "Link",
        align: "left",
        sortable: false,
        value: "permalink",
      },
      { text: "Acciones", value: "action", sortable: false },
    ],
    [ENTITY]: [],
    advisors: [],
    editedIndex: -1,
    editedItem: CLASS_ITEMS(),
    defaultItem: CLASS_ITEMS(),
    menu1: false,
    menu2: false,
    filterWithoutRef: false,
    filterWithoutImage: false,
  }),
  computed: {
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
  },
  mounted() {
    this.initialize();
  },
  methods: {
    filterWithoutRefMethods() {
      if (this.filterWithoutRef) {
        this[ENTITY] = this[ENTITY].filter(
          (el) => el.ref == "" || !el.ref || el.ref == " "
        );
      } else
        this[ENTITY] = JSON.parse(
          JSON.stringify(this.$store.state.ecommercesModule.ecommerces)
        );
    },
    async initialize() {
      //llamada asincrona de items
      await Promise.all([
        this.$store.dispatch(ENTITY + "Module/list", {
          sort: "date_modified",
          order: -1,
        }),
      ]);
      //asignar al data del componente
      this[ENTITY] = this.$deepCopy(
        this.$store.state[ENTITY + "Module"][ENTITY]
      ).map((el) => ({ ...el, originalRef: el.ref }));
      //se agrego el campo ref original
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
        await this.$store.dispatch(this[ENTITY] + "Module/delete", itemId);
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
        console.log("actualizando: ", this.editedItem);
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
        console.log("creando...", this.editedItem);
        try {
          let newItem = await this.$store.dispatch(
            ENTITY + "Module/create",
            this.editedItem
          );
          this[ENTITY].push(newItem);
          this.close();
        } finally {
          this.loadingButton = false;
        }
      }
    },
    async saveCustomImage(id, item) {
      this.loadingButton = true;
      try {
        await this.$store.dispatch(ENTITY + "Module/update", {
          id,
          data: item,
        });
      } finally {
        this.loadingButton = false;
      }
    },
    // getProductReference(productName) {
    //   return getProductRef(productName);
    // },
    async updateRef(id, item) {
      //actualizando nombre corto en entidad dialogflow
      await dialogflow.updateEntityValue({
        country: item.country,
        value: item.originalRef,
        newValue: item.ref,
      });
      //actualizando originalRef
      item.originalRef = item.ref.trim();
      // actualizando el nombre corto en bd
      await this.$store.dispatch(ENTITY + "Module/update", {
        id: id,
        data: item,
      });
    },
    filterWithoutImageMethods() {
      // filtrando productos sin imagen
      if (this.filterWithoutImage) {
        this[ENTITY] = this[ENTITY].filter(
          (el) =>
            el.customImage == "" || !el.customImage || el.customImage == " "
        );
      } else
        this[ENTITY] = JSON.parse(
          JSON.stringify(this.$store.state.ecommercesModule.ecommerces)
        );
    },
  },
};
</script>

<style lang="scss" scoped></style>
