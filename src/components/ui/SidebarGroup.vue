<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "SidebarGroup", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <div
    v-bind="attrs"
    :class="
      cn('relative flex w-full min-w-0 flex-col py-1', attrs.class as string)
    "
  >
    <slot />
  </div>
</template>
