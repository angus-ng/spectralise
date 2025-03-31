import axios from "axios";

export const checkAuthentication = async (): Promise<boolean> => {
  try {
    const response = await axios.get("/api/verify", { withCredentials: true });
    return response.status === 200;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};
