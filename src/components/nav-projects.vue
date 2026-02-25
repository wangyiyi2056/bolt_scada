<script setup lang="ts">
  import { useRoute, useRouter } from "vue-router";
  import { FolderKanban, MoreHorizontal, Plus } from "lucide-vue-next";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
  } from "@/components/ui/sidebar";

  defineOptions({ name: "NavProjects" });

  const projects = [
    { name: "Design Engineering", url: "/projects/engineering" },
    { name: "Sales & Marketing", url: "/projects" },
    { name: "Travel", url: "/projects/deploy" },
  ];

  const route = useRoute();
  const router = useRouter();
  const { collapsed } = useSidebar();

  function navigateToProject(project: { url: string }) {
    if (route.path !== project.url) {
      router.push(project.url);
    }
  }
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem v-for="project in projects" :key="project.name">
      <div class="flex items-center gap-1">
        <SidebarMenuButton
          :is-active="route.path === project.url"
          class="flex-1"
          @click.stop="navigateToProject(project)"
        >
          <FolderKanban class="h-4 w-4 shrink-0" />
          <span v-if="!collapsed" class="truncate">{{ project.name }}</span>
        </SidebarMenuButton>

        <DropdownMenu v-if="!collapsed">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="h-7 w-7 rounded-md">
              <MoreHorizontal class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>查看</DropdownMenuItem>
            <DropdownMenuItem>重命名</DropdownMenuItem>
            <DropdownMenuItem class="text-destructive">删除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarMenuItem>
  </SidebarMenu>

  <Button
    v-if="!collapsed"
    variant="outline"
    class="mt-2 h-8 w-full justify-start gap-2 border-dashed bg-transparent"
  >
    <Plus class="h-3.5 w-3.5" />
    <span>More</span>
  </Button>
</template>
