const express = require("express");
const port = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded());



app.post("/", (req, res) => {
    console.log(req.body);
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
