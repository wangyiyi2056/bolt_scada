<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "Input", inheritAttrs: false });
  const attrs = useAttrs();
</script>

<template>
  <input
    v-bind="attrs"
    :class="
      cn(
        'flex h-10 w-full rounded-lg border border-input/80 bg-background/90 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        attrs.class as string,
      )
    "
  />
</template>
