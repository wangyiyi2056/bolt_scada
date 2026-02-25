<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "SidebarMenuSub", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <ul
    v-bind="attrs"
    :class="
      cn(
        'ml-4 mt-1 flex flex-col gap-0.5 border-l border-sidebar-border/80 pl-2',
        attrs.class as string,
      )
    "
  >
    <slot />
  </ul>
</template>
