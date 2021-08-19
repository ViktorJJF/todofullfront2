<template>
  <v-navigation-drawer color="#040505" dark v-model="drawer" app width="300">
    <v-list>
      <v-list-item>
        <v-img
          aspect-ratio="1.7"
          contain
          src="/images/logo/mujeron.jpg"
        ></v-img>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">{{ user }}</v-list-item-title>
          <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
        </v-list-item-content>

        <!-- <v-list-item-action>
          <v-icon>mdi-menu-down</v-icon>
        </v-list-item-action>-->
      </v-list-item>
      <div class="text-center">
        <v-btn color="secondary" small :to="{ name: 'UserProfile' }"
          >Editar perfil</v-btn
        >
      </div>
    </v-list>

    <v-divider class="mx-3 mb-3"></v-divider>
    <v-list nav flat>
      <v-list-group
        :value="false"
        prepend-icon="mdi-format-list-bulleted"
        color="white"
      >
        <template v-slot:activator>
          <v-list-item-title>Configuración</v-list-item-title>
        </template>
        <v-list-group color="white" :value="false" no-action sub-group>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>TODO-FULL</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            active-class="primary custom2"
            :to="{ name: 'Usuarios' }"
          >
            <v-list-item-content> Usuarios </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="primary custom2"
            :to="{ name: 'EquipoDeVentas' }"
          >
            <v-list-item-content> Equipo de ventas </v-list-item-content>
          </v-list-item>
          <v-list-item active-class="primary custom2" :to="{ name: 'Agentes' }">
            <v-list-item-content> Agentes </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="primary custom2"
            :to="{ name: 'Locaciones' }"
          >
            <v-list-item-content> Ubicaciones </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="primary custom2"
            :to="{ name: 'TodofullLabels' }"
          >
            <v-list-item-content> Nombres de etiquetas </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group color="white" :value="false" no-action sub-group>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Propiedades</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="propiedad in propiedades"
            :key="propiedad.id"
            active-class="primary custom2"
            :to="{ name: propiedad.to }"
          >
            <!-- <v-list-item-icon>
              <v-icon>{{ propiedad.icon }}</v-icon>
            </v-list-item-icon> -->
            <v-list-item-content>
              {{ propiedad.text }}
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            color="white"
            :value="false"
            no-action
            sub-group
            @click="$router.push({ name: 'Mailchimp' })"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Mailchimp</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'MailchimpContacts' }"
            >
              <v-list-item-content> Contactos </v-list-item-content>
            </v-list-item>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'MailchimpLabels' }"
            >
              <v-list-item-content> Etiquetas </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-group
            color="white"
            :value="false"
            no-action
            sub-group
            @click="$router.push({ name: 'Woocommerce' })"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Woocommerce</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'EcommerceProducts' }"
            >
              <v-list-item-content> Productos </v-list-item-content>
            </v-list-item>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'EcommerceCategories' }"
            >
              <v-list-item-content> Categorías </v-list-item-content>
            </v-list-item>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'EcommerceTags' }"
            >
              <v-list-item-content> Etiquetas </v-list-item-content>
            </v-list-item>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'EcommerceContacts' }"
            >
              <v-list-item-content> Contactos </v-list-item-content>
            </v-list-item>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'EcommerceOrders' }"
            >
              <v-list-item-content> Órdenes </v-list-item-content>
            </v-list-item>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'EcommerceAttributes' }"
            >
              <v-list-item-content> Atributos </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-group color="white" :value="false" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Genial</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'Products' }"
            >
              <v-list-item-content> Productos </v-list-item-content>
            </v-list-item>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'Categories' }"
            >
              <v-list-item-content> Categorías </v-list-item-content>
            </v-list-item>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'Brands' }"
            >
              <v-list-item-content> Marcas </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list-group>
      <v-list-group
        :value="false"
        prepend-icon="mdi-format-list-bulleted"
        color="white"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Google Contact</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="googleContact in googleContacts"
          :key="googleContact.id"
          active-class="primary custom2"
          :to="{ name: googleContact.to }"
        >
          <v-list-item-icon>
            <v-icon>{{ googleContact.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{ googleContact.text }}
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-group
        :value="false"
        prepend-icon="mdi-format-list-bulleted"
        color="white"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Chatbot</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-group
          color="white"
          :value="false"
          no-action
          sub-group
          :active-class="$route.name == 'Leads' ? 'primary custom2' : ''"
          @click="$router.push({ name: 'Leads' })"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Contactos</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            active-class="primary custom2"
            :to="{ name: 'LeadsNuevos' }"
          >
            <v-list-item-content> Sin asignar </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="primary custom2"
            :to="{ name: 'LeadsCompraRealizada' }"
          >
            <v-list-item-content> Compra Realizada </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="primary custom2"
            :to="{ name: 'LeadsCompraFallida' }"
          >
            <v-list-item-content> Compra Fallida </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="primary custom2"
            :to="{ name: 'LeadsReconectar' }"
          >
            <v-list-item-content> Re-conectar </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="primary custom2"
            :to="{ name: 'LeadsInformados' }"
          >
            <v-list-item-content> Informados </v-list-item-content>
          </v-list-item>
          <v-list-item
            active-class="primary custom2"
            :to="{ name: 'LeadsTodos' }"
          >
            <v-list-item-content> Lista Completa </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group color="white" :value="false" no-action sub-group>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>MSN Facebook</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-group color="white" :value="false" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Etiquetas</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'Usuarios' }"
            >
              <v-list-item-content> FB Messenger </v-list-item-content>
            </v-list-item>
            <v-list-item
              active-class="primary custom2"
              :to="{ name: 'EquipoDeVentas' }"
            >
              <v-list-item-content> FB Ads </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-group color="white" :value="false" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Publicaciones</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-group color="white" :value="false" no-action sub-group>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>Comentarios</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                active-class="primary custom2"
                :to="{ name: 'Usuarios' }"
              >
                <v-list-item-content> Defecto </v-list-item-content>
              </v-list-item>
              <v-list-item
                active-class="primary custom2"
                :to="{ name: 'EquipoDeVentas' }"
              >
                <v-list-item-content> Programado </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list-group>
        </v-list-group>
      </v-list-group>
      <v-list-group
        :value="false"
        prepend-icon="mdi-format-list-bulleted"
        color="white"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Facebook</v-list-item-title>
          </v-list-item-content>
        </template>
        <!-- <v-list-group
          color="white"
          :value="false"
          no-action
          sub-group
          active-class="primary custom2"
          @click="$router.push({ name: 'CommentToMSN' })"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Comentarios</v-list-item-title>
            </v-list-item-content>
          </template>
        </v-list-group> -->
        <v-list-item
          active-class="primary custom2"
          :to="{ name: 'CommentToMSN' }"
        >
          <v-list-item-icon>
            <v-icon>mdi-check</v-icon>
          </v-list-item-icon>
          <v-list-item-content> Comentarios </v-list-item-content>
        </v-list-item>
        <v-list-item
          active-class="primary custom2"
          :to="{ name: 'CommentsWithoutResponses' }"
        >
          <v-list-item-icon>
            <v-icon>mdi-check</v-icon>
          </v-list-item-icon>
          <v-list-item-content> Comentarios sin responder</v-list-item-content>
        </v-list-item>
        <v-list-item
          active-class="primary custom2"
          :to="{ name: 'AdsMessenger' }"
        >
          <v-list-item-icon>
            <v-icon>mdi-check</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Ads Messenger</v-list-item-content>
        </v-list-item>
        <v-list-item
          active-class="primary custom2"
          :to="{ name: 'FacebookLabels' }"
        >
          <v-list-item-icon>
            <v-icon>mdi-check</v-icon>
          </v-list-item-icon>
          <v-list-item-content> Etiquetas </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-divider class="mx-3 mb-3"></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      active2: false,
      propiedades: [
        {
          icon: "mdi-check",
          text: "Google Contact",
          to: "Telefonos",
        },
        {
          icon: "mdi-check",
          text: "Etiquetas y Agentes",
          to: "LabelsAndAgents",
        },
        {
          icon: "mdi-check",
          text: "Facebook",
          to: "Facebook",
        },
        {
          icon: "mdi-check",
          text: "Dialogflow",
          to: "Dialogflow",
        },
        // {
        //   icon: "mdi-check",
        //   text: "Woocommerce",
        //   to: "Woocommerce",
        // },
        {
          icon: "mdi-check",
          text: "Whatsapp",
          to: "Whatsapp",
        },
        {
          icon: "mdi-check",
          text: "Drive",
          to: "Drive",
        },
        // { icon: "mdi-format-list-bulleted", text: "Tipos", to: "type" },
        // { icon: "mdi-cellphone-dock", text: "Marcas", to: "brand" },
        // { icon: "mdi-format-color-fill", text: "Colores", to: "colors" },
      ],
      googleContacts: [
        {
          icon: "mdi-check",
          text: "Contactos",
          to: "Contactos",
        },
      ],
      etiquetas: [
        {
          icon: "mdi-check",
          text: "FB Messenger",
          to: "",
        },
        {
          icon: "mdi-check",
          text: "FB Ads",
          to: "FB Ads",
        },
      ],
      expansionItems: [
        {
          title: "Configuración",
          active: false,
          icon: "mdi-format-list-bulleted",
          items: [
            {
              icon: "mdi-format-list-bulleted",
              text: "Todo-Full",
              to: "EquipoDeVentas",
            },
            {
              icon: "mdi-format-list-bulleted",
              text: "Locaciones",
              to: "Locaciones",
            },
          ],
        },
      ],
    };
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.toolbar.drawerIcon;
      },
      set(newValue) {
        this.$store.state.toolbar.drawerIcon = newValue;
      },
    },
    user() {
      return this.$store.getters["authModule/getFullNameUser"];
    },
    email() {
      return this.$store.state.authModule.user
        ? this.$store.state.authModule.user.email
        : "example@gmail.com";
    },
  },
};
</script>

<style lang="scss" scoped>
.custom2 {
  color: white;
}
</style>
