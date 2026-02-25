<script setup lang="ts">
  import { ref, watch } from "vue";
  import { SwitchRoot, SwitchThumb } from "reka-ui";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "Switch" });

  const props = withDefaults(
    defineProps<{
      modelValue?: boolean;
      defaultChecked?: boolean;
      disabled?: boolean;
    }>(),
    { defaultChecked: false, disabled: false },
  );

  const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    change: [value: boolean];
  }>();

  const checked = ref(props.modelValue ?? props.defaultChecked);

  watch(
    () => props.modelValue,
    (value) => {
      if (typeof value === "boolean") {
        checked.value = value;
      }
    },
  );

  function onUpdate(value: boolean) {
    checked.value = value;
    emit("update:modelValue", value);
    emit("change", value);
  }
</script>

<template>
  <SwitchRoot
    :model-value="checked"
    :default-value="props.defaultChecked"
    :disabled="props.disabled"
    :class="
      cn(
        'peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-input',
      )
    "
    @update:model-value="onUpdate"
  >
    <SwitchThumb
      :class="
        cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        )
      "
    />
  </SwitchRoot>
</template>
