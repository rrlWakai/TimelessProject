import express from "express";
import cors from "cors";
import reservationsRouter from "./routes/reservations";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "timeless-api" });
});

// ✅ Add this:
app.use("/api/reservations", reservationsRouter);

app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});
