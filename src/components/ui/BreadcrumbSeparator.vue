<script setup lang="ts">
  import { useAttrs } from "vue";
  import { ChevronRight } from "lucide-vue-next";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "BreadcrumbSeparator", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <li
    role="presentation"
    aria-hidden="true"
    v-bind="attrs"
    :class="cn('[&>svg]:h-3.5 [&>svg]:w-3.5', attrs.class as string)"
  >
    <slot><ChevronRight /></slot>
  </li>
</template>
