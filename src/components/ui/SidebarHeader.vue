<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "SidebarHeader", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <div
    v-bind="attrs"
    :class="cn('flex flex-col gap-2 p-3', attrs.class as string)"
  >
    <slot />
  </div>
</template>
