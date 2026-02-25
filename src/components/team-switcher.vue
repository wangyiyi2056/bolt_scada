<script setup lang="ts">
  import { ref } from "vue";
  import { ChevronsUpDown, Plus } from "lucide-vue-next";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { useSidebar } from "@/components/ui/sidebar";

  defineOptions({ name: "TeamSwitcher" });

  type Team = { name: string; plan: string };

  const teams: Team[] = [
    { name: "Acme Inc", plan: "Enterprise" },
    { name: "SCADA Ops", plan: "Production" },
    { name: "Lab Sandbox", plan: "Development" },
  ];

  const activeTeam = ref(teams[0]);
  const { collapsed } = useSidebar();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="h-10 w-full items-center justify-between rounded-lg border border-transparent px-2 hover:border-sidebar-border hover:bg-sidebar-accent"
      >
        <div class="flex min-w-0 items-center gap-2">
          <div
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold"
          >
            {{ activeTeam.name.charAt(0) }}
          </div>
          <div v-if="!collapsed" class="min-w-0 text-left">
            <p class="truncate text-sm font-medium text-sidebar-foreground">
              {{ activeTeam.name }}
            </p>
            <p class="truncate text-xs text-muted-foreground">
              {{ activeTeam.plan }}
            </p>
          </div>
        </div>
        <ChevronsUpDown
          v-if="!collapsed"
          class="h-4 w-4 text-muted-foreground"
        />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="start" class="w-56">
      <DropdownMenuItem
        v-for="team in teams"
        :key="team.name"
        @select="activeTeam = team"
      >
        <div class="flex flex-col">
          <span class="text-sm">{{ team.name }}</span>
          <span class="text-xs text-muted-foreground">{{ team.plan }}</span>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Plus class="mr-2 h-4 w-4" />
        添加团队
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
