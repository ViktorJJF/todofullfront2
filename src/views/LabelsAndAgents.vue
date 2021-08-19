<template>
  <div class="leads">
    <material-card
      width="100%"
      icon="mdi-cellphone-dock"
      color="primary"
      title="Leads"
      text="Tabla resumen de leads"
    >
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left pa-3"><b>Agentes</b></th>
              <th class="text-left"><b>Etiquetas</b></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(telefono, telefonosIndex) in activeTelefonos"
              :key="'6-' + telefonosIndex"
            >
              <td>
                {{ telefono.agenteId.nombre }} {{ telefono.agenteId.apellido }}
              </td>
              <td>
                <v-combobox
                  item-text="nameWithCountry"
                  :search-input.sync="searchLabel"
                  v-model="telefono.labels"
                  item-value="_id"
                  :items="[
                    ...labelsFromTodoFull,
                    ...labelsFromPeru,
                    ...labelsFromChile,
                  ]"
                  multiple
                  chips
                  no-data-text="No se encontraron etiquetas"
                  label="Busca las etiquetas"
                  @change="updateLabels(telefono._id, telefono, $event)"
                >
                  <template
                    v-slot:selection="{ attrs, item, select, selected }"
                  >
                    <v-chip
                      v-bind="attrs"
                      :input-value="selected"
                      close
                      @click="select"
                      @click:close="remove(telefono, item)"
                      color="deep-purple accent-4"
                      outlined
                    >
                      <strong>{{ item.name }} {{ item.country }}</strong>
                    </v-chip>
                  </template>
                </v-combobox>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </material-card>
  </div>
</template>

<script>
import { format } from "date-fns";
import MaterialCard from "@/components/material/Card";
import { es } from "date-fns/locale";
export default {
  components: {
    MaterialCard,
  },
  filters: {
    formatDate: function (value) {
      return format(new Date(value), "d 'de' MMMM 'del' yyyy", {
        locale: es,
      });
    },
  },
  data: () => ({
    telefonos: [],
    labels: [],
    checkbox: false,
    searchLabel: "",
  }),

  watch: {},

  mounted() {
    this.initialize();
  },
  computed: {
    labelsFromTodoFull() {
      return this.labels
        .filter((el) => !el.country)
        .sort((a, b) => this.sortAlphabetically(a, b, "name"))
        .map((el) => ({ ...el, nameWithCountry: el.name }));
    },
    labelsFromPeru() {
      return this.labels
        .filter((el) => el.country === "Peru")
        .sort((a, b) => this.sortAlphabetically(a, b, "name"))
        .map((el) => ({
          ...el,
          nameWithCountry: `${el.name} (${el.country})`,
        }));
    },
    labelsFromChile() {
      return this.labels
        .filter((el) => el.country === "Chile")
        .sort((a, b) => this.sortAlphabetically(a, b, "name"))
        .map((el) => ({
          ...el,
          nameWithCountry: `${el.name} (${el.country})`,
        }));
    },
    activeTelefonos() {
      return this.telefonos.filter((el) => el.active);
    },
  },

  methods: {
    initialize() {
      // inicializando agentes
      this.telefonos = this.$deepCopy(
        this.$store.state.telefonosModule.telefonos
      );

      this.agentes = this.$store.state.agentesModule.agentes;
      // inicializando etiquetas de todofull
      this.labels = [
        ...this.$store.state.ecommercesCategoriesModule.ecommercesCategories,
        ...this.$store.state.ecommercesTagsModule.ecommercesTags,
        ...this.$store.state.todofullLabelsModule.todofullLabels,
        ...this.getAttributesWithValues(
          this.$store.state.ecommercesAttributesModule.ecommercesAttributes
        ),
      ];
      // agregando labels y dando formato adecuado
      this.telefonos = this.telefonos.map((el) => {
        if (!el.labels) {
          el["labels"] = [];
        }
        return el;
      });
      for (let i = 0; i < this.telefonos.length; i++) {
        this.telefonos[i].labels = this.telefonos[i].labels.map((el) =>
          this.labels.find((label) => label._id == el)
        );
      }
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
    async updateLabels(id, editedItem, labels) {
      let editedItemSave = JSON.parse(JSON.stringify(editedItem));
      editedItemSave.labels = labels.map((el) => el._id);
      this.searchLabel = "";
      await this.$store.dispatch("telefonosModule/update", {
        id,
        data: editedItemSave,
      });
    },
    remove(telefono, item) {
      telefono.labels = telefono.labels.filter((el) => el._id != item._id);
      this.updateLabels(telefono._id, telefono, telefono.labels);
    },
  },
};
</script>

<style lang="scss" scoped>
table,
th,
td {
  border: 1px solid black;
}
.regular-checkbox {
  -webkit-appearance: none;
  background-color: #fafafa;
  border: 1px solid #cacece;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
  padding: 9px;
  border-radius: 3px;
  display: inline-block;
  position: relative;
}
.regular-checkbox:active,
.regular-checkbox:checked:active {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0px 1px 3px rgba(0, 0, 0, 0.1);
}

.regular-checkbox:checked {
  background-color: #e9ecee;
  border: 1px solid #adb8c0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05),
    inset 15px 10px -12px rgba(255, 255, 255, 0.1);
  color: #99a1a7;
}
.regular-checkbox:checked:after {
  content: "\2714";
  font-size: 14px;
  position: absolute;
  top: 0px;
  left: 3px;
  color: #99a1a7;
}

#header-fixed {
  position: fixed;
  top: 0px;
  display: none;
  background-color: white;
}
</style>
