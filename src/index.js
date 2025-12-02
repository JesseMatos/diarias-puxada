const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const tripsRoutes = require("./routes/trips");
const authenticate = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Rota simples para testar
app.get("/", (req, res) => {
  res.json({ message: "API de Diárias funcionando!" });
});

// Rotas públicas
app.use("/auth", authRoutes);

// Rotas protegidas
app.use("/trips", authenticate, tripsRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
