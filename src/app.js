const express = require("express");
require("dotenv").config();
const routes = require("./routes/routers");
const morgan = require("morgan");
const cors = require("cors");
const { errorMiddleware } = require("./middlewares/errorsManager");

const app = express();
const {CLIENT_URL} = process.env;
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({

    origin:[CLIENT_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE" , "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(routes);
app.use(errorMiddleware);
app.use((req, res, next) => {
    res.status(404).json({ msg: "Ruta no encontrada" });
});

module.exports = app;
