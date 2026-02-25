<script setup lang="ts">
  import AppSidebar from "@/components/app-sidebar.vue";
  import AppHeader from "@/components/app-header.vue";
  import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

  defineOptions({ name: "AppShell" });
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <AppHeader />
      <main class="flex-1 overflow-auto p-4 md:p-6 lg:p-7"><slot /></main>
    </SidebarInset>
  </SidebarProvider>
</template>
