const db = require("../database");
const express = require("express");
const Joi = require("joi");
const CryptoJS = require("crypto-js");

const encrypt = text => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};

const decrypt = data => {
  return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};

auth = express.Router();
auth.use(express.json());

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(8)
    .required(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] }
  })
});
auth.post("/signUp", (req, res) => {
  console.log(req.body);
  const result = schema.validate(req.body);
  if (typeof result.error === "undefined") {
    db.query(
      "insert into `auth` (username,password,email) values(?,?,?)",
      [
        result.value.username,
        encrypt(result.value.password),
        result.value.email
      ],
      function(error, results, fields) {
        if (error)
          return res.status(404).send({ status: 404, error: error.message });
        return res.send({ status: 200, message: results });
      }
    );
  } else {
    return res.status(400).send({ status: 400, error: result.error.message });
  }
});

auth.get("/signIn/:username/:password", (req, res) => {
  const result = schema.validate({
    username: req.params.username,
    password: req.params.password
  });
  let data = [];
  if (typeof result.error === "undefined") {
    db.query(
      "select password from `auth` where username=?",
      [result.value.username],
      function(error, results, fields) {
        if (error)
          return res.status(404).send({ status: 404, error: error.message });
        if (decrypt(results[0].password) === result.value.password)
          return res.send({ status: 200, data: "Login Sucessful" });
        else
          return res.send({ status: 200, data: "Invalid User creditionals" });
      }
    );
  } else {
    return res.status(400).send({ status: 400, error: result.error.message });
  }
  return console.log(1);
});
module.exports = auth;
