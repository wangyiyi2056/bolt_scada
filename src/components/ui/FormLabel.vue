<script setup lang="ts">
  import { useAttrs } from "vue";
  import { Label } from "./label";
  import { cn } from "@/lib/utils";
  import { useFormItem } from "./form-context";

  defineOptions({ name: "FormLabel", inheritAttrs: false });
  const attrs = useAttrs();
  const { id } = useFormItem();
</script>
<template>
  <Label v-bind="attrs" :for="id" :class="cn(attrs.class as string)">
    <slot />
  </Label>
</template>
