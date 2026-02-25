<script setup lang="ts">
  import { SelectValue as SelectValuePrimitive } from "reka-ui";
  defineOptions({ name: "SelectValue" });
  const props = withDefaults(defineProps<{ placeholder?: string }>(), {
    placeholder: "",
  });
</script>
<template>
  <SelectValuePrimitive :placeholder="props.placeholder">
    <slot />
  </SelectValuePrimitive>
</template>
