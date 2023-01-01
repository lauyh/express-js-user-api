"use strict";

const bcrypt = require("bcryptjs");

/**
 *  Hash password with bcrypt
 *  @param {string} password - the user password
 **/
function generatePassword(password) {
  const salt = bcrypt.genSaltSync(15);
  const hash = bcrypt.hashSync(password, salt);
  return hash.toString();
}

/**
 *  compare password with bcrypt
 *  @param {string} password - the user password
 *  @param {string} hash - bcrypt hash from db
 **/
function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

module.exports = {
  generate: generatePassword,
  compare: comparePassword,
};
