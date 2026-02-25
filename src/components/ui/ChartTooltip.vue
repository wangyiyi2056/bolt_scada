<script setup lang="ts">
  import { useAttrs } from "vue";
  import { VisTooltip } from "@unovis/vue";
  defineOptions({ name: "ChartTooltip", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <VisTooltip v-bind="attrs" />
</template>
