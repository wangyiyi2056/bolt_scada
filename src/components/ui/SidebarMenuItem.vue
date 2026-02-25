<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "SidebarMenuItem", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <li
    v-bind="attrs"
    :class="cn('group/menu-item relative', attrs.class as string)"
  >
    <slot />
  </li>
</template>
