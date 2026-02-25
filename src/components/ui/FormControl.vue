<script setup lang="ts">
  import { useAttrs } from "vue";
  import { useFormItem } from "./form-context";

  defineOptions({ name: "FormControl", inheritAttrs: false });
  const { id } = useFormItem();
  const attrs = useAttrs();
</script>
<template>
  <div v-bind="attrs" :data-form-control="id"><slot /></div>
</template>
