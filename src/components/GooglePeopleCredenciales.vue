<template>
  <v-container fluid>
    <h1 class="mb-3">
      Credenciales
    </h1>
    <v-row>
      <v-col cols="12" sm="12">
        <v-btn @click="generateURL" color="primary" class="mr-2"
          >Generar URL</v-btn
        >
        <v-badge bordered color="error" icon="mdi-lock" overlap>
          <v-btn class="white--text" color="error" depressed>
            <a :href="googlePeopleURL" target="”_blank”">Autorizar</a>
          </v-btn>
        </v-badge>
        <p v-show="googlePeopleURL">URL generada!</p>
      </v-col>
      <v-col cols="12" sm="12">
        <h3>Coloca la URL generada aquí</h3>
      </v-col>
      <v-col cols="12" sm="9">
        <v-text-field
          v-model="generatedURL"
          outlined
          dense
          id="id"
          placeholder="http://localhost/?code=4/0AY0e-g5BwwCMD0Ld-3B3W-JXadRHqJ-YOlliDWqufqK8zqxYD7CAqLgcjFEgaiv7kSylLw&scope=email%20profile%20https://www.googleapis.com/auth/directory.readonly%20https://www.googleapis.com/auth/user.emails.read%20https://www.googleapis.com/auth/contacts.other.readonly%20https://www.googleapis.com/auth/contacts.readonly%20https://www.googleapis.com/auth/contacts%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20openid&authuser=0&prompt=consent"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-btn @click="generateTokens" color="primary">Generar tokens</v-btn>
      </v-col>
      <v-col cols="12" sm="9">
        <v-card>
          <v-container fluid>
            <h3 class="mb-3">Tus tokens</h3>
            <v-text-field
              v-model="credenciales.access_token"
              dense
              outlined
              label="access_token"
            ></v-text-field>
            <v-text-field
              v-model="credenciales.refresh_token"
              dense
              outlined
              label="refresh_token"
            ></v-text-field>
            <v-text-field
              v-model="credenciales.scope"
              dense
              outlined
              label="scope"
            ></v-text-field>
            <v-text-field
              v-model="credenciales.token_type"
              dense
              outlined
              label="token_type"
            ></v-text-field>
            <v-text-field
              v-model="credenciales.id_token"
              dense
              outlined
              label="id_token"
            ></v-text-field>
            <v-text-field
              v-model="credenciales.expiry_date"
              dense
              outlined
              label="expiry_date"
            ></v-text-field>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      googlePeopleURL: null,
      generatedURL: null,
      credenciales: {},
    };
  },
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.telefonos = this.$deepCopy(
        this.$store.state.telefonosModule.telefonos
      );
      let telefono = this.telefonos.find(
        (telefono) => telefono._id === this.$route.params.id
      );
      this.credenciales = telefono.credenciales;
    },
    generateURL() {
      console.log(
        "las credenciales: ",
        this.$route.params.clientId,
        this.$route.params.clientSecret
      );
      axios
        .post("/api/google-people/generateurl", {
          clientId: this.$route.params.clientId,
          clientSecret: this.$route.params.clientSecret,
        })
        .then((res) => {
          console.log(res.data);
          this.googlePeopleURL = res.data.payload;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    generateTokens() {
      axios
        .post("/api/google-people/generatetokens", {
          clientId: this.$route.params.clientId,
          clientSecret: this.$route.params.clientSecret,
          code: this.extractCode(this.generatedURL),
        })
        .then((res) => {
          this.credenciales = res.data.payload;
          this.updateCredencialesDB();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    extractCode(code) {
      let from = this.generatedURL.indexOf("code=");
      let to = this.generatedURL.indexOf("&");
      return code.substring(from + 5, to);
    },
    updateCredencialesDB() {
      this.$store.dispatch("telefonosModule/update", {
        id: this.$route.params.id,
        data: {
          credenciales: this.credenciales,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  color: #ffffff;
  text-decoration: none;
}
</style>
