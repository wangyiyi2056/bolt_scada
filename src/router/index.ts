import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const modules = import.meta.glob("../pages/**/page.vue", { eager: true });

const routes: RouteRecordRaw[] = Object.entries(modules).map(([file, mod]) => {
  const path = file.replace("../pages", "").replace("/page.vue", "");

  return {
    path: path || "/",
    component: (mod as { default: any }).default,
  };
});

routes.push({
  path: "/",
  redirect: "/dashboard",
});

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
