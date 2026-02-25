<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "TableCell", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <td
    v-bind="attrs"
    :class="cn('px-4 py-2.5 align-middle', attrs.class as string)"
  >
    <slot />
  </td>
</template>
