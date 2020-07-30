const express = require("express");
const app = express();
const auth = require("./routes/auth");

app.use(auth);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/post", (req, res) => {
  res.send({ posts: "postid" });
});

app.post("/addPost", (req, res) => {
  res.send({ sendId: req.body.postId });
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listerning to ${port}....`));
