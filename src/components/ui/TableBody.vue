<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "TableBody", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <tbody
    v-bind="attrs"
    :class="cn('[&_tr:last-child]:border-0', attrs.class as string)"
  >
    <slot />
  </tbody>
</template>
