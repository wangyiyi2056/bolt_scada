<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "Card", inheritAttrs: false });
  const attrs = useAttrs();
</script>

<template>
  <div
    v-bind="attrs"
    :class="
      cn(
        'rounded-2xl border border-border/70 bg-card/95 text-card-foreground shadow-[0_1px_0_hsl(var(--border)),0_12px_28px_-20px_hsl(var(--foreground)/0.25)] backdrop-blur-sm',
        attrs.class as string,
      )
    "
  >
    <slot />
  </div>
</template>
