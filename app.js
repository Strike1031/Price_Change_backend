import cors from "cors";
import mongoose from "mongoose";
import Config from "./config.js";
import { Server } from "socket.io";
import {getTableData} from './controllers/pcs.js';
/*
var createError = require('http-errors');
var express = require('express'); 

var path = require('path');
var cookieParser = require('cookie-parser');
 var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
*/
import http from "http";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// var indexRouter = require('./routes/index.js');
// var apiRouter = require('./routes/api.js');
import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api.js";

var app = express();
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//middleware
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

/**
 *    Router
 *
 */
app.use("/", indexRouter);
app.use("/api", apiRouter);

/**
 *    Socket connection
 *
 */
const port = process.env.PORT || 5000;
let io = new Server(port, {cors: {
  origin: '*',
}});

io.on("connection", (socket) => {
  console.log("New user connected");

  //listen for message from user (user will send priceChange api by second)
  socket.on("priceChange", async() => {
    const data = await getTableData();
    socket.emit("priceChange", JSON.stringify(data));
  });

  //when server disconnects from user
  socket.on("disconnect", () => {
    console.log('Disconnected from user!!');
  });
});
/**
 *  MongoDB connection
 *
 */
// const {mainDB} = Config();
// mongoose.connect(mainDB);

/**
 *   Error handler
 */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// module.exports = app;
export default app;
