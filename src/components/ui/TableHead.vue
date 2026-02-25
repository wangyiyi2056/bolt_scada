<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "TableHead", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <th
    v-bind="attrs"
    :class="
      cn(
        'h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground',
        attrs.class as string,
      )
    "
  >
    <slot />
  </th>
</template>
