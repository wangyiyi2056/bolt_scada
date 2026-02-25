<script setup lang="ts">
  import { cn } from "@/lib/utils";
  import { useSidebar } from "./sidebar-context";

  defineOptions({ name: "Sidebar" });

  const props = withDefaults(
    defineProps<{
      collapsible?: "icon" | "none";
    }>(),
    { collapsible: "icon" },
  );

  const { collapsed } = useSidebar();
</script>

<template>
  <aside
    data-sidebar="sidebar"
    :data-collapsible="props.collapsible === 'icon' && collapsed ? 'icon' : ''"
    :class="
      cn(
        'hidden min-h-full shrink-0 border-r border-sidebar-border/90 bg-sidebar/85 backdrop-blur md:flex md:flex-col',
        'transition-[width] duration-200',
        props.collapsible === 'icon'
          ? collapsed
            ? 'w-[4.4rem]'
            : 'w-[17.5rem]'
          : 'w-[17.5rem]',
      )
    "
  >
    <slot />
  </aside>
</template>
