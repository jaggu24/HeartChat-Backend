const db = require("../database");
const express = require("express");
const Joi = require("joi");

likes = express.Router();
likes.use(express.json());

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  postId: Joi.number(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] }
  })
});

likes.post("/add", (req, res) => {
  console.log(req.body);
  const result = schema.validate(req.body);
  if (typeof result.error === "undefined") {
    db.query(
      "insert into `likes` (username,postId) values(?,?)",
      [result.value.username, result.value.postId],
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

likes.delete("/unlike", (req, res) => {
  console.log(req.body);
  const result = schema.validate(req.body);
  if (typeof result.error === "undefined") {
    db.query(
      "delete from `likes` where username = ? and postId = ?",
      [result.value.username, result.value.postId],
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

likes.get("/feed/:username", (req, res) => {
  const result = schema.validate({
    username: req.params.username
  });
  try {
    if (typeof result.error === "undefined") {
      db.query(
        "select postId, count(postId) as likes from `likes` GROUP by postId ORDER by postId DESC",
        function(error, results, fields) {
          if (error)
            return res.status(404).send({ status: 404, error: error.message });
          return res.send({ status: 200, data: results });
        }
      );
    } else {
      return res.status(400).send({ status: 400, error: result.error.message });
    }
  } catch (err) {
    console.log(err);
    return res.send({ status: 404, data: "Unexpected Error" });
  }
});

module.exports = likes;
