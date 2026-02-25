<script setup lang="ts">
  import { useAttrs } from "vue";
  import { DialogTitle as DialogTitlePrimitive } from "reka-ui";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "DialogTitle", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <DialogTitlePrimitive
    v-bind="attrs"
    :class="
      cn(
        'text-lg font-semibold leading-none tracking-tight',
        attrs.class as string,
      )
    "
  >
    <slot />
  </DialogTitlePrimitive>
</template>
