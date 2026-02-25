<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "CardTitle", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <h3
    v-bind="attrs"
    :class="
      cn('font-semibold leading-none tracking-tight', attrs.class as string)
    "
  >
    <slot />
  </h3>
</template>
