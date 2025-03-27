import axios from "axios";

const API_BASE_URL = "/spotify";

export async function fetchTrack(trackId: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/track/${trackId}`);
    console.log("Track Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching track:", error);
    throw error;
  }
}

export async function fetchAudioFeatures(trackId: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/audio-features/${trackId}`
    );
    console.log("Audio Features Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching audio features:", error);
    throw error;
  }
}
