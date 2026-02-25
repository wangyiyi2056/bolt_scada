<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "CardDescription", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <p
    v-bind="attrs"
    :class="cn('text-sm text-muted-foreground', attrs.class as string)"
  >
    <slot />
  </p>
</template>
