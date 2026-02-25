<script setup lang="ts">
  import { useAttrs } from "vue";
  import { SelectTrigger as SelectTriggerPrimitive, SelectIcon } from "reka-ui";
  import { ChevronDown } from "lucide-vue-next";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "SelectTrigger", inheritAttrs: false });
  const attrs = useAttrs();
</script>

<template>
  <SelectTriggerPrimitive
    v-bind="attrs"
    :class="
      cn(
        'flex h-10 w-full items-center justify-between rounded-lg border border-input/80 bg-background/90 px-3 py-2 text-sm shadow-sm',
        'ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        attrs.class as string,
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="h-4 w-4 opacity-50" />
    </SelectIcon>
  </SelectTriggerPrimitive>
</template>
