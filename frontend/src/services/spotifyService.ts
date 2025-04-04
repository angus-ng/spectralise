import axios from "axios";

const API_BASE_URL = "/spotify";

export async function fetchTopTracks(token: string, timeRange: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/top-tracks?timeRange=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw error;
  }
}

export async function fetchArtists(token: string, artistIdList: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/artists/${artistIdList}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

export async function refreshAccessToken() {
  try {
    const response = await axios.get("/api/refresh-token", {
      withCredentials: true,
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    window.location.href = "/";
    return null;
  }
}
