<template>
  <v-container fluid>
    <p>{{ values }}</p>
    <v-checkbox v-model="values" value="John"></v-checkbox>
    <v-checkbox v-model="values" value="Jacob"></v-checkbox>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      values: [],
    };
  },
};
</script>

<style lang="scss" scoped></style>
