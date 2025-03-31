import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Login from "./views/login.vue";
import Dashboard from "./views/dashboard.vue";
import AuthHandler from "./views/authHandler.vue";
import { checkAuthentication } from "./auth";

const routes: Array<RouteRecordRaw> = [
  { path: "/", component: Login, name: "Login" },
  { path: "/callback", component: AuthHandler },
  {
    path: "/dashboard",
    component: Dashboard,
    beforeEnter: async (to, from, next) => {
      try {
        const isAuthenticated = await checkAuthentication();
        console.log(isAuthenticated);
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
