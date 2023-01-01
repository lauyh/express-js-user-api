"use strict";

const { generateKeyPairSync } = require("crypto");
const path = require("path");
const fs = require("fs");

function genKeyPair() {
  const keyPair = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  const ABSOLUTE_PATH = path.join(__dirname, "../", "cert/");
  if (!fs.existsSync(ABSOLUTE_PATH)) {
    fs.mkdirSync(ABSOLUTE_PATH);
  }
  fs.writeFileSync(ABSOLUTE_PATH + "access_token_pub.pem", keyPair.publicKey); // generate public key file
  fs.writeFileSync(ABSOLUTE_PATH + "access_token_priv.pem", keyPair.privateKey); // generate private key file
  fs.writeFileSync(ABSOLUTE_PATH + "refresh_token_pub.pem", keyPair.publicKey); // generate public key file
  fs.writeFileSync(
    ABSOLUTE_PATH + "refresh_token_priv.pem",
    keyPair.privateKey
  ); // generate private key file
}

genKeyPair();
