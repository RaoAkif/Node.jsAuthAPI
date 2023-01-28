const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/v1/auth");
const userRoute = require("./routes/v1/users");
const postsRoute = require("./routes/v1/posts");
const authRoutePrisma = require("./routes/v2/auth");
const userRoutePrisma = require("./routes/v2/users");
const postsRoutePrisma = require("./routes/v2/posts");

dotenv.config();

app.use(express.json());

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

  // ROUTES
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/posts", postsRoute);

  // ROUTES PRISMA
  app.use("/api/v2/auth", authRoutePrisma);
  app.use("/api/v2/users", userRoutePrisma);
  app.use("/api/v2/posts", postsRoutePrisma);

  // LISTEN TO PORT
  app.listen("5000", () => {
    console.log("Backend is running.");
  });
