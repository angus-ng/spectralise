import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Login from "./views/login.vue";
import Dashboard from "./views/dashboard.vue";
import { checkAuthentication } from "./auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Login,
    name: "Login",
    beforeEnter: async (to, from, next) => {
      try {
        const isAuthenticated = await checkAuthentication();
        if (isAuthenticated) {
          next({ name: "Dashboard" });
        } else {
          next();
        }
      } catch (error) {
        console.error("Authentication check failed", error);
        next();
      }
    },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    name: "Dashboard",
    beforeEnter: async (to, from, next) => {
      try {
        const isAuthenticated = await checkAuthentication();
        if (isAuthenticated) {
          next();
        } else {
          next({ name: "Login" });
        }
      } catch (error) {
        console.error("Authentication check failed", error);
        next({ name: "Login" });
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
