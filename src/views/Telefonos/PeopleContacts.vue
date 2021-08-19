<template>
  <v-container>
    <v-row justify="center">
      <material-card
        width="1500px"
        icon="mdi-cellphone-dock"
        color="primary"
        title="Exportar contactos"
        text="Contactos de Google People"
      >
        <v-container fluid
          ><div>
            <h3><b>Agente: </b></h3>
            <span
              >{{ selectedTelefono.agenteId.nombre }}
              {{ selectedTelefono.agenteId.apellido }}</span
            >
          </div>
          <div>
            <h3><b>Número: </b></h3>
            <span>{{ selectedTelefono.numero }}</span>
          </div>
          <v-dialog v-model="dialog" width="800">
            <template v-slot:activator="{ on: dialog }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    @click="contactsPreview"
                    color="warning"
                    dark
                    v-on="{ ...tooltip, ...dialog }"
                    >Vista previa</v-btn
                  >
                </template>
                <span>100 primeros contactos</span>
              </v-tooltip>
            </template>
            <v-card>
              <v-toolbar color="primary" dark>
                <v-toolbar-title
                  >Vista previa de contactos (100 primeros)
                </v-toolbar-title>
              </v-toolbar>
              <v-container v-show="!contactsReady">
                <v-row justify="center">
                  <v-progress-circular
                    :size="70"
                    :width="7"
                    color="purple"
                    indeterminate
                  ></v-progress-circular>
                </v-row>
              </v-container>
              <v-container v-show="contactsReady">
                <p>
                  <b>Agente: </b>{{ selectedTelefono.agenteId.nombre }}
                  {{ selectedTelefono.agenteId.apellido }}
                </p>
                <p><b>Teléfono: </b>{{ selectedTelefono.numero }}</p>
                <p><b>Cantidad de ítems: </b>{{ totalItems }}</p>
                <p><b>Cantidad de contactos: </b>{{ totalPeople }}</p>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          ID People
                        </th>
                        <th class="text-left">
                          Nombres Completos
                        </th>
                        <th class="text-left">
                          Nombres
                        </th>
                        <th class="text-left">
                          Apellidos
                        </th>
                        <th class="text-left">
                          Celular
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(contact, index) in contacts" :key="index">
                        <td>{{ contact.resourceName }}</td>
                        <td>
                          {{
                            contact.names ? contact.names[0].displayName : ""
                          }}
                        </td>
                        <td>
                          {{ contact.names ? contact.names[0].middleName : "" }}
                        </td>
                        <td>
                          {{ contact.names ? contact.names[0].familyName : "" }}
                        </td>
                        <td>
                          {{
                            contact.phoneNumbers
                              ? contact.phoneNumbers[0].canonicalForm
                              : ""
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table></v-container
              >
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false"
                  >De acuerdo</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-badge class="ml-3" bordered color="error" icon="mdi-lock" overlap>
            <v-btn
              @click="contactsExport"
              class="white--text"
              color="error"
              depressed
              :disabled="percentage.percentage == 100"
            >
              Exportar
            </v-btn>
          </v-badge>
          <v-btn
            @click="restartContacts"
            class="white--text ml-2"
            color="error"
            depressed
          >
            Reiniciar contactos
          </v-btn>
          <v-progress-linear
            disabled
            class="mt-3"
            v-model="percentage.percentage"
            height="25"
          >
            <strong>{{ Math.ceil(percentage.percentage) }}%</strong>
          </v-progress-linear>
          <h2 class="text-center mt-3">
            Exportados {{ percentage.itemsExported }} de
            {{ percentage.totalItems }}
          </h2>
          <v-alert
            v-if="percentage.error"
            class="mt-3"
            type="error"
            :value="true"
          >
            Algo salio mal... intenta nuevamente
          </v-alert>
        </v-container>
      </material-card>
    </v-row>
  </v-container>
</template>

<script>
import MaterialCard from "@/components/material/Card";
import api from "@/services/api/contactsPercentages";
import axios from "axios";
export default {
  components: {
    MaterialCard,
  },
  async mounted() {
    if (this.selectedTelefono.credenciales.access_token == "") {
      this.$store.commit(
        "setSelectedTelefono",
        await this.$store.dispatch(
          "telefonosModule/listOne",
          this.$route.params.id
        )
      );
    }
    api.list({ telefonoId: this.$route.params.id }).then((res) => {
      if (res.data.payload.length > 0 && res.data.payload[0].percentage > 0)
        this.contactsExport();
    });
  },
  data() {
    return {
      knowledge: 97,
      dialog: false,
      contacts: [],
      totalItems: 0,
      totalPeople: 0,
      contactsReady: false,
      percentage: { percentage: 0 },
      bucle: false,
      bucleError: false,
    };
  },
  computed: {
    selectedTelefono() {
      return this.$store.state.selectedTelefono;
    },
  },
  methods: {
    contactsPreview() {
      if (this.contacts.length === 0) {
        this.contactsReady = false;
        axios
          .post("/api/google-people/contacts-preview", {
            ...this.selectedTelefono.credenciales,
          })
          .then((res) => {
            this.contacts = res.data.payload.connections;
            this.totalItems = res.data.payload.totalItems;
            this.totalPeople = res.data.payload.totalPeople;
            this.contactsReady = true;
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    async contactsExport() {
      console.log("exportando...");
      while (this.percentage.percentage < 99 && !this.bucleError) {
        this.bucle = true;
        console.log("nuevo bucle..");
        try {
          let res = await axios.post("/api/google-people/contacts-export", {
            telefonoId: this.selectedTelefono._id,
            ...this.selectedTelefono.credenciales,
          });
          this.percentage = res.data.payload;
          console.log("el porcentaje: ", this.percentage);
          if (this.percentage.error) throw Error("error");
          await this.timeout(2000);
        } catch (error) {
          this.bucle = false;
          this.bucleError = true;
        }
      }
    },
    timeout(millis) {
      return new Promise((resolve) => {
        setTimeout(resolve, millis);
      });
    },
    restartContacts() {
      axios
        .delete(
          "/api/contactos/deletes-by-telefonoid/" + this.selectedTelefono._id
        )
        .then(() => {
          this.percentage.percentage = 0;
        })
        .catch((err) => {
          console.error(err);
        });
      console.log("reiniciando...");
    },
  },
};
</script>

<style lang="scss" scoped></style>
