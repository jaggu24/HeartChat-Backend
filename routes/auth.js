const db = require("../database");
const express = require("express");
const Joi = require("joi");

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
    .required()
});
auth.post("/auth/signUp", (req, res) => {
  console.log(req.body);
  const result = schema.validate(req.body);
  let data = [];
  if (typeof result.error === "undefined") {
    db.query(
      "insert into `auth` (username,password,dob) values(?,?,?)",
      [result.value.username, result.value.password, "2000-02-04"],
      function(error, results, fields) {
        if (error) return res.status(404).send({ error: error });
      }
    );
  } else {
    return res.status(400).send({ error: "Bad request" });
  }
  console.log(data);
  return res.send({ status: 200, givenUser: data });
});

module.exports = auth;
