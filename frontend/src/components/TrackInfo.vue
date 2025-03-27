<script setup lang="ts">
import { ref } from "vue";
import { fetchTrack, fetchAudioFeatures } from "../services/spotifyService";

const trackId = ref("");
const trackData = ref<SpotifyApi.TrackObjectFull | null>(null);
const audioFeatures = ref<SpotifyApi.AudioFeaturesObject | null>(null);

async function searchTrack() {
  if (!trackId.value) return;

  try {
    trackData.value = await fetchTrack(trackId.value);
    audioFeatures.value = await fetchAudioFeatures(trackId.value);
    console.log(trackData.value);
    console.log(audioFeatures.value);
  } catch (error) {
    console.error("Error fetching track:", error);
  }
}
</script>

<template>
  <div>
    <input v-model="trackId" placeholder="Enter Spotify Track ID" />
    <button @click="searchTrack">Get Track Info</button>

    <div v-if="trackData">
      <h2>{{ trackData.name }} by {{ trackData.artists[0].name }}</h2>
      <p>Album: {{ trackData.album.name }}</p>
      <img :src="trackData.album.images[0].url" alt="Album cover" width="100" />

      <h3>Audio Features:</h3>
      <p>Tempo: {{ audioFeatures?.tempo }}</p>
      <p>Energy: {{ audioFeatures?.energy }}</p>
      <p>Valence: {{ audioFeatures?.valence }}</p>
    </div>
  </div>
</template>
