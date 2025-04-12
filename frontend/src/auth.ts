import axios from "axios";

export const checkAuthentication = async (): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND}api/verify`,
      {
        withCredentials: true,
      }
    );
    // console.log("Authentication check response:", response);
    return response.status === 200;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};

export const logOut = async (): Promise<void> => {
  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND}api/logout`,
      {},
      { withCredentials: true }
    );
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
