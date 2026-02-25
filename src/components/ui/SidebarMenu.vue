<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "SidebarMenu", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <ul
    v-bind="attrs"
    :class="cn('flex w-full min-w-0 flex-col gap-0.5', attrs.class as string)"
  >
    <slot />
  </ul>
</template>
