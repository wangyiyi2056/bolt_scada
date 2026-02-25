<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "BreadcrumbPage", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    v-bind="attrs"
    :class="cn('font-medium text-foreground', attrs.class as string)"
  >
    <slot />
  </span>
</template>
