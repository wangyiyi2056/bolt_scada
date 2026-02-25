<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";
  defineOptions({ name: "Table", inheritAttrs: false });
  const attrs = useAttrs();
</script>
<template>
  <div class="w-full overflow-auto">
    <table
      v-bind="attrs"
      :class="cn('w-full caption-bottom text-sm', attrs.class as string)"
    >
      <slot />
    </table>
  </div>
</template>
