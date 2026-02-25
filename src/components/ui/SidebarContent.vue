<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "SidebarContent", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <div
    v-bind="attrs"
    :class="
      cn(
        'flex min-h-0 flex-1 flex-col gap-1.5 overflow-auto px-2 py-2',
        attrs.class as string,
      )
    "
  >
    <slot />
  </div>
</template>
