<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "BreadcrumbList", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <ol
    v-bind="attrs"
    :class="
      cn(
        'flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5',
        attrs.class as string,
      )
    "
  >
    <slot />
  </ol>
</template>
