<script setup lang="ts">
  defineOptions({ name: "Progress" });

  const props = withDefaults(
    defineProps<{
      value?: number;
    }>(),
    { value: 0 },
  );
</script>

<template>
  <div class="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
    <div
      class="h-full bg-primary transition-all"
      :style="{
        transform: `translateX(-${100 - Math.min(100, Math.max(0, props.value))}%)`,
      }"
    />
  </div>
</template>
