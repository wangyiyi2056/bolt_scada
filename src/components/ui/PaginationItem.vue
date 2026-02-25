<script setup lang="ts">
  import { useAttrs } from "vue";
  defineOptions({ name: "PaginationItem", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <li v-bind="attrs"><slot /></li>
</template>
