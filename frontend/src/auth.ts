import createKindeClient from "@kinde-oss/kinde-auth-pkce-js";

export const kinde = await createKindeClient({
  client_id: import.meta.env.VITE_KINDE_CLIENT_ID,
  domain: import.meta.env.VITE_KINDE_DOMAIN,
  redirect_uri: import.meta.env.VITE_KINDE_REDIRECT_URI,
  logout_uri: import.meta.env.VITE_KINDE_LOGOUT_URI,
});
