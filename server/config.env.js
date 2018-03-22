module.exports = {
  "baseUrl": process.env.ZKIT_BASE_URL,
  "appOrigins": ["http://localhost:3000", process.env.ZKIT_APP_ORIGIN],
  "zeroKit": {
    "serviceUrl": `https://${process.env.ZKIT_TENANT_ID}.api.tresorit.io`,
    "adminUserId": `admin@${process.env.ZKIT_TENANT_ID}.tresorit.io`,
    "adminKey": process.env.ZKIT_ADMIN_KEY,
    "sdkVersion": process.env.ZKIT_SDK_VERSION,
    "idp": [
      {
        "clientID": process.env.ZKIT_CODE_CLIENT_ID,
        "clientSecret": process.env.ZKIT_CODE_CLIENT_SECRET,
        "callbackURL": process.env.ZKIT_CODE_REDIR_URL
      }
    ]
  }
};