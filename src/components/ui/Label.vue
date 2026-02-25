<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "Label", inheritAttrs: false });
  const attrs = useAttrs();
</script>

<template>
  <label
    v-bind="attrs"
    :class="cn('text-sm font-medium leading-none', attrs.class as string)"
  >
    <slot />
  </label>
</template>
