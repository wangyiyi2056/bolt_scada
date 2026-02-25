<script setup lang="ts">
  import { useAttrs } from "vue";
  import { DialogDescription as DialogDescriptionPrimitive } from "reka-ui";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "DialogDescription", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <DialogDescriptionPrimitive
    v-bind="attrs"
    :class="cn('text-sm text-muted-foreground', attrs.class as string)"
  >
    <slot />
  </DialogDescriptionPrimitive>
</template>
