<script setup lang="ts">
function login() {
  window.location.href = "/spotify/login";
}
</script>

<template>
  <div class="h-screen flex flex-col justify-center items-center gap-16">
    <div class="flex gap-2 items-center">
      <img
        src="/spectralise.svg"
        alt="Spectralise Logo"
        width="24"
        height="24"
      />
      <h1>spectralise</h1>
    </div>
    <button
      class="rounded-full bg-[#00D961] text-[#0A0A0A] py-2 px-6 w-fit transition duration-300 hover:bg-[#00b850]"
      @click="login"
    >
      login with spotify
    </button>
  </div>
</template>
