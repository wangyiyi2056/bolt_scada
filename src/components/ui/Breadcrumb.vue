<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "Breadcrumb", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <nav v-bind="attrs" :class="cn('w-full', attrs.class as string)">
    <slot />
  </nav>
</template>
