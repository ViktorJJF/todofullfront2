import Vue from "vue";
import Router from "vue-router";
import store from "./store";

Vue.use(Router);

let routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("./views/Login.vue"),
  },
  {
    path: "/",
    component: () => import("@/layouts/Admin.vue"),
    meta: {
      requiresAuth: true,
    },
    name: "dashboard",
    redirect: {
      name: "Contactos",
    },
    children: [
      // {
      //   path: "/colores",
      //   name: "Colors",
      //   component: () => import("@/views/Colors.vue"),
      // },
      {
        path: "/equipo-de-ventas",
        name: "EquipoDeVentas",
        component: () => import("@/views/EquipoDeVentas.vue"),
      },
      {
        path: "/locaciones",
        name: "Locaciones",
        component: () => import("@/views/Locaciones.vue"),
      },
      {
        path: "/telefonos",
        name: "Telefonos",
        component: () => import("@/views/Telefonos"),
      },
      {
        path: "/contactos",
        name: "Contactos",
        component: () => import("@/views/Contactos.vue"),
      },
      {
        path: "/agentes",
        name: "Agentes",
        component: () => import("@/views/Agentes.vue"),
      },
      {
        path: "/usuarios",
        name: "Usuarios",
        component: () => import("@/views/Usuarios.vue"),
      },
      {
        path: "/facebook",
        name: "Facebook",
        component: () => import("@/views/Facebook.vue"),
      },
      {
        path: "/dialogflow",
        name: "Dialogflow",
        component: () => import("@/views/Dialogflow.vue"),
      },
      {
        path: "/mailchimp",
        name: "Mailchimp",
        component: () => import("@/views/Mailchimp.vue"),
      },
      {
        path: "/woocommerce",
        name: "Woocommerce",
        component: () => import("@/views/Woocommerce.vue"),
      },
      {
        path: "/whatsapp",
        name: "Whatsapp",
        component: () => import("@/views/Whatsapp.vue"),
      },
      {
        path: "/genial",
        name: "Genial",
        component: () => import("@/views/Genial.vue"),
      },
      {
        path: "/drive",
        name: "Drive",
        component: () => import("@/views/Drive.vue"),
      },
      {
        path: "/resumen-leads",
        name: "Leads",
        component: () => import("@/views/Leads.vue"),
      },
      {
        path: "/lead/sin-asignar",
        name: "LeadsNuevos",
        component: () => import("@/views/LeadsNuevos.vue"),
      },
      {
        path: "/lead/re-conectar",
        name: "LeadsReconectar",
        component: () => import("@/views/LeadsReconectar.vue"),
      },
      {
        path: "/lead/informado-al-agente",
        name: "LeadsInformados",
        component: () => import("@/views/LeadsInformados.vue"),
      },
      {
        path: "/lead/compra-realizada",
        name: "LeadsCompraRealizada",
        component: () => import("@/views/LeadsCompraRealizada.vue"),
      },
      {
        path: "/lead/compra-fallida",
        name: "LeadsCompraFallida",
        component: () => import("@/views/LeadsCompraFallida.vue"),
      },
      {
        path: "/lead/todos",
        name: "LeadsTodos",
        component: () => import("@/views/LeadsTodos.vue"),
      },
      {
        path: "/telefonos/googlepeople/:id/:clientId/:clientSecret",
        name: "Telefonos-googleContact",
        component: () => import("@/components/GooglePeopleCredenciales.vue"),
      },
      {
        path: "/telefonos/contactos/:id",
        name: "Telefonos-contactos",
        component: () => import("@/views/Telefonos/PeopleContacts"),
      },
      {
        path: "/perfil",
        name: "UserProfile",
        component: () => import("@/views/UserProfile.vue"),
      },
      {
        path: "/perfil",
        name: "UserProfile",
        component: () => import("@/views/UserProfile.vue"),
      },
      {
        path: "/comment-to-msn",
        name: "CommentToMSN",
        component: () => import("@/views/CommentToMSN"),
      },
      {
        path: "/ads-messenger",
        name: "AdsMessenger",
        component: () => import("@/views/CommentToMSN"),
      },
      {
        path: "/comment-to-msn/:id",
        name: "CommentToMSNUpdate",
        component: () => import("@/views/CommentToMSNUpdate"),
      },
      {
        path: "/ads-messenger/:id",
        name: "AdToMSNUpdate",
        component: () => import("@/views/CommentToMSNUpdate"),
      },
      {
        path: "/productos",
        name: "Products",
        component: () => import("@/views/Products"),
      },
      {
        path: "/marcas",
        name: "Brands",
        component: () => import("@/views/Brands"),
      },
      {
        path: "/categorias",
        name: "Categories",
        component: () => import("@/views/Categories"),
      },
      {
        path: "/ecommerce/categorias",
        name: "EcommerceCategories",
        component: () => import("@/views/EcommerceCategories"),
      },
      {
        path: "/ecommerce/contactos",
        name: "EcommerceContacts",
        component: () => import("@/views/EcommerceContacts"),
      },
      {
        path: "/ecommerce/atributos",
        name: "EcommerceAttributes",
        component: () => import("@/views/EcommerceAttributes"),
      },
      {
        path: "/ecommerce/ordenes",
        name: "EcommerceOrders",
        component: () => import("@/views/EcommerceOrders"),
      },
      {
        path: "/ecommerce/etiquetas",
        name: "EcommerceTags",
        component: () => import("@/views/EcommerceTags"),
      },
      {
        path: "/ecommerce/productos",
        name: "EcommerceProducts",
        component: () => import("@/views/EcommerceProducts"),
      },
      {
        path: "/etiquetas-facebook",
        name: "FacebookLabels",
        component: () => import("@/views/FacebookLabels"),
      },
      {
        path: "/etiquetas-todofull",
        name: "TodofullLabels",
        component: () => import("@/views/TodofullLabels"),
      },
      {
        path: "/comentarios-sin-respuesta",
        name: "CommentsWithoutResponses",
        component: () => import("@/views/CommentsWithoutResponses"),
      },
      {
        path: "/etiquetas-y-agentes",
        name: "LabelsAndAgents",
        component: () => import("@/views/LabelsAndAgents"),
      },
      {
        path: "/mailchimp/contactos",
        name: "MailchimpContacts",
        component: () => import("@/views/MailchimpContacts"),
      },
      {
        path: "/mailchimp/etiquetas",
        name: "MailchimpLabels",
        component: () => import("@/views/MailchimpLabels"),
      },
      {
        path: "/test",
        component: () => import("@/views/test"),
      },
    ],
  },
  {
    path: "*",
    component: () => import("@/components/common/notFound.vue"),
  },
];

const router = new Router({
  routes,
  mode: "history",
});

router.beforeEach((to, from, next) => {
  // checkForUpdates();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isTokenSet = store.getters["authModule/isTokenSet"];
  if (requiresAuth && !isTokenSet) {
    return next({ name: "login" });
  }
  // checkIfTokenNeedsRefresh();
  // store.commit("successModule/success", null);
  // store.commit("errorModule/error", null);
  return next();
});

export default router;
