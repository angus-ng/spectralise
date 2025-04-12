import axios from "axios";

const API_BASE_URL = "spotify";

export async function fetchTopTracks(
  token: string | null,
  timeRange: string | null
) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BACKEND
      }${API_BASE_URL}/top-tracks?timeRange=${timeRange}`,
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
      `${import.meta.env.VITE_BACKEND}${API_BASE_URL}/artists/${artistIdList}`,
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
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND}api/refresh-token`,
      {
        withCredentials: true,
      }
    );
    return response.data.access_token as string;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    window.location.href = "/";
    return null;
  }
}
