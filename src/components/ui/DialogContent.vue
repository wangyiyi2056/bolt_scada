<script setup lang="ts">
  import { useAttrs } from "vue";
  import {
    DialogPortal,
    DialogOverlay,
    DialogContent as DialogContentPrimitive,
    DialogClose as DialogClosePrimitive,
  } from "reka-ui";
  import { X } from "lucide-vue-next";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "DialogContent", inheritAttrs: false });
  const attrs = useAttrs();
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-black/45 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContentPrimitive
      v-bind="attrs"
      :class="
        cn(
          'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-border bg-background p-6 shadow-xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          attrs.class as string,
        )
      "
    >
      <slot />
      <DialogClosePrimitive
        class="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <X class="h-4 w-4" />
      </DialogClosePrimitive>
    </DialogContentPrimitive>
  </DialogPortal>
</template>
