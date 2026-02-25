<script setup lang="ts">
  import { DialogClose as DialogClosePrimitive } from "reka-ui";
  defineOptions({ name: "DialogClose" });
  const props = withDefaults(defineProps<{ asChild?: boolean }>(), {
    asChild: false,
  });
</script>
<template>
  <DialogClosePrimitive :as-child="props.asChild">
    <slot />
  </DialogClosePrimitive>
</template>
