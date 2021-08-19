import Vue from "vue";
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, confirmed, length, email } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "Este campo es requerido",
});

extend("email", {
  ...email,
  message: "Este campo debe ser un email válido",
});

extend("confirmed", {
  ...confirmed,
  message: "Las contraseñas no concuerdan",
});

extend("length", {
  ...length,
  message: "This field must have 2 options",
});

extend("decimal", {
  validate: (value, { decimals = "*", separator = "." } = {}) => {
    if (value === null || value === undefined || value === "") {
      return {
        valid: false,
      };
    }
    if (Number(decimals) === 0) {
      return {
        valid: /^-?\d*$/.test(value),
      };
    }
    const regexPart = decimals === "*" ? "+" : `{1,${decimals}}`;
    const regex = new RegExp(
      `^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`
    );
    return {
      valid: regex.test(value),
    };
  },
  message: `Este campo debe ser un número válido`,
});

Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);