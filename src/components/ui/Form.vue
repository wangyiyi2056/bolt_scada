<script setup lang="ts">
  import { useAttrs } from "vue";
  defineOptions({ name: "Form", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <form v-bind="attrs"><slot /></form>
</template>
