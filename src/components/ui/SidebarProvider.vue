<script setup lang="ts">
  import { provideSidebar } from "./sidebar-context";

  defineOptions({ name: "SidebarProvider" });

  const props = withDefaults(
    defineProps<{
      defaultCollapsed?: boolean;
    }>(),
    { defaultCollapsed: false },
  );

  const { collapsed } = provideSidebar(props.defaultCollapsed);
</script>

<template>
  <div class="min-h-screen bg-background p-2 md:p-3">
    <div
      class="group/sidebar-wrapper flex min-h-[calc(100vh-1rem)] w-full overflow-hidden rounded-2xl border border-border/70 bg-card/70 text-foreground shadow-[0_1px_0_hsl(var(--border)),0_24px_48px_-34px_hsl(var(--foreground)/0.45)] backdrop-blur-sm"
      :data-collapsed="collapsed ? 'true' : 'false'"
      :data-collapsible="collapsed ? 'icon' : ''"
    >
      <slot />
    </div>
  </div>
</template>
