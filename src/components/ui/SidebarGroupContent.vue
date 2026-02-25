<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "SidebarGroupContent", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <div v-bind="attrs" :class="cn('w-full text-sm', attrs.class as string)">
    <slot />
  </div>
</template>
