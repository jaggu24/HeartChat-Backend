const db = require("../database");
const express = require("express");
const Joi = require("joi");

post = express.Router();
post.use(express.json());

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  post: Joi.string().min(1),

  postId: Joi.number(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] }
  })
});

post.post("/add", (req, res) => {
  console.log(req.body);
  const result = schema.validate(req.body);
  if (typeof result.error === "undefined") {
    db.query(
      "insert into `post` (username,post) values(?,?)",
      [result.value.username, result.value.post],
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

post.put("/edit", (req, res) => {
  console.log(req.body);
  const result = schema.validate(req.body);
  if (typeof result.error === "undefined") {
    db.query(
      "update `post` set post = ? where postId = ?",
      [result.value.post, result.value.postId],
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

post.delete("/remove", (req, res) => {
  console.log(req.body);
  const result = schema.validate(req.body);
  if (typeof result.error === "undefined") {
    db.query(
      "delete from `post` where postId = ? and username = ?",
      [result.value.postId, result.value.username],
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

post.get("/feed/:username", (req, res) => {
  const result = schema.validate({
    username: req.params.username
  });
  try {
    if (typeof result.error === "undefined") {
      db.query("SELECT * from `post` ORDER BY postId DESC", function(
        error,
        results,
        fields
      ) {
        if (error)
          return res.status(404).send({ status: 404, error: error.message });
        return res.send({ status: 200, data: results });
      });
    } else {
      return res.status(400).send({ status: 400, error: result.error.message });
    }
  } catch (err) {
    console.log(err);
    return res.send({ status: 404, data: "Unexpected Error" });
  }
});

module.exports = post;
