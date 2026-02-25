<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "DialogFooter", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <div
    v-bind="attrs"
    :class="
      cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        attrs.class as string,
      )
    "
  >
    <slot />
  </div>
</template>
