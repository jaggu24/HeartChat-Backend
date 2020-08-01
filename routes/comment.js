const db = require("../database");
const express = require("express");
const Joi = require("joi");

comment = express.Router();
comment.use(express.json());

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  comment: Joi.string().min(1),

  postId: Joi.number(),

  commentId: Joi.number(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] }
  })
});

comment.post("/add", (req, res) => {
  console.log(req.body);
  const result = schema.validate(req.body);
  if (typeof result.error === "undefined") {
    db.query(
      "insert into `comments` (postId,username,comment) values(?,?,?)",
      [result.value.postId, result.value.username, result.value.comment],
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

comment.put("/edit", (req, res) => {
  console.log(req.body);
  const result = schema.validate(req.body);
  if (typeof result.error === "undefined") {
    db.query(
      "update `comments` set comment = ? where commentId = ?",
      [result.value.comment, result.value.commentId],
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

comment.delete("/remove", (req, res) => {
  console.log(req.body);
  const result = schema.validate(req.body);
  if (typeof result.error === "undefined") {
    db.query(
      "delete from `comments` where commentId = ? and username = ?",
      [result.value.commentId, result.value.username],
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

comment.get("/feed/:username", (req, res) => {
  const result = schema.validate({
    username: req.params.username
  });
  try {
    if (typeof result.error === "undefined") {
      db.query(
        "SELECT * from `comments` ORDER BY postId DESC, commentId ASC",
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

module.exports = comment;
