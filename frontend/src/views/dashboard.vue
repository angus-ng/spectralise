<script setup lang="ts">
/// <reference types="@types/spotify-api" />
import { ref, watch, onMounted } from "vue";
import {
  fetchTopTracks,
  // fetchArtists,
  redirectToSpotifyLogin,
  refreshAccessToken,
} from "../services/spotifyService";
import axios from "axios";

const trackData = ref<SpotifyApi.TrackObjectFull[] | null>(null);
// const artistsData = ref<SpotifyApi.ArtistObjectFull[] | null>(null);
const accessToken = ref<string | null>(null);
const timeRange = ref<string | null>(null);
const copiedTrackId = ref<string | null>(null);
const loading = ref(false);
const userProfile = ref<{ display_name: string; image: string | null } | null>(
  null
);

async function fetchUserProfile() {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken.value}` },
    });

    userProfile.value = {
      display_name: response.data.display_name,
      image:
        response.data.images.length > 0 ? response.data.images[0].url : null,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

async function setupAccessToken() {
  accessToken.value = (await getAccessToken()) ?? null;

  if (!accessToken.value) {
    console.warn("Access token missing, trying to refresh...");
    accessToken.value = await refreshAccessToken();
  }

  setInterval(async () => {
    console.log("Refreshing access token...");
    accessToken.value = await refreshAccessToken();
  }, 55 * 60 * 1000);
}

async function getAccessToken() {
  try {
    const response = await axios.get("/api/token", {
      withCredentials: true,
    });

    accessToken.value = response.data.accessToken;
    // console.log("Access Token Fetched:", accessToken.value);
    if (accessToken.value) {
      await fetchUserProfile();
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
    console.warn("Unauthorized, redirecting to login...");
    redirectToSpotifyLogin();
  }
}

function copyColor(track: SpotifyApi.TrackObjectFull) {
  const color = generateColor(track.id + track.name + track.artists[0]?.name);
  navigator.clipboard.writeText(color).then(() => {
    copiedTrackId.value = track.id;
    setTimeout(() => (copiedTrackId.value = null), 2000);
  });
}

async function fetchTopTracksData() {
  try {
    loading.value = true;
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
  } finally {
    loading.value = false;
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
onMounted(setupAccessToken);
function generateColor(id: string) {
  const hash = id
    .split("")
    .reduce((acc: any, char: any) => acc + char.charCodeAt(0), 0);
  return `#${((hash * 1234567) % 0xffffff).toString(16).padStart(6, "0")}`;
}
watch(timeRange, fetchTopTracksData);
</script>

<template>
  <div
    class="flex flex-col md:flex-row h-screen w-full overflow-auto p-6 gap-6"
  >
    <div class="w-full md:w-1/5 flex flex-col p-6 rounded-lg">
      <p class="text-4xl flex items-center py-6 md:py-0">
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
          v-if="userProfile && userProfile.image"
          class="aspect-square max-w-[256px] rounded-md overflow-hidden"
        >
          <img
            :src="userProfile.image"
            alt="Profile Picture"
            class="w-full h-full object-cover rounded-md"
          />
        </div>
        <div
          v-else
          class="bg-black border-white border aspect-square max-w-[256px] w-full rounded-md"
        ></div>

        <p class="text-xl text-white text-center mt-4">
          {{ userProfile?.display_name || "Unknown User" }}
        </p>
      </div>
      <div class="mt-6 flex justify-start">
        <button
          class="text-white border-0 hover:border-transparent! transition duration-300 hover:text-red-700"
          @click="logOut"
        >
          log out
        </button>
      </div>
    </div>

    <div class="w-full md:w-2/3 flex flex-col gap-4 p-6 flex-1">
      <h1 class="text-2xl font-bold text-white">your top tracks.</h1>

      <div class="flex flex-col md:flex-row items-center gap-4 mb-8 self-end">
        <label for="timeRange" class="text-white">date:</label>
        <select
          v-model="timeRange"
          id="timeRange"
          class="p-3 rounded bg-black text-white outline-1"
        >
          <option :value="null" disabled selected>-----</option>
          <option value="short_term">past month</option>
          <option value="medium_term">past 6 months</option>
          <option value="long_term">past year</option>
        </select>
      </div>
      <div class="flex flex-col flex-1 flex-grow justify-center">
        <div class="flex flex-col flex-1 flex-grow justify-center">
          <div v-if="!timeRange" class="text-center text-gray-400">
            select a date range to see your top tracks.
          </div>

          <div v-else-if="loading" class="text-center text-gray-400">
            loading your top tracks...
          </div>

          <div
            v-else-if="trackData && trackData.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pb-6"
          >
            <div
              @click="copyColor(track)"
              v-for="track in trackData"
              :key="track.id"
              class="p-4 rounded-lg text-white flex flex-col items-center border border-gray-600 hover:border-white transition h-full relative"
            >
              <div
                class="absolute top-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded transition-opacity duration-300"
                v-if="copiedTrackId === track.id"
              >
                colour code copied!
              </div>

              <div
                class="flex flex-col flex-grow justify-between items-center w-full text-center"
              >
                <h3 class="text-lg font-bold">
                  {{ track.name }} <br />
                  by {{ track.artists[0].name }}
                </h3>
                <p class="text-sm text-gray-400">
                  Album: {{ track.album.name }}
                </p>
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
                      track.id + track.name + track.artists[0]?.name
                    ),
                  }"
                  class="w-12 h-12 rounded-full border border-gray-400 cursor-pointer"
                ></div>
                <p class="mt-2 text-sm text-gray-300 cursor-pointer">
                  {{
                    generateColor(
                      track.id + track.name + track.artists[0]?.name
                    )
                  }}
                </p>
              </div>
              <a
                :href="track.external_urls.spotify"
                target="_blank"
                class="mt-4 w-full"
              >
                <button
                  class="w-full bg-[#00D961] hover:bg-[#00b850] text-[#0A0A0A] font-semibold py-2 px-4 rounded-full transition duration-300"
                >
                  listen on spotify
                </button>
              </a>
            </div>
          </div>

          <div v-else class="text-center text-gray-400">
            no top tracks found for the selected date range.
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
