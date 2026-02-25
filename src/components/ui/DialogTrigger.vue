<script setup lang="ts">
  import { DialogTrigger as DialogTriggerPrimitive } from "reka-ui";
  defineOptions({ name: "DialogTrigger" });
  const props = withDefaults(defineProps<{ asChild?: boolean }>(), {
    asChild: false,
  });
</script>
<template>
  <DialogTriggerPrimitive :as-child="props.asChild">
    <slot />
  </DialogTriggerPrimitive>
</template>
