const PAYPAL_BASE_URL =
  process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
let accessToken: string | null = null;
let expiresAt = 0;
async function requestAccessToken() {
  const auth = Buffer
    .from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    )
    .toString("base64");
  const response = await fetch(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );
  if (!response.ok) {
    throw new Error(
      "No se pudo obtener el access token de PayPal."
    );
  }
  const data = await response.json();
  accessToken = data.access_token;
  expiresAt =
    Date.now() +
    (data.expires_in - 60) * 1000;

  return accessToken;
}
export async function getAccessToken() {

  if (
    accessToken &&
    Date.now() < expiresAt
  ) {
    return accessToken;
  }
  return await requestAccessToken();
}

export function getPaypalBaseUrl() {
  return PAYPAL_BASE_URL;
}