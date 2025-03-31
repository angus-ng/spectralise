<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();
const route = useRoute();

onMounted(() => {
  const accessToken = route.query.access_token as string;
  if (accessToken) {
    localStorage.setItem("access_token", accessToken);
    router.push("/dashboard");
  } else {
    router.push("/");
  }
});
</script>

<template>
  <div>Authenticating...</div>
</template>
