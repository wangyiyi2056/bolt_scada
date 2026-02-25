<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "Textarea", inheritAttrs: false });
  const attrs = useAttrs();
</script>

<template>
  <textarea
    v-bind="attrs"
    :class="
      cn(
        'min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        attrs.class as string,
      )
    "
  >
<slot /></textarea
  >
</template>
