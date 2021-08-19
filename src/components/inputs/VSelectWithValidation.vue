<template>
  <ValidationProvider :name="$attrs.label" :rules="rules" v-slot="{ errors }">
    <v-select
      :background-color="backgroundColor"
      :dark="dark"
      dense
      outlined
      v-model="innerValue"
      hide-details="auto"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
      :item-text="itemText"
      :item-value="itemValue"
      :placeholder="$attrs.label"
      solo
    ></v-select>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";
export default {
  components: {
    ValidationProvider,
  },
  props: {
    rules: {
      type: [Object, String],
      default: "",
    },
    value: {
      type: null,
    },
    itemText: {
      type: String,
    },
    itemValue: {
      type: String,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: undefined,
    },
  },
  data: () => ({
    innerValue: "",
  }),
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
};
</script>