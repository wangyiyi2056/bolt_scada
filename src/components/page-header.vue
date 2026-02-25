<script setup lang="ts">
  import { useAttrs, computed } from "vue";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "PageHeader", inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      title: string;
      description?: string;
    }>(),
    { description: "" },
  );

  const attrs = useAttrs();
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between',
        attrs.class as string,
      )
    "
  >
    <div>
      <h2 class="text-xl font-semibold tracking-tight text-foreground">
        {{ props.title }}
      </h2>
      <p v-if="props.description" class="mt-0.5 text-sm text-muted-foreground">
        {{ props.description }}
      </p>
    </div>
    <div v-if="$slots.default" class="flex items-center gap-2"><slot /></div>
  </div>
</template>
