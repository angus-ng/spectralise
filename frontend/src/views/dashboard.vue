<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  fetchTopTracks,
  fetchArtists,
  redirectToSpotifyLogin,
} from "../services/spotifyService";

const trackData = ref<SpotifyApi.TrackObjectFull[] | null>(null);
const artistsData = ref<SpotifyApi.ArtistObjectFull[] | null>(null);
const accessToken = ref<string | null>(null);
const timeRange = ref<string>("short_term");

async function fetchTopTracksData() {
  if (!accessToken.value) {
    console.error("No access token available");
    return;
  }

  try {
    console.log("Fetching top tracks...");
    trackData.value = await fetchTopTracks(timeRange.value);
    console.log("Top Tracks Data:", trackData.value);

    if (!trackData.value || trackData.value.length === 0) {
      console.warn("No top tracks found.");
      return;
    }

    const artistIds = trackData.value
      ?.map((track) => track.artists[0].id)
      .join(",");

    if (artistIds) {
      console.log("Fetching artist details...");
      artistsData.value = await fetchArtists(artistIds);
    }
  } catch (error) {
    console.error("Error fetching top tracks or artists:", error);
  }
}

watch(timeRange, fetchTopTracksData);
</script>

<template>
  <div>
    <h1>Your Top Tracks</h1>

    <label for="timeRange">Select Time Range:</label>
    <select v-model="timeRange" id="timeRange">
      <option value="short_term">Short Term</option>
      <option value="medium_term">Medium Term</option>
      <option value="long_term">Long Term</option>
    </select>

    <button @click="fetchTopTracksData">Fetch Top Tracks</button>

    <div v-if="trackData && trackData.length > 0">
      <div v-for="(track, index) in trackData" :key="track.id" class="track">
        <h3>{{ track.name }} by {{ track.artists[0].name }}</h3>
        <p>Album: {{ track.album.name }}</p>
        <img :src="track.album.images[0]?.url" alt="Album cover" width="100" />
      </div>
    </div>

    <div v-if="artistsData && artistsData.length > 0">
      <h2>Artist Information</h2>
      <div v-for="artist in artistsData" :key="artist.id">
        <h3>{{ artist.name }}</h3>
        <p>Genres: {{ artist.genres.join(", ") }}</p>
        <img :src="artist.images[0]?.url" alt="Artist image" width="100" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.track {
  margin-bottom: 20px;
}
</style>
