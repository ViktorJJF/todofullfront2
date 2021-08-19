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
          :items="filteredLabels"
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
                    placeholder="Escribe el nombre de la etiqueta"
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
                              <p class="body-1 font-weight-bold">
                                Nombre de etiqueta en FB
                              </p>
                              <VTextFieldWithValidation
                                rules=""
                                v-model="editedItem.name"
                                label="Nombre de la etiqueta de FB"
                              />
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">Fuente</p>
                              <v-select
                                v-model="editedItem.fanpageId"
                                :items="sourceSelectList"
                                hide-selected
                                item-value="fanpageId"
                                item-text="name"
                                placeholder="Selecciona la fanpage"
                                outlined
                                dense
                                class="mt-2"
                                clearable
                              >
                              </v-select>
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
          <template v-slot:[`item.fanpageId`]="{ item }">
            {{
              $store.state.botsModule.bots.find(
                (el) => el.fanpageId === item.fanpageId
              ).name
            }}
          </template>
          <template v-slot:[`item.todofullLabelId`]="{ item }">
            <v-select
              v-show="item.showSelect == 0 && !item.foreignLabelId"
              v-model="selectedOption"
              :items="[
                'Todofull',
                'Categorías',
                'Etiquetas Woocommerce',
                'Atributos',
              ]"
              @change="
                item.showSelect = 1;
                fetchOptionData(selectedOption);
              "
              hide-selected
              placeholder="Selecciona una opción"
              outlined
              dense
              class="mt-2"
            >
            </v-select>
            <v-select
              v-show="item.showSelect == 1"
              v-model="item.foreignLabelId"
              :items="[...labelsNames, { nameWithCountry: 'Volver Atrás' }]"
              item-text="nameWithCountry"
              return-object
              @change="updateFacebookLabel(item)"
              hide-selected
              placeholder="Selecciona una opción"
              outlined
              dense
              class="mt-2"
            ></v-select>
            <v-select
              v-if="item.foreignLabelId && item.showSelect != 1"
              v-model="item.foreignLabelId.name"
              :items="[item.foreignLabelId.name, 'Editar Selección']"
              @change="
                item.foreignLabelId.name == 'Editar Selección'
                  ? (item.foreignLabelId = null)
                  : null
              "
              hide-selected
              placeholder="Selecciona una opción"
              outlined
              dense
              class="mt-2"
            >
            </v-select>
            <!-- <v-select
              v-model="item.todofullLabelId"
              :items="todofullLabels"
              @change="updateFacebookLabel(item)"
              hide-selected
              item-value="_id"
              item-text="name"
              placeholder="Selecciona el nombre"
              outlined
              dense
              class="mt-2"
              clearable
            >
            </v-select> -->
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
          <template v-slot:[`item.updatedAt`]="{ item }">{{
            item.updatedAt | formatDate
          }}</template>
          <template v-slot:[`item.url`]="{ item }">
            <a :href="item.url" target="_blank"
              ><v-btn color="primary" small>Visitar</v-btn>
            </a>
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
  </v-container>
</template>

<script>
//Nota: Modifica los campos de la tabla
const ENTITY = "facebookLabels"; // nombre de la entidad en minusculas (se repite en services y modules del store)
const CLASS_ITEMS = () =>
  import(`@/classes/${ENTITY.charAt(0).toUpperCase() + ENTITY.slice(1)}`);
// const ITEMS_SPANISH = 'marcas';
import { format } from "date-fns";
import VTextFieldWithValidation from "@/components/inputs/VTextFieldWithValidation";
import MaterialCard from "@/components/material/Card";
import { es } from "date-fns/locale";
import graphApi from "@/services/api/graphApi";
export default {
  components: {
    MaterialCard,
    VTextFieldWithValidation,
  },
  filters: {
    formatDate: function (value) {
      return format(
        new Date(value),
        "d 'de' MMMM 'del' yyyy 'a las' hh:mm:ss aaa",
        {
          locale: es,
        }
      );
    },
  },
  data: () => ({
    showSelect: 0,
    selectedOption: null,
    page: 1,
    pageCount: 0,
    loadingButton: false,
    search: "",
    dialog: false,
    headers: [
      // {
      //   text: "Última modificación",
      //   align: "left",
      //   sortable: false,
      //   value: "updatedAt",
      // },
      {
        text: "ID",
        align: "left",
        sortable: false,
        value: "idLabel",
      },
      {
        text: "Nombre en Facebook",
        align: "left",
        sortable: false,
        value: "name",
      },
      {
        text: "FANPAGE",
        align: "left",
        sortable: true,
        value: "fanpageId",
      },
      {
        text: "Nombre Personalizado",
        value: "todofullLabelId",
        sortable: false,
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
    todofullLabels: [],
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
    filteredLabels() {
      return this[ENTITY].filter((el) => !el.name.includes("ad_id.")).map(
        (el) =>
          el.foreignLabelId
            ? {
                ...el,
                foreignLabelId: this.searchLabelsInfoById(el.foreignLabelId),
                showSelect: 0,
              }
            : { ...el, showSelect: 0 }
      );
    },
    sourceSelectList() {
      return [
        ...this.$store.state.botsModule.bots.map((bot) => ({
          _id: bot._id,
          fanpageId: bot.fanpageId,
          name: bot.name,
        })),
      ];
    },
    labelsNames() {
      switch (this.selectedOption) {
        case "Todofull":
          this.$store.state.todofullLabelsModule;
          return this.todofullLabels.map((el) => ({
            name: el.name,
            _id: el._id,
            country: el.country,
            nameWithCountry: el.name + (el.country ? ` (${el.country})` : ""),
            source: "TodofullLabels",
          }));
        case "Categorías":
          return this.$store.state.ecommercesCategoriesModule.ecommercesCategories.map(
            (el) => ({
              name: el.name,
              _id: el._id,
              country: el.country,
              nameWithCountry: el.name + (el.country ? ` (${el.country})` : ""),
              source: "EcommercesCategories",
            })
          );
        case "Etiquetas Woocommerce":
          return this.$store.state.ecommercesTagsModule.ecommercesTags.map(
            (el) => ({
              name: el.name,
              _id: el._id,
              country: el.country,
              nameWithCountry: el.name + (el.country ? ` (${el.country})` : ""),
              source: "EcommercesTags",
            })
          );
        case "Atributos":
          return this.getAttributesWithValues(
            this.$store.state.ecommercesAttributesModule.ecommercesAttributes
          );
        default:
          return [
            "Todofull",
            "Categorías",
            "Etiquetas Woocommerce",
            "Atributos",
          ];
      }
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
      //llamada asincrona de items
      await Promise.all([
        this.$store.dispatch(ENTITY + "Module/list", {
          sort: "name",
          order: 1,
        }),
        this.$store.dispatch("todofullLabelsModule/list", {
          sort: "name",
          order: 1,
        }),
      ]);
      //asignar al data del componente
      this[ENTITY] = this.$store.state[ENTITY + "Module"][ENTITY];

      this.todofullLabels = this.$store.state.todofullLabelsModule.todofullLabels;
    },
    editItem(item) {
      this.editedIndex = this[ENTITY].indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async deleteItem(item) {
      let index = this[ENTITY].findIndex((entity) => entity._id == item._id);
      let itemId = item._id;
      let fbLabelId = item.idLabel;
      let fanpageId = item.fanpageId;
      if (await this.$confirm("¿Realmente deseas eliminar este registro?")) {
        //eliminando de fb
        try {
          await graphApi.deleteLabel(fbLabelId, fanpageId);
          //eliminando de todofull
          await this.$store.dispatch(ENTITY + "Module/delete", itemId);
          this[ENTITY].splice(index, 1);
        } catch (error) {
          console.log(error);
        }
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
          //creando etiqueta en fb
          let facebookLabelId = (
            await graphApi.createLabel({
              fanpageId: this.editedItem.fanpageId,
              name: this.editedItem.name,
            })
          ).data.payload.label.id;
          //agregando id de etiqueta creada de fb
          this.editedItem["idLabel"] = facebookLabelId;
          //creando etiqueta en todofull

          await this.$store.dispatch(ENTITY + "Module/create", this.editedItem);
          // this[ENTITY].unshift(newItem);
          this.close();
        } finally {
          this.loadingButton = false;
        }
      }
    },
    async updateFacebookLabel(newItem) {
      if (newItem.foreignLabelId.nameWithCountry == "Volver Atrás") {
        //volver atras en el menu
        this.selectedOption = null;
        newItem.foreignLabelId = null;
        this.showSelect = 0;
      } else {
        //colocando id y fuente
        newItem.source = newItem.foreignLabelId.source;
        newItem.foreignLabelId = newItem.foreignLabelId._id;
        try {
          await this.$store.dispatch(ENTITY + "Module/update", {
            id: newItem._id,
            data: newItem,
          });
          //actializando localmente
          setTimeout(async () => {
            await this.initialize();
            this.showSelect = 0;
            this.selectedOption = null;
          }, 0);
        } finally {
          this.loadingButton = false;
        }
      }
    },
    generateLabels(selectedOption, id) {
      console.log(selectedOption, id);
      // switch (key) {

      //   case value:
      //     break;

      //   default:
      //     break;
      // }
    },
    fetchOptionData(selectedOption) {
      console.log("la opcion: ", selectedOption);
      switch (selectedOption) {
        case "Todofull":
          // this.$store.state.todofullLabelsModule;
          break;
        case "Categorías":
          // this.$store.dispatch("ecommercesCategoriesModule/list", {
          //   sort: "name",
          //   order: 1,
          // });
          break;
        case "Etiquetas Woocommerce":
          // this.$store.dispatch("ecommercesTagsModule/list", {
          //   sort: "name",
          //   order: 1,
          // });
          break;
        default:
          return [
            "Todofull",
            "Categorías",
            "Etiquetas Woocommerce",
            // "Atributos",
          ];
      }
    },
    searchLabelsInfoById(id) {
      //buscar info en fuentes de datos categorias/etiquetas/todofull
      let data = [
        ...this.$store.state.ecommercesCategoriesModule.ecommercesCategories,
        ...this.$store.state.ecommercesTagsModule.ecommercesTags,
        ...this.$store.state.todofullLabelsModule.todofullLabels,
        ...this.getAttributesWithValues(
          this.$store.state.ecommercesAttributesModule.ecommercesAttributes
        ),
      ];
      return data.find((el) => el._id == id);
    },
    getAttributesWithValues(attributes) {
      let attributesWithValues = [];
      for (const attribute of attributes) {
        for (const term of attribute.terms) {
          attributesWithValues.push({
            name: attribute.name + " " + term.name,
            _id: term._id,
            country: attribute.woocommerceId.country,
            nameWithCountry:
              attribute.name +
              " " +
              term.name +
              (attribute.woocommerceId.country
                ? ` (${attribute.woocommerceId.country})`
                : ""),
            source: "EcommercesAttributes",
          });
        }
      }
      return attributesWithValues.sort((a, b) =>
        this.sortAlphabetically(a, b, "nameWithCountry")
      );
    },
    sortAlphabetically(a, b, attribute) {
      var textA = a[attribute].toUpperCase();
      var textB = b[attribute].toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    },
  },
};
</script>

<style lang="scss" scoped></style>
