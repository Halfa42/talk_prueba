const express = require("express");
const cors = require("cors");
const path = require("path");
const { query } = require("./Database/index");

const app = express();
const tutorRoutes = require("./routes/tutor");

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/tutor", tutorRoutes);

app.get("/api/test", (req, res) => {
  res.json({ mensaje: "Backend funcionando" });
});

const fetchDatabaseNow = async () => {
  const result = await query("SELECT NOW()");
  return result.rows[0].now;
};

const DBsuccess = (res, timestamp) => {
  res.json({
    status: "✅ Conectado a la base de datos",
    timestamp,
  });
};

const DBerror = (res, error) => {
  res.status(500).json({
    status: "❌ Error de conexión",
    error: error.message,
  });
};

const handleDbCheck = async (req, res) => {
  try {
    const timestamp = await fetchDatabaseNow();
    DBsuccess(res, timestamp);
  } catch (error) {
    DBerror(res, error);
  }
};

app.get("/api/db-check", handleDbCheck);

const authRoutes = require("./routes/auth");
const orgRoutes = require("./routes/org");

app.use("/api/auth", authRoutes);
app.use("/api/org", orgRoutes);

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});