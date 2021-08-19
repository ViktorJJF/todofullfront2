<template>
  <v-card
    :width="width"
    class="text"
    :style="styles"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <helper-offset
      v-if="hasOffset"
      :inline="inline"
      :full-width="fullWidth"
      :offset="offset"
    >
      <v-card
        v-if="!$slots.offset"
        :color="color"
        :elevation="elevation"
        class="v-card--material__header d-flex align-center"
        dark
        min-height="80"
      >
        <slot v-if="!title && !text" name="header" />
        <div v-else class="px-3">
          <h4 class="headline font-weight-light mb-2">
            <v-icon>{{ icon }}</v-icon>
            {{ title }}
          </h4>
          <p class="category font-weight-thin mb-0" v-text="text" />
        </div>
      </v-card>

      <slot v-else name="offset" />
    </helper-offset>

    <v-card-text>
      <slot />
    </v-card-text>

    <v-divider v-if="$slots.actions" class="mx-3" />

    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script>
import HelperOffset from "@/components/helper/Offset";
export default {
  components: {
    HelperOffset,
  },
  name: "MaterialCard",

  inheritAttrs: false,

  props: {
    width: {
      type: String,
      default: "100%",
    },
    icon: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: "secondary",
    },
    elevation: {
      type: [Number, String],
      default: 10,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    offset: {
      type: [Number, String],
      default: 24,
    },
    title: {
      type: String,
      default: undefined,
    },
    text: {
      type: String,
      default: undefined,
    },
  },

  computed: {
    hasOffset() {
      return (
        this.$slots.header || this.$slots.offset || this.title || this.text
      );
    },
    styles() {
      if (!this.hasOffset) return null;

      return {
        marginBottom: `${this.offset}px`,
        marginTop: `${this.offset * 2}px`,
      };
    },
  },
};
</script>
