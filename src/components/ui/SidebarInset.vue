<script setup lang="ts">
  defineOptions({ name: "SidebarInset" });
</script>
<template>
  <div class="relative flex min-h-full flex-1 flex-col bg-background/80">
    <slot />
  </div>
</template>
