<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "PaginationContent", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <ul
    v-bind="attrs"
    :class="cn('flex flex-row items-center gap-1', attrs.class as string)"
  >
    <slot />
  </ul>
</template>
