import dotenv from "dotenv";
dotenv.config();
import express, { urlencoded } from "express";
import mongoose from "mongoose";

import userRouter from "./routes/user.js";

let server = express();

server.use(express.json());
server.use(urlencoded({ extended: false }));

server.use("/api/auth", userRouter);

const start = async () => {
  await mongoose.connect(process.env.DB_URL);

  server.listen(process.env.PORT || 8000, () => console.log(`server is listening on port ${process.env.PORT}`));
};

mongoose.connection.once("open", () => console.log("connected to the database successfully"));
mongoose.connection.on("error", (err) => console.log("some error occured\n", err));

start();
