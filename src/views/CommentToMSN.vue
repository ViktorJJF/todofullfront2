<template>
  <v-container>
    <v-row justify="center">
      <material-card
        width="100%"
        icon="mdi-cellphone-dock"
        color="primary"
        title="Comments To MSN"
        text="Tabla resumen de comments to MSN"
      >
        <v-data-table
          no-results-text="No se encontraron resultados"
          :search="search"
          hide-default-footer
          :headers="headers"
          :items="filteredCommentsFacebook"
          sort-by="calories"
          @page-count="pageCount = $event"
          :page.sync="page"
          :items-per-page="$store.state.itemsPerPage"
        >
          <template v-slot:top>
            <v-container>
              <span class="font-weight-bold"
                >Filtrar por URL: {{ search }}</span
              >
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    dense
                    hide-details
                    v-model="search"
                    append-icon="search"
                    placeholder="Escribe la url"
                    single-line
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-dialog v-model="dialog" max-width="800px">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        @click="clearResponses"
                        color="primary"
                        dark
                        class="mb-2"
                        v-on="on"
                        >{{
                          isCommentView ? "Agregar publicación" : "Agregar Ad"
                        }}</v-btn
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
                              <p class="body-1 font-weight-bold">URL</p>
                              <VTextFieldWithValidation
                                rules="required"
                                v-model="editedItem.postUrl"
                                label="Ingresa la URL"
                              />
                            </v-col>
                            <v-row
                              v-show="getBotId(editedItem.postUrl)"
                              class="mb-2"
                            >
                              <v-col cols="12" sm="6">
                                <b>País: </b>
                                {{
                                  getBotId(editedItem.postUrl)
                                    ? getBotId(editedItem.postUrl).country
                                    : ""
                                }}
                              </v-col>
                            </v-row>
                            <v-col cols="12" sm="12" md="12">
                              <p class="body-1 font-weight-bold">
                                Selecciona una plantilla
                              </p>
                              <v-autocomplete
                                :disabled="!getBotId(editedItem.postUrl)"
                                item-text="nameWithCountry"
                                item-value="_id"
                                :search-input.sync="searchProduct"
                                v-model="selectedProducts"
                                :items="products"
                                chips
                                clearable
                                label="Busca los productos"
                                prepend-icon="mdi-filter-variant"
                                no-data-text="No se encontraron productos"
                                no-filter
                                solo
                                @change="deleteCurrentSearch"
                              >
                                <template
                                  v-slot:selection="{
                                    attrs,
                                    item,
                                    select,
                                    selected,
                                  }"
                                >
                                  <v-chip
                                    v-bind="attrs"
                                    :input-value="selected"
                                    close
                                    @click="select"
                                    @click:close="remove(item)"
                                    color="deep-purple accent-4"
                                    outlined
                                  >
                                    <strong>{{ item.name }}</strong>
                                  </v-chip>
                                </template>
                              </v-autocomplete>
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
                            >Crear</v-btn
                          >
                        </v-card-actions>
                      </ValidationObserver>
                    </v-card>
                  </v-dialog>
                </v-col>
                <v-col cols="12" sm="6">
                  <span class="font-weight-bold">Filtrar por Fanpage</span>
                  <v-select
                    clearable
                    dense
                    hide-details
                    placeholder="Selecciona la fanpage"
                    outlined
                    :items="$store.state.botsModule.bots"
                    item-text="fanpageName"
                    item-value="_id"
                    v-model="filterByFanpage"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  <span>
                    <strong>Mostrando:</strong>
                    {{ filteredCommentsFacebook.length }} registros
                  </span>
                </v-col>
                <div class="text-center pt-2">
                  <v-pagination
                    v-model="page"
                    :length="pageCount"
                  ></v-pagination>
                </div>
              </v-row>
            </v-container>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-btn
              class="mr-3 mb-1"
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
              >Aún no cuentas con commentsFacebook</v-alert
            >
          </template>
          <template v-slot:[`item.postUrl`]="{ item }">
            <a :href="item.postUrl" target="_blank">{{ item.postUrl }}</a>
          </template>
          <template v-slot:[`item.responses`]="{ item }">
            <v-chip
              v-show="item.responses.some((response) => response === '')"
              class="ma-2"
              color="red"
              text-color="white"
            >
              Faltan Respuestas
            </v-chip>
            <v-chip
              v-show="!item.responses.some((response) => response === '')"
              class="ma-2"
              color="success"
              text-color="white"
            >
              OK
            </v-chip>
          </template>
          <template v-slot:[`item.updatedAt`]="{ item }">{{
            item.updatedAt | formatDate
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
              $store.state.itemsPerPage > commentsFacebook.length
                ? commentsFacebook.length
                : $store.state.itemsPerPage
            }}
            de {{ commentsFacebook.length }} registros
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
import CommentsFacebook from "@/classes/CommentsFacebook";
import { es } from "date-fns/locale";
import { getRandomInt } from "@/utils/utils";
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
    selectedProducts: null,
    products: [],
    searchProduct: "",
    filterByFanpage: null,
    page: 1,
    pageCount: 0,
    loadingButton: false,
    search: "",
    dialog: false,
    paises: ["Peru", "Chile", "Colombia"],
    headers: [
      {
        text: "Fecha",
        align: "left",
        sortable: false,
        value: "updatedAt",
      },
      // {
      //   text: "Estado de respuestas",
      //   align: "left",
      //   sortable: false,
      //   value: "responses",
      // },
      {
        text: "URL",
        align: "left",
        sortable: false,
        value: "postUrl",
      },
      {
        text: "País",
        align: "left",
        sortable: true,
        value: "botId.country",
      },
      { text: "Acciones", value: "action", sortable: false },
    ],
    commentsFacebook: [],
    editedIndex: -1,
    editedItem: CommentsFacebook(),
    defaultItem: CommentsFacebook(),
    type: "comment",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nuevo URL"
        : "Editar respuestas de publicación";
    },
    filteredCommentsFacebook() {
      return this.filterByFanpage
        ? this.commentsFacebook
            .filter((comment) => comment.botId._id == this.filterByFanpage)
            .filter((el) => el.type == this.type)
        : this.commentsFacebook.filter(
            (el) =>
              el.type == (this.$route.name == "CommentToMSN" ? "comment" : "ad")
          );
    },
    isCommentView() {
      return this.$route.name == "CommentToMSN";
    },
  },

  watch: {
    async searchProduct() {
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() => {
        this.getProducts(1);
      }, 600);
    },
    dialog(val) {
      val || this.close();
    },
    "$route.name": function () {
      let isCommentView = this.$route.name == "CommentToMSN";
      this.type = isCommentView ? "comment" : "ad";
    },
  },

  mounted() {
    this.initialize();
  },

  methods: {
    async initialize() {
      await Promise.all([
        this.$store.dispatch("commentsFacebookModule/list", {
          limit: 9999,
        }),
      ]);
      this.commentsFacebook = this.$deepCopy(
        this.$store.state.commentsFacebookModule.commentsFacebook
      );
    },
    initializeAds() {
      console.log("iniciando...");
    },
    editItem(item) {
      this.editedIndex = this.commentsFacebook.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.$router.push({
        name: this.isCommentView ? "CommentToMSNUpdate" : "AdToMSNUpdate",
        params: { id: item._id },
      });
    },

    async deleteItem(item) {
      const index = this.commentsFacebook.indexOf(item);
      let itemId = this.commentsFacebook[index]._id;
      if (await this.$confirm("¿Realmente deseas eliminar este registro?")) {
        await this.$store.dispatch("commentsFacebookModule/delete", itemId);
        this.commentsFacebook.splice(index, 1);
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.selectedProducts = null;
        this.products = [];
        this.editedIndex = -1;
      }, 300);
    },

    async save() {
      this.loadingButton = true;
      this.editedItem.botId = this.getBotId(this.editedItem.postUrl)._id;
      if (this.editedIndex > -1) {
        let itemId = this.commentsFacebook[this.editedIndex]._id;
        try {
          await this.$store.dispatch("commentsFacebookModule/update", {
            id: itemId,
            data: this.editedItem,
          });
          Object.assign(
            this.commentsFacebook[this.editedIndex],
            this.editedItem
          );
          this.close();
        } finally {
          this.loadingButton = false;
        }
      } else {
        //create item
        try {
          //agregando tipo comment/add
          this.editedItem.type = this.isCommentView ? "comment" : "ad";
          // verificando si se agrego plantilla
          if (this.selectedProducts) {
            // agregando plantilla
            if (this.products.length > 0) {
              const product = this.products[0];
              await this.generateTemplate(product);
            }
          }
          let newItem = await this.$store.dispatch(
            "commentsFacebookModule/create",
            this.editedItem
          );
          this.commentsFacebook.unshift(newItem);
          this.close();
        } finally {
          this.loadingButton = false;
        }
      }
    },
    async getProducts(page = 1) {
      if (!this.searchProduct) return;
      //llamada asincrona de items
      await Promise.all([
        this.$store.dispatch("ecommercesModule/list", {
          country: this.getCountryByPostLink(this.editedItem.postUrl),
          sort: "name",
          page,
          search: this.searchProduct,
          fieldsToSearch: ["name"],
          listType: "All",
        }),
      ]);
      //asignar al data del componente
      this.rawProducts = this.products = this.$deepCopy(
        this.$store.state.ecommercesModule.ecommerces
      ).map((el) => ({ ...el, nameWithCountry: el.name + ` (${el.country})` }));
    },
    deleteCurrentSearch() {
      this.searchProduct = "";
    },
    clearResponses() {
      if (this.editedIndex == -1) {
        this.responses = ["", "", ""];
      }
    },
    getBotId(link) {
      if (link.trim().length > 0)
        return this.$store.state.botsModule.bots.find(
          (bot) =>
            bot.country == this.getCountryByPostLink(link) ||
            link.includes(bot.fanpageId)
        );
    },
    getCountryByPostLink(link) {
      let bots = this.$store.state.botsModule.bots;
      let country;
      bots.forEach((bot) => {
        if (
          link
            .toLowerCase()
            .includes(bot.fanpageName.toLowerCase().replace("@", "")) ||
          link.toLowerCase().includes(bot.fanpageId)
        ) {
          return (country = bot.country);
        }
      });
      return country;
    },
    remove(item) {
      this.products.splice(this.products.indexOf(item), 1);
      this.products = [...this.products];
      this.selectedProducts = null;
    },
    async generateTemplate(product) {
      await this.$store.dispatch("facebookLabelsModule/list", { limit: 9999 });
      // obteniendo etiquetas emparejadas con categorias
      let facebookLabels = [];
      product.categories.forEach((category) => {
        facebookLabels.push(
          ...this.$store.getters["facebookLabelsModule/getLabelsByCategoryId"](
            category._id
          )
        );
        console.log(
          "etiquetas: ",
          this.$store.getters["facebookLabelsModule/getLabelsByCategoryId"](
            category._id
          )
        );
      });
      // el resto del template
      this.editedItem.postImgUrl =
        product.images[getRandomInt(0, product.images.length - 1)].src;
      this.editedItem.products = [product._id];
      this.editedItem.selectedCategories = [
        {
          categoryId: product.categories[0]._id,
          categoryName: product.categories[0].name,
          productId: product._id,
        },
      ];
      this.editedItem.responses = ["", "", "", ""];
      this.editedItem.selectedLabel =
        facebookLabels.length > 0 ? facebookLabels[0]._id : null;
      this.editedItem.selectedLabelIndex = facebookLabels.length > 0 ? 0 : null;
      this.editedItem.selectedUrl = product.permalink;
      this.editedItem.selectedUrlIndex = 0;
    },
  },
};
</script>

<style lang="scss" scoped></style>
