import { inject, provide, ref, type Ref } from "vue";

type SidebarContextType = {
  collapsed: Ref<boolean>;
  setCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
};

const sidebarContext = Symbol("sidebar");

export function provideSidebar(defaultCollapsed = false) {
  const collapsed = ref(defaultCollapsed);
  const setCollapsed = (value: boolean) => {
    collapsed.value = value;
  };

  const ctx: SidebarContextType = {
    collapsed,
    setCollapsed,
    toggleSidebar: () => {
      collapsed.value = !collapsed.value;
    },
  };

  provide<SidebarContextType>(sidebarContext, ctx);
  return ctx;
}

export function useSidebar() {
  const context = inject<SidebarContextType>(sidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
