<script setup lang="ts">
  import { useAttrs } from "vue";
  import { VisBulletLegend } from "@unovis/vue";
  defineOptions({ name: "ChartLegend", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <!-- @vue-ignore -->
  <VisBulletLegend v-bind="attrs as any" />
</template>
