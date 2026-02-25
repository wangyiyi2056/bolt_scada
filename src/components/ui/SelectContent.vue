<script setup lang="ts">
  import { useAttrs } from "vue";
  import {
    SelectPortal,
    SelectContent as SelectContentPrimitive,
    SelectViewport,
  } from "reka-ui";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "SelectContent", inheritAttrs: false });
  const attrs = useAttrs();
</script>

<template>
  <SelectPortal>
    <SelectContentPrimitive
      v-bind="attrs"
      position="popper"
      :side-offset="4"
      :class="
        cn(
          'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          attrs.class as string,
        )
      "
    >
      <SelectViewport class="p-1"><slot /></SelectViewport>
    </SelectContentPrimitive>
  </SelectPortal>
</template>
