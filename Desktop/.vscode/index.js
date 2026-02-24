// console.log("learning backend initialized")
const express = require("express");

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/about", (req, res) => {
  res.send("<h1>about page mohit sinha</h1>");
});

app.get("/contact", (req, res) => {
  res.send("<h1>contact page mohit sinha</h1>");
});
app.get("/signup", (req, res) => {
  res.send("<h1>signup page mohit sinha</h1>");
});

app.get("/instagram", (req, res) => {
  res.send("instagram page mohit sinha");
});

app.get("/facebook", (req, res) => {
  res.send("facebook page mohit sinha");
});

app.get("/linkedin", (req, res) => {
  res.send("linkedin page mohit sinha");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
