<script setup lang="ts">
  import { useAttrs } from "vue";
  import { ChevronRight } from "lucide-vue-next";
  import { cn } from "@/lib/utils";
  import { buttonVariants } from "./button";

  defineOptions({ name: "PaginationNext", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <button
    type="button"
    v-bind="attrs"
    :class="
      cn(
        buttonVariants({ variant: 'ghost', size: 'default' }),
        'h-8 gap-1 pr-2.5',
        attrs.class as string,
      )
    "
  >
    <span><slot>下一页</slot></span>
    <ChevronRight class="h-4 w-4" />
  </button>
</template>
