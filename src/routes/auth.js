const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "driver" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "E-mail já cadastrado" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role }
    });

    await prisma.wallet.create({
      data: { driverId: user.id, balance: 0, threshold: 100 }
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.status(201).json({ message: "Usuário criado", user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Credenciais faltando" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Senha incorreta" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "Erro ao fazer login" });
  }
});

module.exports = router;
