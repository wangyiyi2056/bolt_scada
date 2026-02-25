<script setup lang="ts">
  import { computed } from "vue";
  import { navConfig } from "@/lib/nav-config";
  import TeamSwitcher from "@/components/team-switcher.vue";
  import NavMain from "@/components/nav-main.vue";
  import NavProjects from "@/components/nav-projects.vue";
  import NavUser from "@/components/nav-user.vue";
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    useSidebar,
  } from "@/components/ui/sidebar";

  defineOptions({ name: "AppSidebar" });

  const { state } = useSidebar();
  const collapsed = computed(() => state.value === "collapsed");

  const navItems = navConfig.map((item) => ({
    title: item.title,
    url: item.href,
    icon: item.icon,
    items: item.children.map((child) => ({
      title: child.title,
      url: child.href,
    })),
  }));
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader class="border-b border-sidebar-border/80 p-3">
      <TeamSwitcher />
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel v-if="!collapsed">Platform</SidebarGroupLabel>
        <SidebarGroupContent>
          <NavMain :items="navItems" />
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel v-if="!collapsed">Projects</SidebarGroupLabel>
        <SidebarGroupContent>
          <NavProjects />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter class="border-t border-sidebar-border/80 p-3">
      <NavUser />
    </SidebarFooter>
  </Sidebar>
</template>
