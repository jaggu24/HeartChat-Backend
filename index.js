const express = require("express");
const app = express();
const auth = require("./routes/auth");

app.use("/auth", auth);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listerning to ${port}....`));
