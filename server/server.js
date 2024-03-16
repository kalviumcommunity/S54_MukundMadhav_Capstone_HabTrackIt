const express = require("express");
const app = express();
const mongoose = require("mongoose")
const PORT = process.env.PORT || 3000;

const router = require("./routes/router")


app.use(express.json())
app.use("/",router)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
