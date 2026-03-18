const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", issueRoutes);

app.get("/", (req, res) => {
  res.send("Smart City Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});