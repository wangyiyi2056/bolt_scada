<script setup lang="ts">
  import { MoreHorizontal } from "lucide-vue-next";
  defineOptions({ name: "PaginationEllipsis" });
</script>
<template>
  <span aria-hidden class="flex h-8 w-8 items-center justify-center">
    <MoreHorizontal class="h-4 w-4" />
    <span class="sr-only">More pages</span>
  </span>
</template>
