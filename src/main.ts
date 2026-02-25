import { createApp } from "vue";
import App from "@/App.vue";
import { router } from "@/router";
import "@unovis/ts/styles/index.js";
import "@/styles.css";

createApp(App).use(router).mount("#app");
