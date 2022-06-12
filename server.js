import express from "express";
import path from "path";

const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  let html = path.resolve(__dirname, "public", "index.html");
  res.sendFile(html);
});

app.listen(8082, () => {
  console.log("Web Application server started");
});
