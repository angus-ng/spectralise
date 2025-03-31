import axios from "axios";

const API_BASE_URL = "/spotify";

export async function fetchTopTracks(timeRange: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/top-tracks?timeRange=${timeRange}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw error;
  }
}

export async function fetchArtists(artistIdList: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/artists/${artistIdList}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }
}

export function redirectToSpotifyLogin() {
  window.location.href = "/";
}
