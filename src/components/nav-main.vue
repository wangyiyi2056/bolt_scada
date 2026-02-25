<script setup lang="ts">
  import { ref, watch, type Component } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { ChevronRight } from "lucide-vue-next";
  import { cn } from "@/lib/utils";
  import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    useSidebar,
  } from "@/components/ui/sidebar";

  type NavMainItem = {
    title: string;
    url: string;
    icon: Component;
    items: { title: string; url?: string; href?: string }[];
  };

  defineOptions({ name: "NavMain" });

  const props = defineProps<{
    items: NavMainItem[];
  }>();

  const route = useRoute();
  const router = useRouter();
  const { collapsed } = useSidebar();

  const openMap = ref<Record<string, boolean>>({});

  watch(
    () => route.path,
    (path) => {
      const nextMap: Record<string, boolean> = { ...openMap.value };
      props.items.forEach((item) => {
        if (path.startsWith(item.url)) {
          nextMap[item.url] = true;
        }
      });
      openMap.value = nextMap;
    },
    { immediate: true },
  );

  function toggleItem(item: NavMainItem) {
    if (collapsed.value) {
      router.push(item.url);
      return;
    }
    openMap.value[item.url] = !openMap.value[item.url];
  }

  function navigateSub(sub: { url?: string; href?: string }) {
    const target = sub.url || sub.href;
    if (target && route.path !== target) {
      router.push(target);
    }
  }
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem v-for="item in props.items" :key="item.url">
      <SidebarMenuButton
        :is-active="route.path.startsWith(item.url)"
        @click="toggleItem(item)"
      >
        <component :is="item.icon" class="h-4 w-4 shrink-0" />
        <template v-if="!collapsed">
          <span class="truncate">{{ item.title }}</span>
          <ChevronRight
            :class="
              cn(
                'ml-auto h-4 w-4 transition-transform',
                (route.path.startsWith(item.url) || openMap[item.url]) &&
                  'rotate-90',
              )
            "
          />
        </template>
      </SidebarMenuButton>

      <SidebarMenuSub
        v-if="
          !collapsed && (route.path.startsWith(item.url) || openMap[item.url])
        "
      >
        <SidebarMenuSubItem
          v-for="sub in item.items"
          :key="sub.url || sub.href || sub.title"
        >
          <button
            type="button"
            :class="
              cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-muted-foreground transition-colors',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                route.path === (sub.url || sub.href) &&
                  'bg-primary/10 text-primary font-medium',
              )
            "
            @click.stop="navigateSub(sub)"
          >
            {{ sub.title }}
          </button>
        </SidebarMenuSubItem>
      </SidebarMenuSub>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
