<script setup lang="ts">
  import { ref, watch } from "vue";
  import { SelectRoot } from "reka-ui";

  defineOptions({ name: "Select" });

  const props = withDefaults(
    defineProps<{
      defaultValue?: string;
      modelValue?: string;
    }>(),
    { defaultValue: "", modelValue: undefined },
  );

  const emit = defineEmits<{
    "update:modelValue": [value: string];
    change: [value: string];
  }>();

  const value = ref(props.modelValue ?? props.defaultValue);

  watch(
    () => props.modelValue,
    (next) => {
      if (typeof next === "string") {
        value.value = next;
      }
    },
  );

  function onUpdate(nextValue: string) {
    value.value = nextValue;
    emit("update:modelValue", nextValue);
    emit("change", nextValue);
  }
</script>

<template>
  <SelectRoot
    :model-value="value"
    :default-value="props.defaultValue"
    @update:model-value="onUpdate"
  >
    <slot />
  </SelectRoot>
</template>
