<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "SidebarMenuButton", inheritAttrs: false });
  const props = withDefaults(defineProps<{ isActive?: boolean }>(), {
    isActive: false,
  });
  const attrs = useAttrs();
</script>

<template>
  <div
    v-bind="attrs"
    :class="
      cn(
        'flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md px-2.5 py-1.5 text-left text-sm transition-colors',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        props.isActive &&
          'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
        attrs.class as string,
      )
    "
  >
    <slot />
  </div>
</template>
