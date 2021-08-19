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
        <!-- <span>Filtrar por nombre</span>
        <v-text-field
          dense
          hide-details
          v-model="search"
          append-icon="search"
          placeholder="Escribe el nombre de producto"
          single-line
          outlined
        ></v-text-field> -->
        <!-- NIVEL 1 -->
        <div v-for="item in fatherItems" :key="item._id">
          <p @click="item.show = !item.show">
            <v-icon
              v-if="getChildrens(item.idCategory, item.country).length > 0"
              >mdi-menu-down</v-icon
            ><v-icon v-else>mdi-check</v-icon> <b>Nombre: </b>{{ item.name }} -
            {{ item.slug }} <b>País: </b> {{ item.country }}
            <a :href="item.url" target="_blank">Visitar </a>
          </p>
          <!-- NIVEL 2 -->
          <div
            style="margin-left:20px;"
            v-show="
              getChildrens(item.idCategory, item.country).length > 0 &&
                item.show
            "
            v-for="children in getChildrens(item.idCategory, item.country)"
            :key="children._id"
          >
            <div>
              <p @click="children.show = !children.show">
                <v-icon
                  v-if="
                    getChildrens(children.idCategory, children.country).length >
                      0
                  "
                  >mdi-menu-down</v-icon
                ><v-icon v-else>mdi-check</v-icon> <b>Nombre: </b>
                {{ children.name }} - {{ children.slug }}
              </p>
              <!-- NIVEL 3 -->
              <div
                style="margin-left:20px;"
                v-show="children.show"
                v-for="children2 in getChildrens(
                  children.idCategory,
                  children.country
                )"
                :key="children2._id"
              >
                <p @click="children2.show = !children2.show">
                  <v-icon
                    v-if="
                      getChildrens(children2.idCategory, children2.country)
                        .length > 0
                    "
                    >mdi-menu-down</v-icon
                  ><v-icon v-else>mdi-check</v-icon> <b>Nombre: </b>
                  {{ children2.name }} - {{ children2.slug }}
                </p>
                <!-- NIVEL 4 -->
                <div
                  style="margin-left:20px;"
                  v-show="children2.show"
                  v-for="children3 in getChildrens(
                    children2.idCategory,
                    children2.country
                  )"
                  :key="children3._id"
                >
                  <p @click="children3.show = !children3.show">
                    <v-icon
                      v-if="
                        getChildrens(children3.idCategory, children3.country)
                          .length > 0
                      "
                      >mdi-menu-down</v-icon
                    ><v-icon v-else>mdi-check</v-icon> <b>Nombre: </b>
                    {{ children3.name }} - {{ children3.slug }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <v-divider></v-divider>
        </div>
      </material-card>
    </v-row>
  </v-container>
</template>

<script>
//Nota: Modifica los campos de la tabla
const ENTITY = "ecommercesCategories"; // nombre de la entidad en minusculas (se repite en services y modules del store)
const CLASS_ITEMS = () =>
  import(`@/classes/${ENTITY.charAt(0).toUpperCase() + ENTITY.slice(1)}`);
// const ITEMS_SPANISH = 'marcas';
import { format } from "date-fns";
// import VTextFieldWithValidation from "@/components/inputs/VTextFieldWithValidation";
import MaterialCard from "@/components/material/Card";
import { es } from "date-fns/locale";
export default {
  components: {
    MaterialCard,
    // VTextFieldWithValidation,
  },
  filters: {
    formatDate: function(value) {
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
        value: "updatedAt",
      },
      {
        text: "ID",
        align: "left",
        sortable: false,
        value: "idCategory",
      },
      {
        text: "Nombre",
        align: "left",
        sortable: false,
        value: "name",
      },
      {
        text: "Slug",
        align: "left",
        sortable: false,
        value: "slug",
      },
      {
        text: "Padre",
        align: "left",
        sortable: false,
        value: "parent",
      },
      {
        text: "Menu Order",
        align: "left",
        sortable: false,
        value: "menu_order",
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
        value: "url",
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
    fatherItems() {
      return this[ENTITY].filter((item) => item.parent == 0);
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  async mounted() {
    await this.initialize();
    // let newItems = [];
  },
  methods: {
    async initialize() {
      //llamada asincrona de items
      // await Promise.all([this.$store.dispatch(ENTITY + "Module/list")]);
      //asignar al data del componente
      this[ENTITY] = this.$deepCopy(
        this.$store.state[ENTITY + "Module"][ENTITY]
      ).map((item) => ({ ...item, show: false }));
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
        } finally {
          this.loadingButton = false;
        }
      }
    },
    getChildrens(id, country) {
      return this.ecommercesCategories.filter((category) => {
        if (category.parent === id && category.country === country) {
          this.updateState(category._id);
          return true;
        } else return false;
      });
    },
    updateState(id) {
      let index = this.ecommercesCategories.findIndex(
        (category) => category._id == id
      );
      this.ecommercesCategories[index]["isTaken"] = true;
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  font-size: 1.3em;
  color: #000000;
  border-bottom: 1px;
  cursor: pointer;
  margin: 0px;
  height: 45px;
}
</style>
