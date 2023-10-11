const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const productsRoute = require("./routes/products");
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')

app.use(cors(corsOptions))

app.use(express.json());

app.use(cookieParser())

const PORT = process.env.PORT || 5000;

// ROUTES PRISMA
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productsRoute);

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT} | http://localhost:${PORT}/`)
})

module.exports = app