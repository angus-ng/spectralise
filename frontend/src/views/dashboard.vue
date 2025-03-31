<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import {
  fetchTopTracks,
  fetchArtists,
  redirectToSpotifyLogin,
} from "../services/spotifyService";

const trackData = ref<SpotifyApi.TrackObjectFull[] | null>(null);
const artistsData = ref<SpotifyApi.ArtistObjectFull[] | null>(null);
const accessToken = ref<string | null>(null);
const timeRange = ref<string>(null);
const copiedTrackId = ref(null);

import axios from "axios";

async function getAccessToken() {
  try {
    const response = await axios.get("/api/token", {
      withCredentials: true,
    });

    accessToken.value = response.data.accessToken;
    // console.log("Access Token Fetched:", accessToken.value);
  } catch (error) {
    console.error("Error fetching access token:", error);
    console.warn("Unauthorized, redirecting to login...");
    redirectToSpotifyLogin();
  }
}

function copyColor(track) {
  const color = generateColor(track.id + track.name + track.artist / 3);
  navigator.clipboard.writeText(color).then(() => {
    copiedTrackId.value = track.id;
    setTimeout(() => (copiedTrackId.value = null), 2000);
  });
}

async function fetchTopTracksData() {
  try {
    // console.log("Fetching top tracks...");
    trackData.value = await fetchTopTracks(accessToken.value, timeRange.value);
    // console.log("Top Tracks Data:", trackData.value);

    if (!trackData.value || trackData.value.length === 0) {
      console.warn("No top tracks found.");
      return;
    }

    // const artistIds = trackData.value
    //   ?.map((track) => track.artists[0].id)
    //   .join(",");

    // if (artistIds) {
    //   console.log("Fetching artist details...");
    //   artistsData.value = await fetchArtists(accessToken.value, artistIds);
    // }
  } catch (error) {
    console.error("Error fetching top tracks or artists:", error);
  }
}

async function logOut() {
  try {
    await fetch("/api/logout", { method: "POST" });
    accessToken.value = null;
    redirectToSpotifyLogin();
  } catch (error) {
    console.error("Error logging out:", error);
  }
}
onMounted(async () => {
  await getAccessToken();
});
function generateColor(id) {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `#${((hash * 1234567) % 0xffffff).toString(16).padStart(6, "0")}`;
}
watch(timeRange, fetchTopTracksData);
</script>

<template>
  <div
    class="flex flex-col md:flex-row h-screen w-full overflow-auto p-6 gap-6"
  >
    <div class="w-full md:w-1/5 flex flex-col p-6 rounded-lg">
      <p class="text-4xl flex items-center">
        <img
          src="/spectralise.svg"
          alt="Spectralise Logo"
          width="24"
          height="24"
          class="mr-2"
        />spectralise
      </p>
      <div class="flex-grow flex flex-col items-start justify-center">
        <div
          class="bg-black border-white border aspect-square max-w-[256px] w-full rounded-md"
        ></div>
        <p class="text-xl text-white text-center mt-4">username</p>
      </div>
      <div class="mt-6 flex justify-start">
        <button
          class="text-white border-0 hover:border-transparent! transition duration-300 hover:text-red-700"
          @click="logOut"
        >
          Log Out
        </button>
      </div>
    </div>

    <div class="w-full md:w-2/3 flex flex-col gap-4 p-6 flex-1">
      <h1 class="text-2xl font-bold text-white">Your Top Tracks</h1>

      <div class="flex flex-col md:flex-row items-center gap-4 mb-8 self-end">
        <label for="timeRange" class="text-white">Date:</label>
        <select
          v-model="timeRange"
          id="timeRange"
          class="p-3 rounded bg-black text-white outline-1"
        >
          <option :value="null" disabled selected>-----</option>
          <option value="short_term">Past Month</option>
          <option value="medium_term">Past 6 Months</option>
          <option value="long_term">Past Year</option>
        </select>
      </div>
      <div class="flex flex-col flex-1 flex-grow justify-center">
        <div
          v-if="trackData && trackData.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pb-6"
        >
          <div
            @click="copyColor(track)"
            v-for="(track, index) in trackData"
            :key="track.id"
            class="p-4 rounded-lg text-white flex flex-col items-center border border-gray-600 hover:border-white transition h-full relative"
          >
            <div
              class="absolute top-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded transition-opacity duration-300"
              v-if="copiedTrackId === track.id"
            >
              Copied!
            </div>

            <div
              class="flex flex-col flex-grow justify-between items-center w-full text-center"
            >
              <h3 class="text-lg font-bold">
                {{ track.name }} <br />
                by {{ track.artists[0].name }}
              </h3>
              <p class="text-sm text-gray-400">Album: {{ track.album.name }}</p>
            </div>

            <img
              :src="track.album.images[0]?.url"
              alt="Album cover"
              class="w-full h-auto mt-2 rounded"
            />

            <div class="mt-4 flex flex-col items-center">
              <div
                :style="{
                  backgroundColor: generateColor(
                    track.id + track.name + track.artist / 3
                  ),
                }"
                class="w-12 h-12 rounded-full border border-gray-400 cursor-pointer"
              ></div>
              <p class="mt-2 text-sm text-gray-300 cursor-pointer">
                {{ generateColor(track.id + track.name + track.artist / 3) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- <div v-if="artistsData && artistsData.length > 0">
          <h2 class="text-xl font-bold text-white">Artist Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="artist in artistsData"
            :key="artist.id"
            class="p-4 rounded-lg text-white flex flex-col items-center border border-gray-600 hover:border-white transition"
          >
            <h3 class="text-lg font-bold text-center">{{ artist.name }}</h3>
            <p class="text-sm text-gray-400">
              Genres: {{ artist.genres.join(", ") }}
            </p>
            <img
              :src="artist.images[0]?.url"
              alt="Artist image"
              class="w-full h-auto mt-2 rounded"
            />
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.track {
  margin-bottom: 20px;
}
</style>
