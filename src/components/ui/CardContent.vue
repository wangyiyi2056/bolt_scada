<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "CardContent", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <div v-bind="attrs" :class="cn('p-5 pt-0', attrs.class as string)">
    <slot />
  </div>
</template>
