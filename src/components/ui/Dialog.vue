<script setup lang="ts">
  import { DialogRoot } from "reka-ui";

  defineOptions({ name: "Dialog" });

  const props = withDefaults(
    defineProps<{
      open?: boolean;
      defaultOpen?: boolean;
    }>(),
    { open: undefined, defaultOpen: false },
  );

  const emit = defineEmits<{
    "update:open": [value: boolean];
    openChange: [value: boolean];
  }>();

  function onUpdateOpen(value: boolean) {
    emit("update:open", value);
    emit("openChange", value);
  }
</script>

<template>
  <DialogRoot
    :open="props.open"
    :default-open="props.defaultOpen"
    @update:open="onUpdateOpen"
  >
    <slot />
  </DialogRoot>
</template>
