<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "SidebarGroupLabel", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <div
    v-bind="attrs"
    :class="
      cn(
        'mb-1 px-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/90',
        attrs.class as string,
      )
    "
  >
    <slot />
  </div>
</template>
