<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "Pagination", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <nav
    role="navigation"
    aria-label="pagination"
    v-bind="attrs"
    :class="cn('mx-auto flex w-full justify-center', attrs.class as string)"
  >
    <slot />
  </nav>
</template>
