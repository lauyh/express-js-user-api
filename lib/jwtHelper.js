const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// ------------------------------ Priv Key ----------------------------------
const pathToKey = path.join(__dirname, "../", "cert/access_token_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

//------------------------------ Public Key --------------------------------
const pathToPubCert = path.join(__dirname, "../", "cert/access_token_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPubCert, "utf8");
// ------------------------------ Issuer -------------------------
const ISSUER = "creative-demo.net";
const SUBJECT = "creative-demo-access-token";
const AUDIENCE = "https://creative.demo.net";

var payload = {
  username: "",
  userId: "",
  email: "",
};
const signOptions = {
  issuer: ISSUER,
  subject: SUBJECT,
  audience: AUDIENCE,
  expiresIn: "120s", // demo purposes only
  algorithm: "RS256",
};
const issueJWT = (user) => {
  payload.email = user.email;
  payload.userId = user.id;
  payload.username = user.name;

  return jwt.sign(payload, PRIV_KEY, signOptions);
};

const verifyAccessToken = (accessToken) => {
  try {
    const legin = jwt.verify(accessToken, PUB_KEY, signOptions);
    console.log("[jwtHelper]\t-\tvalid user => ", legin.username);

    return true;
  } catch (error) {
    console.log("[error]\t-\ttoken expired\t-\t" + new Date().toLocaleString());
    return false;
  }
};

module.exports = {
  issueJWT,
  verifyAccessToken,
};
