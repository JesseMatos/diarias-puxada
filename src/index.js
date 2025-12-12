const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const tripsRoutes = require("./routes/trips");
const authenticate = require("./middleware/auth");

const app = express();

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "https://shiny-adventure-59p7jqjx64wf7rvq-3333.app.github.dev",
    "https://shiny-adventure-59p7jqjx64wf7rvq-5502.app.github.dev",
    "https://shiny-adventure-59p7jqjx64wf7rvq-8080.app.github.dev"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());

// Rota simples
app.get("/", (req, res) => {
  res.json({ message: "API de Diárias funcionando!" });
});

// Rotas públicas
app.use("/auth", authRoutes);

// Rotas protegidas
app.use("/trips", authenticate, tripsRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
