<script setup lang="ts">
  import { computed, useAttrs } from "vue";
  import { cn } from "@/lib/utils";

  export type ChartConfig = Record<string, { label?: string; color?: string }>;

  defineOptions({ name: "ChartContainer", inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      config?: ChartConfig;
    }>(),
    { config: () => ({}) },
  );

  const attrs = useAttrs();

  const styleVars = computed(() => {
    const style: Record<string, string> = {};
    Object.entries(props.config).forEach(([key, value]) => {
      if (value?.color) {
        style[`--color-${key}`] = value.color;
      }
    });
    return style;
  });
</script>

<template>
  <div
    v-bind="attrs"
    data-chart
    :class="
      cn(
        '[&_svg_text]:fill-muted-foreground [&_.unovis-xy-container__axis]:text-muted-foreground',
        '[&_.unovis-axis]:opacity-80 [&_.unovis-tooltip]:rounded-lg [&_.unovis-tooltip]:border [&_.unovis-tooltip]:border-border [&_.unovis-tooltip]:bg-popover',
        attrs.class as string,
      )
    "
    :style="{ ...(attrs.style as Record<string, string>), ...styleVars }"
  >
    <slot />
  </div>
</template>
