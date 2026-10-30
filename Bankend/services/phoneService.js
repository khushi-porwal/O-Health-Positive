
const PHONEPE_BASE_URL =
  process.env.PHONEPE_ENV === "PRODUCTION"
    ? "https://api.phonepe.com/apis/pg"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox";

const PHONEPE_AUTH_URL =
  process.env.PHONEPE_ENV === "PRODUCTION"
    ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Keep sensitive credentials and tokens out of client responses.
    console.error("PhonePe API error:", response.status, data);
    throw new Error(`PhonePe request failed (${response.status})`);
  }

  return data;
}

async function getAccessToken() {
  const {
    PHONEPE_CLIENT_ID,
    PHONEPE_CLIENT_SECRET,
    PHONEPE_CLIENT_VERSION,
  } = process.env;

  if (
    !PHONEPE_CLIENT_ID ||
    !PHONEPE_CLIENT_SECRET ||
    !PHONEPE_CLIENT_VERSION
  ) {
    throw new Error("PhonePe credentials are not configured");
  }

  const form = new URLSearchParams({
    client_id: PHONEPE_CLIENT_ID,
    client_secret: PHONEPE_CLIENT_SECRET,
    client_version: String(PHONEPE_CLIENT_VERSION),
    grant_type: "client_credentials",
  });

  const response = await fetch(PHONEPE_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });

  const data = await parseResponse(response);

  if (!data.access_token) {
    throw new Error("PhonePe did not return an access token");
  }

  return data.access_token;
}

async function initiatePhonePePayment({
  merchantOrderId,
  amountInPaise,
  redirectUrl,
}) {
  const token = await getAccessToken();

  const response = await fetch(`${PHONEPE_BASE_URL}/checkout/v2/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify({
      merchantOrderId,
      amount: amountInPaise,
      expireAfter: 1200,
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          redirectUrl,
        },
      },
    }),
  });

  const data = await parseResponse(response);

  if (!data.redirectUrl) {
    console.error("PhonePe response did not contain redirectUrl");
    throw new Error("PhonePe checkout URL was not returned");
  }

  return data;
}

async function getPhonePeOrderStatus(merchantOrderId) {
  const token = await getAccessToken();

  const response = await fetch(
    `${PHONEPE_BASE_URL}/checkout/v2/order/${encodeURIComponent(
      merchantOrderId
    )}/status?details=false`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${token}`,
      },
    }
  );

  return parseResponse(response);
}

module.exports = {
  initiatePhonePePayment,
  getPhonePeOrderStatus,
};
