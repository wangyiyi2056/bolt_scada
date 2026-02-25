<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  import { buttonVariants } from "./button";

  defineOptions({ name: "PaginationLink", inheritAttrs: false });
  const props = withDefaults(defineProps<{ isActive?: boolean }>(), {
    isActive: false,
  });
  const attrs = useAttrs();
</script>
<template>
  <button
    type="button"
    v-bind="attrs"
    :aria-current="props.isActive ? 'page' : undefined"
    :class="
      cn(
        buttonVariants({
          variant: props.isActive ? 'outline' : 'ghost',
          size: 'icon',
        }),
        'h-8 w-8',
        attrs.class as string,
      )
    "
  >
    <slot />
  </button>
</template>
