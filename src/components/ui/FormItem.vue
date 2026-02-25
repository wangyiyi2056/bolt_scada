<script setup lang="ts">
  import { provide, useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  import { formItemContext, type FormItemContextValue } from "./form-context";

  defineOptions({ name: "FormItem", inheritAttrs: false });
  const attrs = useAttrs();

  let formItemIndex = 0;
  const id = `form-item-${++formItemIndex}`;
  provide<FormItemContextValue>(formItemContext, { id });
</script>
<template>
  <div v-bind="attrs" :class="cn('space-y-2', attrs.class as string)">
    <slot />
  </div>
</template>
