<script setup lang="ts">
  defineOptions({ name: "FormField" });
  const props = defineProps<{ name: string }>();
</script>
<template>
  <div :data-field="props.name"><slot /></div>
</template>
