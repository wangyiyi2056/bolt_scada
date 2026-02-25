<script setup lang="ts">
  import { useAttrs } from "vue";
  import { ChevronLeft } from "lucide-vue-next";
  import { cn } from "@/lib/utils";
  import { buttonVariants } from "./button";

  defineOptions({ name: "PaginationPrevious", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <button
    type="button"
    v-bind="attrs"
    :class="
      cn(
        buttonVariants({ variant: 'ghost', size: 'default' }),
        'h-8 gap-1 pl-2.5',
        attrs.class as string,
      )
    "
  >
    <ChevronLeft class="h-4 w-4" />
    <span><slot>上一页</slot></span>
  </button>
</template>
