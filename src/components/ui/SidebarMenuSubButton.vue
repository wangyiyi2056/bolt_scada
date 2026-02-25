<script setup lang="ts">
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "SidebarMenuSubButton", inheritAttrs: false });
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
        'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        props.isActive && 'bg-primary/10 text-primary font-medium',
        attrs.class as string,
      )
    "
  >
    <slot />
  </div>
</template>
