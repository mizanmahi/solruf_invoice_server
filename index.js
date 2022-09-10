const express = require("express");

const app = express();

app.use("/invoice", require("./routes/invoice"));

app.listen(8000, () => {
  console.log("server running on port ", 8000);
});
