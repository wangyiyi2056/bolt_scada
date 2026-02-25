<script setup lang="ts">
  import { computed } from "vue";
  import { RouterLink, useRoute } from "vue-router";
  import { Separator } from "@/components/ui/separator";
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  import { SidebarTrigger } from "@/components/ui/sidebar";
  import { navConfig } from "@/lib/nav-config";

  defineOptions({ name: "AppHeader" });

  const route = useRoute();

  function getPageTitle(pathname: string): {
    title: string;
    sub?: string;
    href?: string;
  } {
    for (const nav of navConfig) {
      if (pathname.startsWith(nav.href)) {
        const child = nav.children.find((c) => c.href === pathname);
        return {
          title: nav.title,
          sub: child?.title,
          href: nav.href,
        };
      }
    }
    return { title: "SCADA", href: "/dashboard" };
  }

  const page = computed(() => getPageTitle(route.path));
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b border-border/70 bg-background/90 px-4 backdrop-blur-sm md:px-6"
  >
    <SidebarTrigger
      class="-ml-1 border border-border/60 bg-background/80 shadow-sm hover:bg-accent"
    />
    <Separator orientation="vertical" class="mr-2 h-4" />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem class="hidden md:block">
          <RouterLink
            :to="page.href || '/dashboard'"
            class="transition-colors hover:text-foreground"
          >
            {{ page.title }}
          </RouterLink>
        </BreadcrumbItem>
        <template v-if="page.sub">
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{{ page.sub }}</BreadcrumbPage>
          </BreadcrumbItem>
        </template>
      </BreadcrumbList>
    </Breadcrumb>
  </header>
</template>
