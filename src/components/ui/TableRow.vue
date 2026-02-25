<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "TableRow", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <tr
    v-bind="attrs"
    :class="
      cn(
        'border-b border-border/80 transition-colors hover:bg-muted/35',
        attrs.class as string,
      )
    "
  >
    <slot />
  </tr>
</template>
