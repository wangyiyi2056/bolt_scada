<script setup lang="ts">
  import { useAttrs } from "vue";
  import { PanelLeft } from "lucide-vue-next";
  import { cn } from "@/lib/utils";
  import Button from "./Button.vue";
  import { useSidebar } from "./sidebar-context";

  defineOptions({ name: "SidebarTrigger", inheritAttrs: false });
  const { toggleSidebar } = useSidebar();
  const attrs = useAttrs();
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    v-bind="attrs"
    :class="cn('h-8 w-8 rounded-md', attrs.class as string)"
    @click="toggleSidebar()"
  >
    <PanelLeft class="h-4 w-4" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
