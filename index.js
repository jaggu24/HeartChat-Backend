const express = require("express");
const app = express();
const auth = require("./routes/auth");
const post = require("./routes/post");
const comment = require("./routes/comment");
const likes = require("./routes/likes");

app.use("/auth", auth);
app.use("/post", post);
app.use("/comment", comment);
app.use("/likes", likes);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listerning to ${port}....`));
