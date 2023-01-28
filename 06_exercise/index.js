const express = require("express");
const app = express();
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postsRoute = require("./routes/posts");

dotenv.config();

app.use(express.json());

  // ROUTES PRISMA
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/posts", postsRoute);

  // LISTEN TO PORT
  app.listen("5000", () => {
    console.log("Backend is running.");
  });
