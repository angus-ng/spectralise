<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function login() {
  window.location.href = "/spotify/login";
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1>spectralise</h1>
    <button
      class="rounded-full bg-[#00D961] text-[#0A0A0A] px-4 py-2 transition duration-300 hover:bg-[#00b850]"
      @click="login"
    >
      login with spotify
    </button>
  </div>
</template>
