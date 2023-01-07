require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const privateKey = process.env.JWT_PRIVATE_KEY;
const privateKey = "hamna"

const generateAuthToken = ({ username, email }) =>
  jwt.sign({ username, email}, privateKey);

const verifyAuthToken = (token) => {
  console.log ('here token is ---------------',jwt.verify(token, privateKey))
  return jwt.verify(token, privateKey)};
  const generateHash = (text) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(text, salt);
    return hash;
  };
  
  const compareHash = (rawText, hashText) =>
    bcrypt.compareSync(rawText, hashText);

module.exports = {
  generateAuthToken,
  verifyAuthToken,
  compareHash,
  generateHash,

};
