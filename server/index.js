import cors from "cors";
import express from "express";
import userRouter from "./src/routes/user-router.js";
import "dotenv/config";
import requestLogger from "./src/middlewares/logger.js";
import entryRouter from "./src/routes/entry-router.js";
import kubiosRouter from "./src/routes/kubios-router.js";

// index.js: pääserveritiedosto, joka määrittää Express-sovelluksen, reitit ja middlewaret, ja käynnistää palvelimen
const hostname = "127.0.0.1";
const app = express();
const PORT = 3000;

// Middlewaret
app.use(express.json());
app.use(cors("/", express.static("public")));

// Api root
app.get("/api", (req, res) => {
  res.send("This is dummy items API!");
});

app.use("/api/users", userRouter);

//Entry router
app.use("/api/entries", entryRouter);

// Kubios data router
app.use("/api/kubios", kubiosRouter);

// Käynnistetään palvelin
app.listen(PORT, hostname, () => {
  console.log(`Server running on http://${hostname}:${PORT}/`);
});
// Virheenkäsittely middlewaret
app.use(requestLogger);

app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;

  res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      details: err.errors || null,
    },
  });
});
