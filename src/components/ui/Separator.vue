<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "Separator", inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      orientation?: "horizontal" | "vertical";
    }>(),
    { orientation: "horizontal" },
  );

  const attrs = useAttrs();
</script>

<template>
  <div
    v-bind="attrs"
    :class="
      cn(
        'shrink-0 bg-border',
        props.orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        attrs.class as string,
      )
    "
  />
</template>
