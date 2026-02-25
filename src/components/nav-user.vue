<script setup lang="ts">
  import { LogOut, Settings, User } from "lucide-vue-next";
  import { useRouter } from "vue-router";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { useSidebar } from "@/components/ui/sidebar";

  defineOptions({ name: "NavUser" });

  const router = useRouter();
  const { collapsed } = useSidebar();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        class="flex w-full items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left transition-colors hover:border-sidebar-border hover:bg-sidebar-accent"
      >
        <Avatar class="h-7 w-7">
          <AvatarFallback class="bg-primary/10 text-primary text-xs">
            A
          </AvatarFallback>
        </Avatar>
        <div v-if="!collapsed" class="min-w-0">
          <p class="truncate text-sm font-medium text-sidebar-foreground">
            shadcn
          </p>
          <p class="truncate text-xs text-muted-foreground">m@example.com</p>
        </div>
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" class="w-48">
      <DropdownMenuItem @select="router.push('/settings/profile')">
        <User class="mr-2 h-4 w-4" />
        个人信息
      </DropdownMenuItem>
      <DropdownMenuItem @select="router.push('/settings/appearance')">
        <Settings class="mr-2 h-4 w-4" />
        设置
      </DropdownMenuItem>
      <DropdownMenuItem @select="router.push('/permissions/roles')">
        <Settings class="mr-2 h-4 w-4" />
        角色设置
      </DropdownMenuItem>
      <DropdownMenuItem class="text-destructive">
        <LogOut class="mr-2 h-4 w-4" />
        退出登录
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
