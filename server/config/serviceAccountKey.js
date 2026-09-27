// Throws a descriptive error if Firebase credentials are incomplete.
// Callers must catch this — push notifications are non-critical and must
// never take down the whole API (see index.js lazy init).
function loadServiceAccount() {
  const required = [
    "TYPE",
    "PROJECT_ID",
    "PRIVATE_KEY",
    "PRIVATE_KEY_ID",
    "CLIENT_EMAIL",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(
      `Incomplete Firebase credentials. Missing env vars: ${missing.join(", ")}`
    );
  }

  const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
  return {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    private_key: privateKey,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
    "universe_domain": process.env.UNIVERSE_DOMAIN,
  };
}

module.exports = { loadServiceAccount };
