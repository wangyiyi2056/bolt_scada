<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "CardHeader", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <div
    v-bind="attrs"
    :class="cn('flex flex-col space-y-1.5 p-5', attrs.class as string)"
  >
    <slot />
  </div>
</template>
