<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "TableHeader", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <thead v-bind="attrs" :class="cn('[&_tr]:border-b', attrs.class as string)">
    <slot />
  </thead>
</template>
